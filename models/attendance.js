const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true, validate: validateDate },
  status: { type: String, enum: ["P", "A"], required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
});

// Custom validation function for date fields
function validateDate(value) {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(value)) {
    throw new Error(
      "Invalid date format. Date must be in the format dd-mm-yyyy."
    );
  }
  // If the format is valid, return true
  return true;
}

module.exports = mongoose.model("Attendance", attendanceSchema, "attendance");
