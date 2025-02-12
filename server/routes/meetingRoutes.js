const express=require("express");
const {ScheduleMeeting,uploadMemo,getmeetings}=require("../controllers/meetingControllers");
const protect = require("../middleware/meetingMiddleware");
const router = express.Router();
router.post("/schedule-meeting",protect(["hr"]),ScheduleMeeting);
router.post('/upload-memo',protect(["hr","employee"]), uploadMemo);
router.get('/get-meetings',protect(['employee','hr']),getmeetings)
module.exports=router;
