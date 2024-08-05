const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
  },
  subTeacher: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Timetable", timetableSchema);
