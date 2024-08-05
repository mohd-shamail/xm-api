const mongoose = require("mongoose");
const userProfileSchema = require("./userProfile");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile_number: { type: String, required: true },
    password: { type: String, required: true },
    user_role:  { type: String, default:"student"},
    profile: { type: userProfileSchema,default: {} }, // Embed userProfileSchema here
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
