
import React from "react";
import "./ReportDashboard.css";

const ReportDashboard = () => {
  const downloadReport = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/report/employee-report", {
        method: "GET",
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Employee_Report.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Failed to download the report.");
      }
    } catch (error) {
      console.error("Error downloading the report:", error);
      alert("Error downloading the report.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Employee Report Dashboard</h1>
        <p>Generate and download the latest employee reports with one click.</p>
      </header>

      <div className="dashboard-actions">
        <button className="download-button" onClick={downloadReport}>
          Download Employee Report
        </button>
      </div>

      <footer className="dashboard-footer">
        <p>&copy;StaffSync</p>
      </footer>
    </div>
  );
};

export default ReportDashboard;
