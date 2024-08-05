const Attendance = require("../../models/attendance");
const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const Joi = require("joi");
const moment = require("moment");

const viewAttendanceController = {
  async viewAttendance(req, res, next) {
    const viewAttendanceSchema = Joi.object({
      month: Joi.number().min(1).max(12).required(),
    });

    const { error } = viewAttendanceSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    
    const { month } = req.body;
    const year = new Date().getFullYear();
    const today = moment();
    const currentMonth = today.month() + 1;

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }

      // Check if the requested month is within the range of valid months
      if (month > currentMonth) {
        return res.status(200).json({
          success: true,
          data: [],
          message: "No data available for future months",
        });
      }

      // Create the start and end dates for the requested month
      const startDate = moment({ year, month: month - 1 }).startOf("month");
      const endDate = month === currentMonth ? today.endOf("day") : moment({ year, month: month - 1 }).endOf("month");

      // Fetch attendance data for the user within the specified month
      const attendanceData = await Attendance.find({
        studentId: req.user._id,
        date: {
          $gte: startDate.format("DD-MM-YYYY"),
          $lte: endDate.format("DD-MM-YYYY"),
        },
      });

      // Prepare month-wise attendance history with only date and status fields
      const attendanceMap = new Map();
      attendanceData.forEach((att) => {
        attendanceMap.set(moment(att.date, "DD-MM-YYYY").format("DD-MM-YYYY"), att.status);
      });

      // Create the attendance history array
      const daysInMonth = endDate.date(); // Total days in the selected month
      const attendanceHistory = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = moment({ year, month: month - 1, day }).format("DD-MM-YYYY");
        if (moment(date, "DD-MM-YYYY").isBefore(today, 'day') || date === today.format("DD-MM-YYYY")) {
          attendanceHistory.push({
            date,
            status: attendanceMap.get(date) || "A",
          });
        }
      }

      // Send the formatted attendance history
      res.status(200).json({
        success: true,
        data: attendanceHistory,
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return next(error);
    }
  },
};

module.exports = viewAttendanceController;
