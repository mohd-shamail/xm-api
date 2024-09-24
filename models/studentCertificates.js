const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  certificateType: { type: String, required: true }, // Example: ExcellenceCertificate
  subject: { type: String, required: true }, // Example: Mathematics, Science
  rank: { type: String }, // Example: First, Second
  examDate: { type: String, required: true },
  issueDate: { type: String, required: true }, // Default to the current date
  certificateId: { type: String, unique: true, required: true }, // Unique certificate identifier
});

module.exports = mongoose.model("StudentCertificate", certificateSchema);
