const Timetable = require("../../models/timeTable");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const User = require("../../models/user");
const Joi = require("joi");

const timeTableController = {
  async updateTimeTable(req, res, next) {
    // Validate the incoming request data
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
      // Step 1: Check if a timetable for the same course and day already exists
      const existingTimetable = await Timetable.findOne({
        course,
        day,
        $or: [
          {
            // Check if the new startTime falls within the existing time range
            startTime: { $lte: endTime, $gte: startTime },
          },
          {
            // Check if the new endTime falls within the existing time range
            endTime: { $lte: endTime, $gte: startTime },
          },
        ],
      });

      // Step 2: If the timetable exists, remove the old entry
      if (existingTimetable) {
        await Timetable.deleteOne({
          _id: existingTimetable._id,
        });
      }

      // Step 3: Create and save the new timetable entry
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
        message: "Timetable updated successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  // View timetable route
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
  // Delete timetable route
  async deleteTimeTable(req, res, next) {
    // Validate the incoming request to ensure _id is provided
    const deleteTimetableSchema = Joi.object({
      _id: Joi.string().required(), // _id is required
    });

    const { error } = deleteTimetableSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { _id } = req.body;

    try {
      // Step 1: Check if the timetable with the provided _id exists
      const timetable = await Timetable.findById(_id);
      if (!timetable) {
        return next(CustomErrorHandler.notFound("Timetable not found"));
      }

      // Step 2: Delete the timetable by its _id
      await Timetable.deleteOne({ _id });

      // Step 3: Send success response
      res.status(200).json({
        success: true,
        message: "Timetable deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = timeTableController;
