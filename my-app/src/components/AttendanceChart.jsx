import axios from "axios";
import { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Chart.css';
ChartJS.register(ArcElement, Tooltip, Legend);
const fetchAttendanceData = async (month, year) => {
  const token = localStorage.getItem("jwt-token");
  
  if (!token) {
    console.error("No token found in localStorage");
    return;
  }
  const url = `http://localhost:5000/api/att/monthly-record/${year}/${month}`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return { presentCount: 0, absentCount: 0 };
  }
};

const AttendanceChart = ({ month, year }) => {
  const [attendanceData, setAttendanceData] = useState(null);

  useEffect(() => {
    const getAttendanceData = async () => {
      const data = await fetchAttendanceData(month, year);
      setAttendanceData(data);
    };

    getAttendanceData();
  }, [month, year]); 

  if (!attendanceData) return <div>Loading...</div>;
  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [attendanceData.presentCount, attendanceData.absentCount],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#2C82B7', '#FF4C6E'],
      },
    ],
  };

  return (
    <div >
      <h2>Attendance Overview for {month}/{year}</h2>
      <div className="chart-container">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default AttendanceChart;
