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
        .select("dueMonth")
        .lean();
      if (!feesRecords) {
        return next(CustomErrorHandler.notFound("No fees Record Found!"));
      }

      // Get the current date
      const currentDate = new Date();

      // Parse the admission date from the format "DD-MM-YYYY"
      const [admissionDay, admissionMonth, admissionYear] = user.profile.admissionDate.split("-");
      const admissionDate = new Date(`${admissionYear}-${admissionMonth}-${admissionDay}`);

      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      // Create a Set of all paid dueMonths from the fees records
      const paidMonths = new Set(feesRecords.flatMap((record) => record.dueMonth));

      // Determine the due months based on admission date
      const dueMonths = [];
      let year = admissionDate.getFullYear();
      let monthIndex = admissionDate.getMonth(); // 0-based index for month

      // Loop through months from admission date to current date
      while (
        year < currentDate.getFullYear() || 
        (year === currentDate.getFullYear() && monthIndex <= currentDate.getMonth())
      ) {
        const monthStr = monthNames[monthIndex] + year;
        
        // Check if the month is not found in paid months
        if (!paidMonths.has(monthStr)) {
          dueMonths.push(monthStr);  // Add to dueMonths if not paid
        }

        // Move to the next month
        monthIndex++;
        if (monthIndex > 11) {
          monthIndex = 0;
          year++;
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
