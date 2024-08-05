const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const holidaySchema = new Schema({
  holidayName: { type: String, required: true },
  date: { type: String, required: true, validate: validateDate },
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

module.exports = mongoose.model('Holiday', holidaySchema, "holidays");