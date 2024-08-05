const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    questions: [{
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOption: { type: String, required: true }
    }],
    duration: { type: Number, required: true } // duration in minutes
});

module.exports = mongoose.model('Quiz', QuizSchema);
