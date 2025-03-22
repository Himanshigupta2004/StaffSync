const Attendance = require("../model/attendanceModel");
const geolib = require("geolib");
const moment = require("moment");
const OFFICE_LOCATION = { latitude: 30.515162, longitude: 76.6625374 }; // Chitkara Turing Campus
const RADIUS_METERS = 1000; // Radius in meters
const TIME_THRESHOLD_MINUTES = 1; //timing


let userTimers = {};

const isWithinRadius = (userCoords, officeCoords, radius) => {
  const distance = geolib.getDistance(userCoords, officeCoords);
  console.log("Calculated Distance:", distance, "meters");
  return distance <= radius; 
};

const isAttendanceMarkedForToday = async (userId) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const existingAttendance = await Attendance.findOne({
    user: userId,
    timestamp: { $gte: startOfDay, $lte: endOfDay },
  });

  return existingAttendance;
};

module.exports.markAttendance = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Please provide valid latitude and longitude." });
    }

    const userLocation = { 
      latitude: parseFloat(latitude), 
      longitude: parseFloat(longitude),
    };

    if (isNaN(userLocation.latitude) || isNaN(userLocation.longitude)) {
      return res.status(400).json({ message: "Invalid latitude or longitude." });
    }

    const officeLocation = { 
      latitude: OFFICE_LOCATION.latitude, 
      longitude: OFFICE_LOCATION.longitude,
    };

    console.log("User Location:", userLocation);
    console.log("Office Location:", officeLocation);

    const attendanceAlreadyMarked = await isAttendanceMarkedForToday(userId);
    if (attendanceAlreadyMarked) {
      return res.status(400).json({ message: "Attendance has already been marked for today." });
    }

    if (isWithinRadius(userLocation, officeLocation, RADIUS_METERS)) {
      if (!userTimers[userId]) {
        userTimers[userId] = { entryTime: new Date(), totalTimeInside: 0 };
      }

      const timeSpentInsideRadius = 
        (new Date() - userTimers[userId].entryTime) / 1000 / 60;

      console.log(`User ${userId} has been inside for ${timeSpentInsideRadius} minutes.`);
      if (timeSpentInsideRadius >= TIME_THRESHOLD_MINUTES) {
        const attendance = await Attendance.create({
          user: userId,
          location: { latitude, longitude },
          timestamp: new Date(),
          status: "present", 
        });

        delete userTimers[userId]; 

        return res.status(200).json({
          message: "Attendance marked as present.",
          attendance,
        });
      } else {
        return res.status(200).json({
          message: `You have been inside the radius for ${timeSpentInsideRadius.toFixed(2)} minutes. Keep waiting to mark attendance.`,
        });
      }
    } else {
      if (userTimers[userId]) {
        userTimers[userId].totalTimeInside += 
          (new Date() - userTimers[userId].entryTime) / 1000 / 60; 
        console.log(`Paused timer for user: ${userId}, Total time inside: ${userTimers[userId].totalTimeInside} minutes`);
        delete userTimers[userId]; 
      }

      return res.status(200).json({
        message: "You are outside the allowed location radius. Timer paused.",
      });
    }
  } catch (error) {
    console.error("Error marking attendance:", error.message, error.stack);
    return res.status(500).json({ message: "An error occurred while marking attendance." });
  }
};


module.exports.getMonthlyAttendance=async(req,res)=>{
    try{
        const userId=req.user.id;
        const {month,year}=req.params;

        if(!month || !year){
            return res.status(400).json({message:"Invalid month or year"});
        }
         
    const startDate = moment().year(year).month(month - 1).startOf('month').toDate();
    const endDate = moment().year(year).month(month - 1).endOf('month').toDate();

    console.log(`Fetching attendance for: ${startDate} to ${endDate}`);

    const attendanceRecords=await Attendance.find({
        user:userId,
        timestamp: { $gte: startDate, $lte: endDate } 
    
    }).sort({timestamp:1});   

    return res.status(200).json({
        message: "Attendance records for the month fetched successfully",
        attendance: attendanceRecords
      });
   


    }
    catch(error){
        console.error("Error fetching monthly attendance:", error);
        res.status(400).json({message:"error fetching data"});
    }
}

