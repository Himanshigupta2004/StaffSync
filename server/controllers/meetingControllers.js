const Meeting=require('../model/meetingModel')
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const { ObjectId } = require('mongoose').Types; 
const User=require('../model/userModel');


module.exports.ScheduleMeeting = async (req, res) => {
  try {
    const { title, description, date, organizer, attendees } = req.body;
    console.log(req.body);

    if (!title || !description || !date || !organizer || !attendees) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const attendeeDocs = await User.find({ username: { $in: attendees } }); 
    const foundAttendees = attendeeDocs.map(user => user.username); 
    const notFoundAttendees = attendees.filter(name => !foundAttendees.includes(name)); 

    if (notFoundAttendees.length > 0) {
      return res.status(404).json({
        message: "Some attendees were not found",
        notFoundAttendees,
      });
    }

    const organizerDoc = await User.findOne({ username: organizer }); 
    if (!organizerDoc) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    const newMeeting = new Meeting({
      title,
      description,
      date,
      organizer: organizerDoc._id, 
      attendees: attendeeDocs.map(user => user._id), 
    });

    console.log(newMeeting);

    await newMeeting.save();

    res.status(200).json({ message: "Meeting scheduled successfully", meeting: newMeeting });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error in scheduling meeting", error });
  }
};







const uploadDirectory = path.join(__dirname, '..', 'uploads', 'memos');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

module.exports.uploadMemo = async (req, res) => {
    try {
        const form = new formidable.IncomingForm();
        form.uploadDir = uploadDirectory;
        form.keepExtensions = true; 
        form.multiples = false; 

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error('Error parsing the form:', err);
                return res.status(500).json({ message: 'Error processing the file upload' });
            }

            const uploadedFile = files.memo;
            if (!uploadedFile) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const meetingId = fields.meetingId;
            if (!meetingId) {
                return res.status(400).json({ message: 'Meeting ID is required' });
            }

            const meeting = await Meeting.findById(meetingId);
            if (!meeting) {
                return res.status(404).json({ message: 'Meeting not found' });
            }

            const filePath = uploadedFile.filepath; 
            const fileName = uploadedFile.originalFilename; 

            meeting.memo = {
                filePath,
                fileName,
            };

            await meeting.save();

            return res.status(200).json({
                message: 'Memo uploaded successfully',
                memoDetails: {
                    filePath,
                    fileName,
                },
                meeting,
            });
        });
    } catch (error) {
        console.error('Error in uploadMemo controller:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.getmeetings = async (req, res) => {
    try {
      const user = req.user; 
      console.log("User ID:", user.id); 
  
      const meetings = await Meeting.find({
        $or: [
          { organizer: user.id }, 
          { attendees: user.id }, 
        ],
      })
        .populate('organizer', 'username')
        .populate('attendees', 'username');
  
      console.log("Meetings found:", meetings); 
  
      res.status(200).json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ message: 'Error fetching meetings' });
    }
  };
  
  
  