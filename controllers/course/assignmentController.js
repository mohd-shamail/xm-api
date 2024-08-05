const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

exports.uploadAssignment = upload.single('file');

exports.createAssignment = async (req, res) => {
    try {
        const { courseId, title, description, dueDate } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        const newAssignment = new Assignment({ course: courseId, title, description, dueDate });
        await newAssignment.save();
        res.json(newAssignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.body;
        const file = req.file.path;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

        assignment.submissions.push({ student: req.user.id, file });
        await assignment.save();

        res.json(assignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.gradeAssignment = async (req, res) => {
    try {
        const { assignmentId, studentId, grade } = req.body;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

        const submission = assignment.submissions.find(sub => sub.student.toString() === studentId);
        if (!submission) return res.status(404).json({ msg: 'Submission not found' });

        submission.grade = grade;
        await assignment.save();

        res.json(assignment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
