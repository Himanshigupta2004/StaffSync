import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import "./Navbar.css";
import logo1 from "../assets/black_logo.png";
import { FaBars } from "react-icons/fa"; 
import { FaHome, FaQuestionCircle } from "react-icons/fa";
import { MdQuestionAnswer, MdOutlineLogin, MdExpandMore } from "react-icons/md";
import { TbMoodCheck } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const [showDiv, setShowDiv] = useState(false); 
  const [isMobile, setIsMobile] = useState(false); 
  const [userRole, setUserRole] = useState(null); 

  useEffect(() => {
    
    const storedRole = localStorage.getItem("userRole");
    setUserRole(storedRole);
  }, []);

  return (
    <nav className={`navbar ${isMobile ? "mobile-active" : ""}`}>
      <div className="nav-sec1">
        <img src={logo1} className="nav-img" alt="logo" />
      </div>

     
      <div className="hamburger" onClick={() => setIsMobile(!isMobile)}>
        <FaBars />
      </div>

      <div className={`nav-sec2 ${isMobile ? "show-menu" : ""}`}>
        <ul className="nav-items">
          <li className="item">
            <CgProfile className="icon" />
            <Link to="/profile">Profile</Link>
          </li>

        
          <li className="item">
            <FaHome className="icon" />
            <Link to="/">Home</Link>
          </li>

          {/* Both HR and employee can see these links */}
          
          <li className="item">
            <MdQuestionAnswer className="icon" />
            <Link to="/attendance">Attendance</Link>
          </li>

          {/* Conditional routes based on user role */}
          {userRole === "employee" ? (
            <>
              <li className="item">
                <TbMoodCheck className="icon" />
                <Link to="/salary-employee">Salary</Link>
              </li>
              <li className="item">
                <TbMoodCheck className="icon" />
                <Link to="/leave">leave</Link>
              </li>
              <li className="item">
                <MdOutlineLogin className="icon" />
                <Link to="/get-meetings">Tasks</Link>
              </li>
            </>
          ) : userRole === "hr" ? (
            <>
            
              <li className="item">
                <TbMoodCheck className="icon" />
                <Link to="/salary-management">Salary Management</Link>
              </li>
              <li className="item">
                <TbMoodCheck className="icon" />
                <Link to="/leave-hr">Leave</Link>
              </li>
              <li className="item">
                <MdOutlineLogin className="icon" />
                <Link to="/schedule-meeting">Schedule Meeting</Link>
              </li>
            </>
          ) : (
            <li className="item">
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
        <div><Link to="/report">ReportDashboard</Link>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
