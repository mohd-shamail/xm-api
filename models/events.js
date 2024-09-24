const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  sentBy: { type: String, required: true },
  desc: { type: String, required: true },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    index: { expires: "14d" }, // Set the TTL index to automatically delete after 14 days
  },
});

module.exports = mongoose.model("Event", eventSchema);
// expires: 60 * 60 * 24 * 14,  // 14 days in seconds
