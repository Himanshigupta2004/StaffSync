import React, { useState } from "react";
import axios from "axios";
import './GetSalaryDetails.css';
import money from '../assets/money.avif';

const GetSalaryDetails = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [message, setMessage] = useState("");

  const getSalary = async () => {
    const token = localStorage.getItem("jwt-token");

    if (!token) {
      setMessage("Please log in to fetch salary details.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/salary/get-salary/${year}/${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const salaries = response.data.salaries;

      if (salaries && salaries.length > 0) {
        const salary = salaries[0];
        if (salary.year === parseInt(year) && salary.month === parseInt(month)) {
          setSalaryDetails(salary);
          setMessage("Salary details fetched successfully.");
        } else {
          setSalaryDetails(null);
          setMessage(`No salary data found for ${year}-${month}.`);
        }
      } else {
        setSalaryDetails(null);
        setMessage(response.data.message || "No salary data found.");
      }
    } catch (error) {
      setMessage("Error fetching salary details.");
    }
  };

  const downloadPaySlip = async () => {
    if (!salaryDetails) {
      setMessage("No salary details to generate the payslip.");
      return;
    }

    try {
      const token = localStorage.getItem("jwt-token");

      const response = await axios.get(
        `http://localhost:5000/api/salary/generate-payslip/${salaryDetails._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // Important for downloading files
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `payslip-${salaryDetails._id}.pdf`; 
      link.click();
      setMessage("Payslip downloaded successfully.");
    } catch (error) {
      console.error("Error downloading payslip:", error);
      setMessage("Error generating or downloading the payslip.");
    }
  };

  return (
    <div className="get-salary-details">
      <div className="get-salary-details__form">
        <h2>Get Salary Details</h2>
        <br />
        <div className="divdiv">
          <label>
            Year:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </label>
          <label>
            Month:
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
            />
          </label>
          <img className="salary-image" src={money} alt="Salary Image" />
        </div>
        <button onClick={getSalary}>Fetch Salary Details</button>
      </div>

      {message && <p>{message}</p>}

      {salaryDetails && (
        <div className="get-salary-details__salary-records">
          <h3>Salary Details</h3>
          <div className="salary-detail">
            <div className="salary-column">
              <strong>Salary ID:</strong>
              <span>{salaryDetails._id}</span>
            </div>
            <div className="salary-column">
              <strong>Month:</strong>
              <span>{`${year}-${month}`}</span>
            </div>
            <div className="salary-column">
              <strong>Bonus:</strong>
              <span>{salaryDetails.bonus}</span>
            </div>
            <div className="salary-column">
              <strong>Extra Hours:</strong>
              <span>{salaryDetails.extraHours}</span>
            </div>
            <div className="salary-column">
              <strong>Base Salary:</strong>
              <span>{salaryDetails.baseSalary}</span>
            </div>
            <div className="salary-column">
              <strong>Total Salary:</strong>
              <span>{salaryDetails.totalSalary}</span>
            </div>
          </div>
          <button onClick={downloadPaySlip}>Download Pay Slip</button>
        </div>
      )}
    </div>
  );
};

export default GetSalaryDetails;
