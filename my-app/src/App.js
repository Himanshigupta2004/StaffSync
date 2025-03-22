import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Main from "./components/Main.jsx";
import Leave from "./pages/Leave.jsx";
import Navbar from "./components/Navbar.jsx";
import Attendance from "./pages/Attendance.jsx";
import Leave_hr from "./pages/Leave_hr.jsx";
import SalaryManagement from "./pages/SalaryManagement.jsx";
import SalaryEmployee from "./pages/SalaryEmployee.jsx";
import ScheduleMeeting from "./components/ScheduleMeeting.jsx";
import GetMeetings from "./components/GetMeetings.jsx";
import ReportDashboard from "./components/ReportDashboard.jsx";
import { Home } from "./components/Home.jsx";
import { jwtDecode } from "jwt-decode";

const API_URL = process.env.REACT_APP_API_URL; // Backend URL from .env

function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // Store user data from backend

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        setUserRole(decodedToken.role);

        // Fetch User Data from Backend
        fetch(`${API_URL}/api/user-data`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch user data");
            }
            return response.json();
          })
          .then((data) => {
            console.log("User Data:", data);
            setUserData(data);
          })
          .catch((error) => console.error("Error fetching user data:", error));

      } catch (error) {
        console.error("Invalid token", error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log("User Role:", userRole);

  return (
    <Router>
      <div className="App">
        <Navbar userRole={userRole} />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
          {/* Common routes for both HR and Employee */}
          <Route path="/dashboard" element={<Main />} />
          <Route path="/" element={<Home />} />

          {/* Shared links for HR and Employee */}
          <Route path="/leave" element={<Leave />} />
          <Route path="/attendance" element={<Attendance />} />

          {/* Employee-specific routes */}
          <Route path="/salary-employee" element={<SalaryEmployee />} />
          <Route path="/get-meetings" element={<GetMeetings />} />

          {/* HR-specific routes */}
          <Route path="/schedule-meeting" element={<ScheduleMeeting />} />
          <Route path="/leave-hr" element={<Leave_hr />} />
          <Route path="/salary-management" element={<SalaryManagement />} />

          <Route path="/report" element={<ReportDashboard />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;