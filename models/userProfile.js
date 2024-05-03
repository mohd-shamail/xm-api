const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const userProfileSchema = new Schema(
  {
    userImage:{ type: String },
    fatherName: { type: String},
    course: { type: String },
    address: { type: String,},
    schoolName: { type: String },
    admissionDate: { type: Date }, // Use Date type instead of String
  },
  { timestamps: true }
);

module.exports = userProfileSchema;
