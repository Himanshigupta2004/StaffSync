const express = require('express');
const { ApplyLeave, approveLeave,rejectLeave,getLeaves, getmyleaves} = require("../controllers/leaveControllers");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

// Employees can apply for leave
router.post("/apply", protect(["employee"]), ApplyLeave);
router.get("/get-my-leaves",protect(["employee"]),getmyleaves);
// HR can approve leave
router.put('/approve-leave/:leaveId', protect(["hr"]), approveLeave);
router.put('/reject-leave/:leaveId', protect(["hr"]), rejectLeave);

//get all leaves
router.get('/all-leaves', protect(["hr"]), getLeaves);
module.exports = router;
