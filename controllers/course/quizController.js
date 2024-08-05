const Quiz = require('../../models/Quiz');
const Course = require('../../models/Course');

exports.createQuiz = async (req, res) => {
    try {
        const { courseId, questions, duration } = req.body;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ msg: 'Course not found' });

        const newQuiz = new Quiz({ course: courseId, questions, duration });
        await newQuiz.save();
        res.json(newQuiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('course');
        if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });
        res.json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (question.correctOption === answers[index]) score++;
        });

        res.json({ score });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
