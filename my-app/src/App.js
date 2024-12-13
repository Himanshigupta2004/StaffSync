import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
import {jwtDecode} from "jwt-decode"; 

function App() {
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token"); 

    if (token) {
      try {
   
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken); 
        setUserRole(decodedToken.role); 
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

           {/* Common route for both HR and Employee  */}
          <Route path="/" element={<Main />} />

          {/* Both HR and employee can see these links */}
          <Route path="/leave" element={<Leave /> }/>
          <Route path="/attendance" element={ <Attendance /> } />

          {/* Employee-specific routes */}
          <Route path="/salary-employee" element={<SalaryEmployee /> } />
          <Route path="/get-meetings" element={<GetMeetings /> } />

          {/* HR-specific routes */}
          <Route path="/schedule-meeting" element={<ScheduleMeeting /> } />
          <Route path="/leave-hr" element={<Leave_hr /> } />
          <Route path="/salary-management" element={<SalaryManagement /> } />

          
          <Route path="/report" element={<ReportDashboard/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
