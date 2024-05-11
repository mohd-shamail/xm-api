const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema(
  {
    userImage: { type: String, default: "" },
    fatherName: { type: String },
    course: { type: [String], default: [""] },
    address: { type: String },
    schoolName: { type: String },
    admissionDate: { type: String, default: "01-01-2024" }, // Use Date type instead of String
  },
  { timestamps: true }
);

module.exports = userProfileSchema;
