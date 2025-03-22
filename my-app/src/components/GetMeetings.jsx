import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("jwt-token"); 

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/meeting/get-meetings", {
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
  

  if (loading) {
    return <p>Loading meetings...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>My Meetings</h2>
      {meetings.length === 0 ? (
        <p>No meetings found</p>
      ) : (
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Organizer</th>
              <th>Attendees</th>
            </tr>
          </thead>
          <tbody>
            {meetings.map((meeting) => (
              <tr key={meeting._id}>
                <td>{meeting.title}</td>
                <td>{meeting.description}</td>
                <td>{new Date(meeting.date).toLocaleString()}</td>
                <td>{meeting.organizer?.username || "Unknown"}</td>
                <td>
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
