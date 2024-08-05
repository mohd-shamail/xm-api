const Attendance = require("../../models/attendance");
const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const Joi = require("joi");

const attendanceController = {
  async markAttendance(req, res, next) {
    // Validation schema
    const markAttendanceSchema = Joi.object({
      date: Joi.string().required(),
      status: Joi.string().valid("P", "A").required(),
      lat: Joi.string().required(),
      lon: Joi.string().required(),
    });
    const { error } = markAttendanceSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const { date, status, lat, lon } = req.body;
      console.log(`Received data - Date: ${date}, Status: ${status}`);
      const student = await User.findById(req.user._id);
      if (!student || !student.user_role == "admin") {
        return next(CustomErrorHandler.notFound("Student not found"));
      };

      const studentId = req.user._id;

      // Check for duplicate attendance record for the same date and student
      const existingAttendance = await Attendance.findOne({
        studentId,
        date: date,
      });
      if (existingAttendance) {
        return next(
          CustomErrorHandler.alreadyexists(
            "Attendance for this date already exists"
          )
        );
      }

      const attendance = new Attendance({
        studentId,
        date,
        status,
        latitude: lat,
        longitude: lon,
      });

      await attendance.save();
      res
        .status(201)
        .json({ success: true, message: "Attendance marked successfully" });
    } catch (err) {
      return next(err);
    }
  },

  // next route for getting detail of students attendance List
  async getAttendanceByStudent(req, res, next) {
    const getAttendanceByStudentSchema = Joi.object({
      studentId: Joi.string().required(),
    });
    const { error } = getAttendanceByStudentSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
      const { studentId } = req.body;

      const attendanceRecords = await Attendance.find({ studentId }).populate(
        "studentId",
        "name"
      );
      res.json(attendanceRecords);
    } catch (err) {
      return next(err);
    }
  },

  async getAllAttendance(req, res, next) {
    try {
      const attendanceRecords = await Attendance.find().populate(
        "studentId",
        "name"
      );
      res.json(attendanceRecords);
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = attendanceController;
