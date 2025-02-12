const Salary = require('../model/salaryModel');
const Attendance = require('../model/attendanceModel');

const moment=require('moment');
const mongoose=require('mongoose');
module.exports.calculateAndSaveSalary = async (req, res) => {
  try {
    const { month, year, id } = req.params; 
    const { baseSalary, bonus, extraHoursWorked } = req.body;
    if (!month || !year) {
      return res.status(400).json({ message: "Invalid month or year" });
    }
    const startDate = moment().year(year).month(month - 1).startOf('month').toDate();
    const endDate = moment().year(year).month(month - 1).endOf('month').toDate();

    const attendanceRecords = await Attendance.find({
      user: id,
      timestamp: { $gte: startDate, $lte: endDate },
    });

    let presentCount = 0;
    let absentCount = 0;
    attendanceRecords.forEach(record => {
      if (record.status === 'present') {
        presentCount++;
      } else if (record.status === 'absent') {
        absentCount++;
      }
    });

    const existingSalary = await Salary.findOne({
      user: id,
      month: parseInt(month),
      year: parseInt(year),
    });

    if (existingSalary) {
      existingSalary.baseSalary = baseSalary || existingSalary.baseSalary;
      existingSalary.bonus = bonus || existingSalary.bonus;
      existingSalary.extraHoursWorked = extraHoursWorked || existingSalary.extraHoursWorked;
      existingSalary.presentCount = presentCount;

      await existingSalary.calculateSalary(presentCount, absentCount, extraHoursWorked, bonus, baseSalary);
      await existingSalary.save();

      return res.status(200).json({
        message: "Salary updated successfully",
        salary: existingSalary,
      });
    }

    const salary = new Salary({
      user: id,
      month: parseInt(month),
      year: parseInt(year),
      baseSalary: baseSalary || 0,
      bonus: bonus || 0,
      extraHoursWorked: extraHoursWorked || 0,
      presentCount: presentCount,
    });

    await salary.calculateSalary(presentCount, absentCount, extraHoursWorked, bonus, baseSalary);
    await salary.save();

    return res.status(200).json({
      message: "Salary calculated and saved successfully",
      salary: salary,
    });
  } catch (error) {
    console.error("Error calculating salary:", error);
    return res.status(500).json({ message: "Error calculating salary" });
  }
};



module.exports.getSalaryDetails = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { month, year } = req.query;

    const query = { user: userId };
    if (month && year) {
      query.month = month;
      query.year = year;
    }

    const salaries = await Salary.find(query);

    if (!salaries.length) {
      return res.status(404).json({ message: "No salary records found" });
    }

    return res.status(200).json({ message: "Salary records fetched successfully", salaries });
  } catch (error) {
    console.error("Error fetching salary details:", error);
    res.status(500).json({ message: "Error fetching salary details" });
  }
};



const PDFDocument = require('pdfkit');

module.exports.generateslips = async (req, res) => {
  try {
    const { salaryId } = req.params;
    const salary = await Salary.findById(salaryId).populate('user');
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="payslip-${salaryId}.pdf"`
    );
    const doc = new PDFDocument();
    doc.pipe(res); 
    doc.fontSize(16).text(`Pay Slip for ${salary.user.username}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Month: ${salary.month}, Year: ${salary.year}`);
    doc.text(`Base Salary: ${salary.baseSalary}`);
    doc.text(`Bonus: ${salary.bonus}`);
    doc.text(`Extra Hours Worked: ${salary.extraHoursWorked}`);
    doc.text(`Total Salary: ${salary.totalSalary}`);
    doc.text(`Present Days: ${salary.presentCount}`);
    doc.text(`Status: ${salary.status}`);
    doc.text('Thank you for your hard work!', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error("Error generating pay slip:", error);
    res.status(500).json({ message: "Error generating pay slip" });
  }
};




module.exports.updateSalary=async(req,res)=>{
  try{
    const {salaryId}=req.params;
    const updates=req.body;
    const salary=await Salary.findById(salaryId);
    if(!salary){
      return res.status(404).json({message:"Salary record not found"});
      }
      Object.keys(updates).forEach((key)=>{
        salary[key]=updates[key];
      });
      await salary.save();
      res.status(200).json({message:"Salary updated successfully"});

  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: "Error updating salary" });
  }
}



module.exports.deleteSalary=async(req,res)=>{
  try{
    const {salaryId}=req.params;
    const salary=await Salary.findByIdAndDelete(salaryId);
    if(!salary){
      res.status(400).json({message:"salary record not found"});
    }
    return res.status(200).json({message:"salary record deleted successfully"});
  }
  catch(error){
    console.log(error);
    res.status(400).json({message:"error in deleting"});
  }
}


module.exports.getSalary = async (req, res) => {
  try {
    const { year, month, employeeId } = req.params;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and Year are required' });
    }

    if (isNaN(month) || isNaN(year)) {
      return res.status(400).json({ message: 'Month and Year must be valid numbers' });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({ message: 'Invalid month. It must be between 1 and 12' });
    }

    if (year.length !== 4 || isNaN(year)) {
      return res.status(400).json({ message: 'Invalid year format. Year must be a 4-digit number' });
    }

    // Convert employeeId to ObjectId to match the MongoDB _id format
    const employeeObjectId = mongoose.Types.ObjectId.isValid(employeeId)
      ? new mongoose.Types.ObjectId(employeeId)
      : null;

    if (!employeeObjectId) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }
    const salaryDetails = await Salary.find({
      user: employeeObjectId,
      month: parseInt(month), 
      year: parseInt(year),
    }).lean();

    if (salaryDetails.length === 0) {
      return res.status(404).json({ message: `No salary data found for ${employeeId} in month ${month}, year ${year}.` });
    }

    return res.status(200).json({
      message: 'Salary details fetched successfully',
      salaryId: salaryDetails[0]._id, 
      salaries: salaryDetails,
    });
  } catch (error) {
    console.error('Error fetching salary details:', error);
    return res.status(500).json({ message: 'Error fetching salary details' });
  }
};

