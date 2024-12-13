import React from 'react';
import Navbar from "./Navbar";
import './Main.css';
import AttendanceChart from './AttendanceChart';
import TodoList from './TodoList';
const Main = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
      <div className="main-content">
        <div className="good-morning">
        </div>
        <div className='main-main'>
        <div className='meetings'>
          <h1>Meetings Scheduled-</h1>
        </div>
        <div className='presentchart'>
        <AttendanceChart month={11} year={2024} /> 
        </div>
        </div>
        </div>
        <div className='side-div'>
            <TodoList />
        </div>
        
      </div>
    </div>
  );
}

export default Main
