const mongoose = require("mongoose");

const HomeWorkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  course: { type: String, required: true },
  description: { type: String, default: "" },
  homeWorkUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, index: { expireAfterSeconds: 0 } } // TTL index
});

module.exports = mongoose.model("HomeWork", HomeWorkSchema, "homeWork");
