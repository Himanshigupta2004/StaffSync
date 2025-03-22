import React, { useState, useEffect } from 'react';
import AttendanceChart from './AttendanceChart';

const ParentComponent = () => {
  const [userId, setUserId] = useState('123'); 
  const [month, setMonth] = useState(11);  
  const [year, setYear] = useState(2024);
  const [token, setToken] = useState(null); 

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt-token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error('Token is missing or not found in localStorage');
    }
  }, []);

  if (!token) {
    return <p>Loading authentication data...</p>;
  }

  return (
    <div>
      <h1>Attendance Chart</h1>
      <AttendanceChart
        userId={userId}
        month={month}
        year={year}
        token={token}
      />
    </div>
  );
};

export default ParentComponent;
