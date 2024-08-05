const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    submissions: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        file: { type: String, required: true },
        grade: { type: String }
    }]
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