module.exports.countMonthlyAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.params;

    if (!month || !year) {
      return res.status(400).json({ message: "Invalid month or year" });
    }

    const startDate = moment().year(year).month(month - 1).startOf('month');
    const today = moment().endOf('day'); 
    const endDate = today.isBefore(moment(`${year}-${month}-01`).endOf('month')) ? today : moment(`${year}-${month}-01`).endOf('month');

    console.log(`Fetching attendance for: ${startDate} to ${endDate}`);
    const attendanceRecords = await Attendance.find({
      user: userId,
      timestamp: { $gte: startDate.toDate(), $lte: endDate.toDate() }
    }).sort({ timestamp: 1 }); 

    console.log("Attendance records:", attendanceRecords);
    const recordedDates = new Map();

    attendanceRecords.forEach(record => {
      const formattedDate = moment(record.timestamp).format('YYYY-MM-DD');

      if (recordedDates.has(formattedDate)) {
        if (record.status === 'present') {
          recordedDates.set(formattedDate, 'present');
        }
      } else {
        recordedDates.set(formattedDate, record.status);
      }
    });

    let attendanceCount = 0;
    let absenceCount = 0;

    for (let date = moment(startDate); date.isBefore(endDate); date.add(1, 'days')) {
      const formattedDate = date.format('YYYY-MM-DD');
      console.log(`Checking records for date: ${formattedDate}`);

      if (recordedDates.has(formattedDate)) {
        if (recordedDates.get(formattedDate) === 'present') {
          console.log(`${formattedDate} - Present`);
          attendanceCount++;
        } else {
          console.log(`${formattedDate} - Absent`);
          absenceCount++;
        }
      } else {

        console.log(`${formattedDate} - Absent`);
        absenceCount++;
      }
    }

    console.log(`Attendance Count: ${attendanceCount}`);
    console.log(`Absence Count: ${absenceCount}`);

    return res.status(200).json({
      message: "Attendance records for the month fetched successfully",
      presentCount: attendanceCount,
      absentCount: absenceCount
    });

  } catch (error) {
    console.error("Error fetching monthly attendance:", error);
    res.status(400).json({ message: "Error fetching data" });
  }
};

module.exports.markAbsentIfRecordDoesNotExist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.params;
    if (!month || !year || isNaN(month) || isNaN(year)) {
      return res.status(400).json({ message: "Invalid month or year" });
    }

    const startDate = moment(`${year}-${month}-01`).startOf('day'); 
    const today = moment().endOf('day'); 
    const endDate = moment(startDate).endOf('month'); 
  
    const finalEndDate = today.isBefore(endDate) ? today : endDate;

    console.log(`Checking attendance from ${startDate.format('YYYY-MM-DD')} to ${finalEndDate.format('YYYY-MM-DD')}`);
  
    const attendanceRecords = await Attendance.find({
      user: userId,
      timestamp: { $gte: startDate.toDate(), $lte: finalEndDate.toDate() }
    }).sort({ timestamp: 1 });

    const recordedDates = new Set(
      attendanceRecords.map(record => moment(record.timestamp).format('YYYY-MM-DD'))
    );


    const datesOfMonth = [];
    let currentDate = moment(startDate);


    while (currentDate.isBefore(finalEndDate)) {
      datesOfMonth.push(currentDate.format('YYYY-MM-DD'));
      currentDate.add(1, 'days');
    }

    console.log("Dates of the month:", datesOfMonth);

    const missingDates = datesOfMonth.filter(date => !recordedDates.has(date));

    console.log("Missing Dates:", missingDates);
const absentRecords = missingDates.map(date => {
 
  const absentDate = moment.utc(date, 'YYYY-MM-DD').startOf('day').toDate();
  return {
    user: userId,
    timestamp: absentDate,
    status: 'absent'
  };
});

    if (absentRecords.length > 0) {
      await Attendance.insertMany(absentRecords);
    }

    
    res.status(200).json({
      message: "Attendance records for the month updated successfully",
      absentDays: absentRecords.length,
      details: absentRecords
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in marking absent" });
  }
};


module.exports.countEmployeeAttendance = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { employeeId, month, year } = req.params; 

    if (!employeeId || !month || !year) {
      return res.status(400).json({ message: "Invalid employee ID, month, or year" });
    }

    const startDate = moment().year(year).month(month - 1).startOf('month'); 
    const today = moment().endOf('day'); 
    const endDate = today.isBefore(moment(`${year}-${month}-01`).endOf('month')) ? today : moment(`${year}-${month}-01`).endOf('month');

    console.log(`Fetching attendance for employee ${employeeId} from ${startDate} to ${endDate}`);

    const attendanceRecords = await Attendance.find({
      user: employeeId,  
      timestamp: { $gte: startDate.toDate(), $lte: endDate.toDate() }
    }).sort({ timestamp: 1 }); 

    const recordedDates = new Map();

    attendanceRecords.forEach(record => {
      const formattedDate = moment(record.timestamp).format('YYYY-MM-DD');

      if (recordedDates.has(formattedDate)) {
        if (record.status === 'present') {
          recordedDates.set(formattedDate, 'present');
        }
      } else {
        recordedDates.set(formattedDate, record.status);
      }
    });

    let attendanceCount = 0;
    let absenceCount = 0;

    for (let date = moment(startDate); date.isBefore(endDate); date.add(1, 'days')) {
      const formattedDate = date.format('YYYY-MM-DD');
      if (recordedDates.has(formattedDate)) {
        if (recordedDates.get(formattedDate) === 'present') {
        
          attendanceCount++;
        } else {
      
          absenceCount++;
        }
      } else {
       
        absenceCount++;
      }
    }
    console.log(`Attendance Count: ${attendanceCount}`);
    console.log(`Absence Count: ${absenceCount}`);

    return res.status(200).json({
      message: "Attendance records for the employee fetched successfully",
      presentCount: attendanceCount,
      absentCount: absenceCount
    });

  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(400).json({ message: "Error fetching data" });
  }
};
