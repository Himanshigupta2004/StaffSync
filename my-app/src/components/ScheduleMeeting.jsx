import React, { useState } from "react";
import axios from "axios";
import './ScheduleMeeting.css';
const ScheduleMeeting = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [attendees, setAttendees] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("jwt-token"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !description || !date || !organizer || !attendees) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    const meetingData = {
      title,
      description,
      date,
      organizer, 
      attendees: attendees.split(",").map((name) => name.trim()), 
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/meeting/schedule-meeting", 
        meetingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Meeting scheduled successfully!");
      setError("");
      setTitle("");
      setDescription("");
      setDate("");
      setOrganizer("");
      setAttendees("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to schedule meeting. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-meeting-container">
  <h2>Schedule a Meeting</h2>
  {error && <p className="error-message">{error}</p>}
  {success && <p className="success-message">{success}</p>}

  <form onSubmit={handleSubmit} className="schedule-meeting-form">
    <div className="form-group">
      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label>Date:</label>
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label>Organizer (ID or Name):</label>
      <input
        type="text"
        value={organizer}
        onChange={(e) => setOrganizer(e.target.value)}
        required
      />
    </div>

    <div className="form-group">
      <label>Attendees (comma-separated names):</label>
      <input
        type="text"
        value={attendees}
        onChange={(e) => setAttendees(e.target.value)}
        required
      />
    </div>

    <button type="submit" disabled={loading}>
      {loading ? "Scheduling..." : "Schedule Meeting"}
    </button>
  </form>
</div>

  );
};

export default ScheduleMeeting;
