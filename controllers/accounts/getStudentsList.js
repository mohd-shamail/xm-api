const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const studentsListController = {
  async studentsList(req, res, next) {
    try {
      // Fetch user details
      const user = await User.findById(req.user._id).lean();
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      // Check if the user has the 'student' role
      if (user.user_role === "student") {
        return next(CustomErrorHandler.notFound("No Data Found"));
      }

      // Fetch students
      const students = await User.find(
        { user_role: "student" },
        "name _id mobile_number profile.admissionDate profile.course"
      ).lean();

      // Respond with the admin's name and the list of students
      res.json({ adminName: user.name, userRole: user.user_role, users: students });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = studentsListController;
