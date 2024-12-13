const express = require("express");
const { generateEmployeeReport } = require("../controllers/reportController");
const router = express.Router();
router.get("/employee-report", generateEmployeeReport);

module.exports = router;
