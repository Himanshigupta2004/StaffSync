import React, { useState, useEffect } from "react";
import axios from "axios";
import './ApproveLeave.css';
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const getTokenFromLocalStorage = () => {
    return localStorage.getItem("jwt-token");
  };

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = getTokenFromLocalStorage();
        if (!token) {
          setMessage("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/leave/all-leaves`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setLeaves(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaves:", error);
        setMessage(error.response?.data?.message || "An error occurred while fetching leave requests");
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const approveLeave = async (leaveId) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        setMessage("No token found. Please log in.");
        return;
      }

      await axios.put(
        `${BASE_URL}/api/leave/approve-leave/${leaveId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setMessage("Leave approved successfully.");
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === leaveId ? { ...leave, status: "approved" } : leave
        )
      );
    } catch (error) {
      console.error("Error approving leave:", error);
      setMessage(error.response?.data?.message || "An error occurred while approving leave");
    }
  };

  const rejectLeave = async (leaveId) => {
    try {
      const token = getTokenFromLocalStorage();
      if (!token) {
        setMessage("No token found. Please log in.");
        return;
      }

      await axios.put(
        `${BASE_URL}/api/leave/reject-leave/${leaveId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Leave rejected successfully.");
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === leaveId ? { ...leave, status: "rejected" } : leave
        )
      );
    } catch (error) {
      console.error("Error rejecting leave:", error);
      setMessage(error.response?.data?.message || "An error occurred while rejecting leave");
    }
  };

  return (
    <div className="manage-leaves-container">
  <h2>Manage Leave Requests</h2>

  {loading ? (
    <p>Loading leaves...</p>
  ) : (
    <div className="leaves-div-manage">
    <div>
      {message && <p className="message">{message}</p>}
      {leaves.length > 0 ? (
        <ul className="leave-list">
          {leaves.map((leave) =>
            leave.status === "pending" ? (
              <li key={leave._id} className="leave-item">
                <p>
                  <strong>User:</strong> {leave.user.username || "Unknown User"} <br />
                  <strong>Start Date:</strong>{" "}
                  {new Date(leave.startDate).toLocaleDateString()} <br />
                  <strong>End Date:</strong>{" "}
                  {new Date(leave.endDate).toLocaleDateString()} <br />
                  <strong>Reason:</strong> {leave.leaveReason}
                </p>
                <div className="buttons-container">
                  <button onClick={() => approveLeave(leave._id)} className="approve">
                    Approve
                  </button>
                  <button onClick={() => rejectLeave(leave._id)} className="reject">
                    Reject
                  </button>
                </div>
                
              </li>
            ) : null
          )}
        </ul>
      ) : (
        <p className="no-requests">No pending leave requests.</p>
      )}
    </div>
    </div>
  )}
</div>
  );
};

export default ManageLeaves;
