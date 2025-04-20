import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Viewmeetings.css";
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const ViewMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/meeting/get-meetings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setMeetings(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch meetings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [token]);

  return (
    <div className="meetings-container">
      <h2>My Meetings</h2>
      {loading ? (
        <p>Loading meetings...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : meetings.length === 0 ? (
        <p>No meetings found</p>
      ) : (
        <table className="meetings-table">
          <thead>
            <tr>
              <th data-label="Title">Title</th>
              <th data-label="Description">Description</th>
              <th data-label="Date">Date</th>
              <th data-label="Organizer">Organizer</th>
              <th data-label="Attendees">Attendees</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting._id}>
                <td data-label="Title">{meeting.title}</td>
                <td data-label="Description">{meeting.description}</td>
                <td data-label="Date">{new Date(meeting.date).toLocaleString()}</td>
                <td data-label="Organizer">{meeting.organizer?.username || "Unknown"}</td>
                <td data-label="Attendees">
                  {meeting.attendees.map((attendee) => (
                    <span key={attendee._id}>{attendee.username}, </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewMeetings;