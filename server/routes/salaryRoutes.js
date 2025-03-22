const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
const { calculateAndSaveSalary ,getSalaryDetails,generateslips,updateSalary,deleteSalary,getSalary} = require('../controllers/salaryControllers'); 
router.post('/calculate-salary/:month/:year/:id',protect(["hr"]), calculateAndSaveSalary);
router.get('/get-salary/:year/:month',protect(["employee"]),getSalaryDetails);
router.get('/generate-payslip/:salaryId',protect(["hr","employee"]),generateslips);
router.patch('/update-salary/:salaryId',protect(['hr']),updateSalary);
router.delete('/delete-salary/:salaryId',protect(['hr']),deleteSalary);
router.get('/getsalarydetails/:year/:month/:employeeId', protect(['hr', 'employee']), getSalary);

module.exports = router;
