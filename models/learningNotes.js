const mongoose = require("mongoose");

const LearningNotesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  course: { type: String, required: true },
  sub: { type: String, required: true },
  desc: { type: String, default: "" },
  notesUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
});

module.exports = mongoose.model(
  "learningNotes",
  LearningNotesSchema,
  "learningNotes"
);
