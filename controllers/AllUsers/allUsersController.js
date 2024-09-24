const User = require("../../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const getAllUserController = {
  async viewAllUser(req, res, next) {
    // Ensure the user is not a student
    if (req.user.user_role === "student") {
      return next(
        CustomErrorHandler.notFound(
          "Access denied! Only Admin can view all users."
        )
      );
    }

    // Define the schema for pagination parameters
    const allUserschema = Joi.object({
      page: Joi.number().integer().min(1).default(1), // default to page 1
      limit: Joi.number().integer().min(1).max(100).default(20), // default to 10 users per page
    });

    // Validate query parameters
    const { error, value } = allUserschema.validate(req.query); // Use req.query for query params
    if (error) {
      return next(error); // Pass validation error to error handler
    }

    const { page, limit } = value;

    try {
      // Fetch users with pagination
      const users = await User.find()
        .skip((page - 1) * limit) // Skip users for previous pages
        .limit(limit); // Limit the number of users returned

      // Count total users in the collection
      const totalUsers = await User.countDocuments();

      // Return paginated user data along with metadata
      res.json({
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit), // Calculate total pages
        currentPage: page,
        users, // Send the users for the current page
      });
    } catch (err) {
      return next(CustomErrorHandler.notFound(err.message));
    }
  },
};

module.exports = getAllUserController;
