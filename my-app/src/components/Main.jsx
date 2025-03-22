import React from 'react';
import './Main.css';
import ViewMeetings from './GetMeetings';
import AttendanceChart from './AttendanceChart';
import TodoList from './TodoList';

const Main = () => {
  const username = localStorage.getItem("username");
  const currentDate = new Date();
  return (
    <div className='main-mainpage-flex'>
      <div className="container-mainpage">
        <div className="main-content">
          <h1 className="dashboard-title">Welcome, {username || 'User'}!</h1>
          <div className='main-main'>
            <div className='presentchart'>
              <AttendanceChart month={currentDate.getMonth() + 1} year={currentDate.getFullYear()} />
            </div>
            <div className='meetings'>
              <ViewMeetings />
            </div>
          </div>
          <div className='main-main-2'>
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;