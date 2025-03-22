import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoimage from "../assets/logoimage.jpg";
import { FaBars } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdOutlineLogin } from "react-icons/md";
import { GiTakeMyMoney, GiSkills, GiTeacher } from "react-icons/gi";
import { FaClipboardList } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false); // Controls sidebar visibility
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setUserRole(storedRole);
  }, []);

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setUserRole(null);
    setIsVisible(false); // Hide sidebar on logout
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger Icon always visible */}
      <div className="navbar-toggle" onClick={toggleSidebar}>
        <FaBars className="hamburger-icon" />
      </div>

      {/* Sidebar (hidden by default) */}
      <nav className={`navbar ${isVisible ? "visible" : ""}`}>
        <div className="nav-sec1">
          <img src={logoimage} alt="logo" />
        </div>

        <div className="nav-sec2">
          <ul className="nav-items">
            <li className="item">
              <Link to="/" onClick={() => setIsVisible(false)} title="Home">
                <FaHome className="icon" />
              </Link>
            </li>

            {userRole === "employee" ? (
              <>
                <li className="item">
                  <Link to="/salary-employee" onClick={() => setIsVisible(false)} title="Salary">
                    <GiTakeMyMoney className="icon" />
                  </Link>
                </li>
                <li className="item">
                  <Link to="/attendance" onClick={() => setIsVisible(false)} title="Attendance">
                    <FaClipboardList className="icon" />
                  </Link>
                </li>
                <li className="item">
                  <Link to="/leave" onClick={() => setIsVisible(false)} title="Leave">
                    <GiSkills className="icon" />
                  </Link>
                </li>
                <li className="item">
                  <button onClick={handleLogout} className="login-btn" title="Logout">
                    <MdOutlineLogin className="icon" />
                  </button>
                </li>
              </>
            ) : userRole === "hr" ? (
              <>
                <li className="item">
                  <Link to="/salary-management" onClick={() => setIsVisible(false)} title="Salary Management">
                    <GiTakeMyMoney className="icon" />
                  </Link>
                </li>
                <li className="item">
                  <Link to="/attendance" onClick={() => setIsVisible(false)} title="Attendance">
                    <FaClipboardList className="icon" />
                  </Link>
                </li>
                <li className="item">
                  <Link to="/leave-hr" onClick={() => setIsVisible(false)} title="Leave">
                    <GiSkills className="icon" />
                  </Link>
                </li>
                <li className="item">
                  <Link to="/schedule-meeting" onClick={() => setIsVisible(false)} title="Schedule Meeting">
                    <GiTeacher className="icon" />
                  </Link>
                </li>
                <li className="item">
                  <Link to="/get-meetings" onClick={() => setIsVisible(false)} title="Meetings">
                    <GiTeacher className="icon" />
                  </Link>
                </li>
                <li className="item">
                  <button onClick={handleLogout} className="login-btn" title="Logout">
                    <MdOutlineLogin className="icon" />
                  </button>
                </li>
              </>
            ) : (
              <li className="item">
                <Link to="/login" onClick={() => setIsVisible(false)} title="Login">
                  <button className="login-btn">
                    <MdOutlineLogin className="icon" />
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;