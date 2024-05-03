const mongoose = require("mongoose");
const User = require("./user");
const Joi = require("joi");

const Schema = mongoose.Schema;

const studentFeesSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiptId: { type: String, required: true, unique: true },
    courseFee: { type: String, required: true },
    discount: { type: String, default: 0 }, // Default value for optional field
    paymentMode: { type: String, default: "cash" }, // Default value for optional field
    lateFee: { type: String, default: 0 }, // Default value for optional field
    submitDate: { type: Date, required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    dueMonth: { type: [String], required: true, validate: validateDueMonth },
    totalPayment: { type: String }, // Total payment can be calculated based on other fields
  },
  { timestamps: true }
);
// Joi validation function for dueMonth field
function validateDueMonth(dueMonth) {
  const validMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return Joi.array()
    .items(Joi.string().valid(...validMonths))
    .required()
    .validate(dueMonth);
}

module.exports = mongoose.model(
  "StudentFees",
  studentFeesSchema,
  "studentFees"
);
