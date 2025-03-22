const express = require("express");
const { markAttendance,
    getMonthlyAttendance,
    countMonthlyAttendance,
    markAbsentIfRecordDoesNotExist,
    countEmployeeAttendance } = require("../controllers/attendanceControllers");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/mark", protect(["employee","hr"]), markAttendance);
router.get('/marking/:year/:month', protect(["employee","hr"]), getMonthlyAttendance);
router.get("/monthly-record/:year/:month",protect(["employee","hr"]),countMonthlyAttendance);
router.post("/absent-record/:year/:month",protect(["employee","hr"]),markAbsentIfRecordDoesNotExist);
router.get("/check-attendance/:year/:month/:employeeId",protect(["hr"]),countEmployeeAttendance);
module.exports = router;
