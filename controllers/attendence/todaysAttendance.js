const Attendance = require("../../models/attendance");
const moment = require("moment");
const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const todaysAttendanceController = {
  // Define async function for getting today's attendance
  async getTodaysAttendance(req, res, next) {
    try {
      // Get the current user (optional if needed for additional authorization)
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }

      // Get today's date in the same format as your stored date
      const today = moment().format("DD-MM-YYYY");

      // Find all attendance records for today's date and populate student data from User model
      const attendanceRecords = await Attendance.find({ date: today }).populate(
        {
          path: "studentId", // Reference to the User model
          select: "name profile", // Only return 'name' and 'class' fields from the User model
        }
      );
      const totalStudents = await User.countDocuments({ user_role: "student" });
      // Prepare the response data
      const attendanceData = attendanceRecords.map((record) => ({
        name: record.studentId?.name || "Unknown", // Handle case if the user data is missing
        class: record.studentId?.profile?.course[0] || "Unknown", // Handle case if the class data is missing
        status: record.status, // Attendance status ('P', 'A', etc.)
      }));

      // Send the response
      res.json({
        success: true,
        totalStudents,
        data: attendanceData,
      });
    } catch (err) {
      return next(err); // Handle errors
    }
  },
};

module.exports = todaysAttendanceController;
