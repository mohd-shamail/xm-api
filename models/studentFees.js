const mongoose = require("mongoose");
const User = require("./user");
const Joi = require("joi");

const Schema = mongoose.Schema;

const studentFeesSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiptId: { type: String, required: true, unique: true },
    courseFee: { type: String, required: true },
    session: { type: String, default: "2024" },
    discount: { type: String, default: 0 }, // Default value for optional field
    paymentMode: { type: String, default: "cash" }, // Default value for optional field
    lateFee: { type: String, default: 0 }, // Default value for optional field
    submitDate: { type: String, required: true },
    fromDate: { type: String, required: true, validate: validateDate },
    toDate: { type: String, required: true, validate: validateDate },
    dueMonth: { type: [String], required: true },
    totalPayment: { type: String }, // Total payment can be calculated based on other fields
  },
  { timestamps: true }
);

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

module.exports = mongoose.model(
  "StudentFees",
  studentFeesSchema,
  "studentFees"
);
