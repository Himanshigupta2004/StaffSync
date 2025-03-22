const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;



