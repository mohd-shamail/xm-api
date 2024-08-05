const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  date: { type: String, required: true },
  desc1: { type: String, required: true },
  desc2: { type: String, required: true },
  isNewPost: { type: String, default: false },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model("Event", EventSchema, "events");
