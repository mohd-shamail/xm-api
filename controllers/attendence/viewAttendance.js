const Attendance = require("../../models/attendance");
const User = require("../../models/user");
const Holiday = require("../../models/holidaysList");
const Leave = require("../../models/leaves");
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

      // Check if the requested month is valid
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

      // Fetch holidays in the requested month
      const holidays = await Holiday.find({
        date: {
          $gte: startDate.format("DD-MM-YYYY"),
          $lte: endDate.format("DD-MM-YYYY"),
        },
      });

      // Fetch leaves in the requested month
      const leaves = await Leave.find({
        studentId: req.user._id,
        $or: [
          {
            startDate: {
              $gte: startDate.format("DD-MM-YYYY"),
              $lte: endDate.format("DD-MM-YYYY"),
            },
          },
          {
            endDate: {
              $gte: startDate.format("DD-MM-YYYY"),
              $lte: endDate.format("DD-MM-YYYY"),
            },
          },
        ],
      });

      // Map holidays and leaves by date
      const holidayMap = new Map();
      holidays.forEach((holiday) => {
        holidayMap.set(holiday.date, holiday.holidayName);
      });

      const leaveMap = new Map();
      leaves.forEach((leave) => {
        const leaveDates = [];
        let leaveStart = moment(leave.startDate, "DD-MM-YYYY");
        const leaveEnd = moment(leave.endDate, "DD-MM-YYYY");

        while (leaveStart.isSameOrBefore(leaveEnd)) {
          leaveDates.push(leaveStart.format("DD-MM-YYYY"));
          leaveStart = leaveStart.add(1, "days");
        }

        leaveDates.forEach((date) => {
          leaveMap.set(date, leave.reason);
        });
      });

      // Prepare month-wise attendance history with date, status, and leave/holiday name
      const attendanceMap = new Map();
      attendanceData.forEach((att) => {
        attendanceMap.set(moment(att.date, "DD-MM-YYYY").format("DD-MM-YYYY"), att.status);
      });

      // Create the attendance history array
      const daysInMonth = endDate.date(); // Total days in the selected month
      const attendanceHistory = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = moment({ year, month: month - 1, day }).format("DD-MM-YYYY");
        let status = "A";

        // Check if it's a Sunday
        if (moment(date, "DD-MM-YYYY").day() === 0) {
          status = "Sunday";
        }

        // Check if it's a holiday
        if (holidayMap.has(date)) {
          status = `Holiday (${holidayMap.get(date)})`;
        }

        // Check if it's a leave
        if (leaveMap.has(date)) {
          status = `Leave (${leaveMap.get(date)})`;
        }

        // Check attendance status for the day
        if (attendanceMap.has(date)) {
          status = attendanceMap.get(date) === "P" ? "P" : "A";
        }

        // Add the status for the day
        if (moment(date, "DD-MM-YYYY").isBefore(today, "day") || date === today.format("DD-MM-YYYY")) {
          attendanceHistory.push({
            date,
            status,
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
