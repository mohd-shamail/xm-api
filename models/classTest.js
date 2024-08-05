const mongoose = require("mongoose");

const StudentExamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  course: { type: String, required: true },
  description: { type: String, default: "" },
  testExamUrl: {
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

module.exports = mongoose.model("ExamTest", StudentExamSchema, "examTest");
