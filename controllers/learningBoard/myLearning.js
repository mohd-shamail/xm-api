const User = require("../../models/user");
const StudentFees = require("../../models/studentFees");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const mylearningController = {
  async myLearning(req, res, next) {
    try {
      // Retrieve user details
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(CustomErrorHandler.notFound("Student not found"));
      }

      // Retrieve fees information
      const feesRecords = await StudentFees.find({ user: req.user._id })
        .select("totalPayment dueMonth submitDate")
        .lean();
      if (!feesRecords) {
        return next(CustomErrorHandler.notFound("No fees Record Found!"));
      }
      // Get the current date
      const currentDate = new Date();
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentMonthIndex = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Create a Set of all dueMonths from the fees records
      const paidMonths = new Set(
        feesRecords.flatMap((record) => record.dueMonth)
      );

      // Determine the due months
      const dueMonths = [];
      for (let i = 0; i <= currentMonthIndex; i++) {
        const monthStr = monthNames[i] + currentYear;
        if (!paidMonths.has(monthStr)) {
          dueMonths.push(monthStr);
        }
      }

      // Send user details and due month information in the response
      res.status(200).json({
        success: true,
        data: {
          name: user.name,
          email: user.email,
          number: user.mobile_number,
          admissiondate: user.profile.admissionDate,
          dob: user.profile.dateOfBirth,
          userImg: user.profile.userImage,
          course: user.profile.course,
          dueMonths,
          // Include other user details you want to send
        },
        
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = mylearningController;
