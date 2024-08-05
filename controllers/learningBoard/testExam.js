const ExamTest = require("../../models/classTest");
const Joi = require("joi");
const moment = require("moment");

const testExamController = {
  async updateTestExam(req, res, next) {
    const updateHomeWorkSchema = Joi.object({
      title: Joi.string(),
      //date: Joi.string(),
      course: Joi.string(),
      description: Joi.string(),
      testExamUrl: Joi.string().uri(),
    });
    const { error } = updateHomeWorkSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { title, course, description, testExamUrl } = req.body;
    const date = moment().format("DD-MM-YYYY");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 30);
    const testExam = new ExamTest({
      title,
      date,
      course,
      description,
      testExamUrl,
      expiresAt,
    });
    try {
      await testExam.save();
      res.status(200).json({
        success: true,
        msg: "successFully updated Question Paper!",
      });
    } catch (err) {
      return next(err);
    }
  },

  //view Question paper
  async ViewTestpaper(req, res, next) {
    const ViewTestpaperSchema = Joi.object({
      course: Joi.string().required(),
    });

    const { error } = ViewTestpaperSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { course } = req.body;
    try {
      const testPaper = await ExamTest.find({ course }).select(
        "-_id -expiresAt -createdAt -__v"
      );

      if (!testPaper || testPaper.length === 0) {
        return res.status(404).json({
          success: false,
          msg: "No Test/Exam found for the specified course",
        });
      }

      res.status(200).json({
        success: true,
        data: testPaper,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = testExamController;
