const Timetable = require("../../models/timeTable");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const User = require("../../models/user");
const Joi = require("joi");

const timeTableController = {
  async updateTimeTable(req, res, next) {
    const timetableSchema = Joi.object({
      course: Joi.string().required(),
      subTeacher: Joi.string().required(),
      subject: Joi.string().required(),
      day: Joi.string()
        .valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat")
        .required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
    });

    const { error } = timetableSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { course, subTeacher, subject, day, startTime, endTime } = req.body;
    try {
      const newTimetable = new Timetable({
        course,
        subTeacher,
        subject,
        day,
        startTime,
        endTime,
      });

      await newTimetable.save();
      res.status(201).json({
        success: true,
        message: "Time Table Update SuccessFully",
        //data: newTimetable,
      });
    } catch (error) {
      return next(error);
    }
  },

  //view time table route
  async viewTimeTable(req, res, next) {
    const viewtimetableSchema = Joi.object({
      course: Joi.string().required(),
    });
    const { error } = viewtimetableSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { course } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }
      const timetableData = await Timetable.find({
        course: course,
      })
        .sort({ day: 1, startTime: 1 })
        .select("-__v");
      // Send the timetableData as JSON response
      res.json({
        success: true,
        data: timetableData,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
};

module.exports = timeTableController;
