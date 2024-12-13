const PDFKit = require("pdfkit");
const Users = require("../model/userModel");

module.exports.generateEmployeeReport = async (req, res) => {
  try {
    const employees = await Users.find({}, "username email role");

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employee records found." });
    }
    const doc = new PDFKit();
    const fileName = "Employee_Report.pdf";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    const stream = res;
    doc.pipe(stream);

    doc.fontSize(18).text("STAFFSYNC", { align: "center" });
    doc.fontSize(14).text("Employee Report", { align: "center" });
    doc.moveDown(1);

    const headers = ["Name", "Email", "Role"];
    const headerWidth = [150, 250, 100];
    const rowHeight = 20; 
    let startY = doc.y; 
    doc.rect(50, startY, headerWidth[0], rowHeight).stroke();
    doc.rect(200, startY, headerWidth[1], rowHeight).stroke();
    doc.rect(450, startY, headerWidth[2], rowHeight).stroke();
    doc.text(headers[0], 60, startY + 5);
    doc.text(headers[1], 210, startY + 5);
    doc.text(headers[2], 460, startY + 5);

    doc.moveDown(1);
    doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    employees.forEach((emp) => {
      const rowY = doc.y; 
      doc.rect(50, rowY, headerWidth[0], rowHeight).stroke();
      doc.text(emp.username, 60, rowY + 5);

      doc.rect(200, rowY, headerWidth[1], rowHeight).stroke();
      doc.text(emp.email, 210, rowY + 5);

      doc.rect(450, rowY, headerWidth[2], rowHeight).stroke();
      doc.text(emp.role || "Employee", 460, rowY + 5);

      doc.moveDown(1); 
    });

    doc.moveDown(1);
    doc.fontSize(10).text("Generated on: " + new Date().toLocaleString(), { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Error generating employee report" });
  }
};
