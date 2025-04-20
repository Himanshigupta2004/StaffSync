import React, { useState, useEffect } from "react";
import { markAttendance } from "../util/ApiRoutes";
import "./MarkAttendance.css"; 
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const MarkAttendance = ({ token }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [message, setMessage] = useState("");
  const [timeInside, setTimeInside] = useState(0); 
  const [isInsideRadius, setIsInsideRadius] = useState(false); 
  const [intervalId, setIntervalId] = useState(null); 

  const handleMarkAttendance = async () => {
    try {
      if (!latitude || !longitude) {
        setMessage("Location data is required!");
        return;
      }

      console.log("Sending location to server:", { latitude, longitude });
      const response = await markAttendance(latitude, longitude, token);
      console.log("Server response:", response);

      if (response.message.includes("inside the radius")) {
        setMessage(response.message);

        if (!isInsideRadius) {
          console.log("User entered radius. Starting timer.");
          setIsInsideRadius(true);
          startTimer();
        }
      } else if (response.message.includes("outside the radius")) {
        setMessage(response.message);

        if (isInsideRadius) {
          console.log("User exited radius. Pausing timer.");
          setIsInsideRadius(false);
          stopTimer();
        }
      } else {
        setMessage(response.message);
        setIsInsideRadius(false);
        stopTimer();
      }
    } catch (error) {
      console.error("Error in handleMarkAttendance:", error);
      setMessage(error.response?.data?.message || "An error occurred!");
    }
  };

  const fetchLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setMessage("Location fetched. Now you can mark attendance.");
          console.log("Fetched location:", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setMessage("Unable to fetch location. Please enable location services.");
        }
      );
    } else {
      setMessage("Geolocation is not supported by your browser.");
    }
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimeInside((prevTime) => prevTime + 1); 
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    console.log("Stopping timer.");
    clearInterval(intervalId); 
    setIntervalId(null);
  };

  useEffect(() => {
    return () => stopTimer(); 
  }, []);

  return (
    <div className="attendance-container">
      <div className="buttons-container">
        <button className="action-button" onClick={fetchLocation}>
          Fetch Location
        </button>
        <button className="action-button" onClick={handleMarkAttendance}>
          Mark Attendance
        </button>
      </div>
      <p className="message">{message}</p>
      {isInsideRadius && (
        <div className="timer-container">
          <p>
            Timer: You have been inside the radius for{" "}
            {Math.floor(timeInside / 60)} minutes and {timeInside % 60} seconds.
          </p>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
