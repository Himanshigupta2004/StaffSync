import React, { useState } from "react";
import axios from "axios";
import "./MonthlyAttendance.css";

const MonthlyAttendance = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [attendance, setAttendance] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Added state

  const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("jwt-token");
    console.log("Token retrieved from localStorage:", token);
    return token;
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setMessage("");
      setIsSubmitted(false); // Reset submission state initially

      if (!month || !year) {
        setMessage("Please enter both month and year.");
        setLoading(false);
        return;
      }

      if (isNaN(month) || isNaN(year) || month < 1 || month > 12 || year.length !== 4) {
        setMessage("Please enter a valid month (1-12) and a 4-digit year.");
        setLoading(false);
        return;
      }

      const token = getTokenFromLocalStorage();

      if (!token) {
        setMessage("No token found. Please login.");
        setLoading(false);
        return;
      }

      const url = `http://localhost:5000/api/att/monthly-record/${year}/${month}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAttendance(response.data);
      setMessage(response.data.message || "Attendance data fetched successfully.");
      setIsSubmitted(true); // Expand container on success
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setMessage(error.response?.data?.message || "Error fetching attendance data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`monthly-attendance-container ${isSubmitted ? "expanded" : ""}`}>
      <h2>Monthly Attendance</h2>
      <div className="input-container">
        <label>
          Month:
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Enter month (1-12)"
          />
        </label>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year (e.g., 2023)"
          />
        </label>
        <button onClick={fetchAttendance} disabled={loading} className="submit-button">
          {loading ? "Fetching..." : "Get Attendance"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}

      {attendance && (
        <div className="attendance-summary">
          <h3>Attendance Summary</h3>
          <div className="attendance-counts">
            <div className="attendance-item present">
              <p><strong>Present Count:</strong></p>
              <span>{attendance.presentCount}</span>
            </div>
            <div className="attendance-item absent">
              <p><strong>Absent Count:</strong></p>
              <span>{attendance.absentCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyAttendance;
