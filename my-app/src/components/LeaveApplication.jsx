// LeaveApplication.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import './LeaveApplication.css';
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const LeaveApplication = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaves, setLeaves] = useState([]);

  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("jwt-token");
  };

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    if (!token) {
      setMessage("No token found. Please log in.");
      return;
    }
    fetchLeaves(token);
  }, []);

  const fetchLeaves = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/leave/get-my-leaves`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedLeaves = response.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setLeaves(sortedLeaves);
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setMessage(error.response?.data?.message || "An error occurred.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = getTokenFromLocalStorage();
    if (!token) {
      setMessage("No token found. Please log in.");
      setLoading(false);
      return;
    }
    if (!startDate || !endDate || !leaveReason) {
      setMessage("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/leave/apply`,
        { startDate, endDate, leaveReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      fetchLeaves(token);
      setStartDate("");
      setEndDate("");
      setLeaveReason("");
    } catch (error) {
      console.error("Error applying for leave:", error);
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-application">
      <div className="leave-form-container">
        <h2>Apply Leave</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="inputt start-date">
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="inputt end-date">
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="inputt reason">
              <label htmlFor="leaveReason">Leave Reason:</label>
              <textarea
                id="leaveReason"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="Enter the reason for leave"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="submit-leave-button">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="leave-records-container">
        <h3>Your Leave Records</h3>
        <div className="leave-records-header">
          <div className="record-header-item">No.</div>
          <div className="record-header-item">Start Date</div>
          <div className="record-header-item">End Date</div>
          <div className="record-header-item">Days</div>
          <div className="record-header-item">Reason</div>
          <div className="record-header-item">Status</div>
        </div>
        <div className="leave-records-body">
          {leaves.length > 0 ? (
            leaves.map((leave, index) => (
              <div className="leave-record-row" key={index}>
                <div className="record-item">{index + 1}</div>
                <div className="record-item">{new Date(leave.startDate).toLocaleDateString()}</div>
                <div className="record-item">{new Date(leave.endDate).toLocaleDateString()}</div>
                <div className="record-item">
                  {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 3600 * 24))} days
                </div>
                <div className="record-item">{leave.leaveReason}</div>
                <div className="record-item">{leave.status}</div>
              </div>
            ))
          ) : (
            <p className="no-records">No leave records found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;