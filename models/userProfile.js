const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema(
  {
    userImage: { type: String, default: "" },
    dateOfBirth: { type: String, default: "01-01-20XX" }, // Use Date type instead of String
    fatherName: { type: String },
    course: { type: [String], default: [""] },
    address: { type: String },
    schoolName: { type: String, default: "" },
    admissionDate: { type: String, default: "01-01-2024" }, // Use Date type instead of String
    gender:{ type: String, default: "Male"},
  },
  { timestamps: true }
);

module.exports = userProfileSchema;
