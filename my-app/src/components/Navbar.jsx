import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.webp";
import { FaBars } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { MdOutlineLogin } from "react-icons/md";
import { TbMoodCheck } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { GiTakeMyMoney, GiSkills, GiTeacher } from "react-icons/gi";
import { FaClipboardList } from "react-icons/fa";
import logoimage from "../assets/logoimage.jpg";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setUserRole(storedRole);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobile(!isMobile);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setUserRole(null);
    navigate("/login");
  };

  return (
    <nav className={`navbar ${isMobile ? "mobile-active" : ""}`}>
      <div className="nav-sec1">
        <img src={logoimage} alt="logo" />
      </div>

      <div className={`nav-sec2 ${isMobile ? "show-menu" : ""}`}>
        <ul className="nav-items">
          {/* <li className="item">
            <Link to="/profile">
              <CgProfile className="icon" />
              <span className="text">Profile</span>
            </Link>
          </li> */}

          <li className="item">
            <Link to="/">
              <FaHome className="icon" />
              <span className="text">Home</span>
            </Link>
          </li>

     
 
          {userRole === "employee" ? (
            <>
              <li className="item">
                <Link to="/salary-employee">
                  <GiTakeMyMoney className="icon" />
                  <span className="text">Salary</span>
                </Link>
              </li>
              <li className="item">
            <Link to="/attendance">
              <FaClipboardList className="icon" />
              <span className="text">Attendance</span>
            </Link>
          </li>
              <li className="item">
                <Link to="/leave">
                  <GiSkills className="icon" />
                  <span className="text">Leave</span>
                </Link>
              </li>
              <li className="item">
              <button onClick={handleLogout} className="login-btn">
                <MdOutlineLogin className="icon" />
                <span className="text">Logout</span>
              </button>
            </li>
             
            </>
          ) : userRole === "hr" ? (
            <>
              <li className="item">
                <Link to="/salary-management">
                  <GiTakeMyMoney className="icon" />
                  <span className="text">Salary Management</span>
                </Link>
              </li>
              <li className="item">
            <Link to="/attendance">
              <FaClipboardList className="icon" />
              <span className="text">Attendance</span>
            </Link>
          </li>
              <li className="item">
                <Link to="/leave-hr">
                  <GiSkills className="icon" />
                  <span className="text">Leave</span>
                </Link>
              </li>
              <li className="item">
                <Link to="/schedule-meeting">
                  <GiTeacher className="icon" />
                  <span className="text">Schedule Meeting</span>
                </Link>
              </li>
              <li className="item">
                <Link to="/get-meetings">
                  <GiTeacher className="icon" />
                  <span className="text">Meetings</span>
                </Link>
              </li>
              <li className="item">
              <button onClick={handleLogout} className="login-btn">
                <MdOutlineLogin className="icon" />
                <span className="text">Logout</span>
              </button>
            </li>
            </>
            
          ) 
          : (
            <li className="item">
            <Link to="/login">
            <button className="login-btn">
              <MdOutlineLogin className="icon" />
              <span className="text">Login</span>
            </button>
            </Link>
            </li>
          )
          }
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
