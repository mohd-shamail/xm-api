const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const Joi = require("joi");

const deleteUserController = {
  async deleteUserProfile(req, res, next) {
    // Validate request body for 'id' field
    const deleteUserSchema = Joi.object({
      id: Joi.string().required(),
    });
    const { error } = deleteUserSchema.validate(req.body);
    if (error) {
      return next(error); // Pass validation error to the error handler middleware
    }

    const { id } = req.body;

    try {
      // Find the user making the request (i.e., the requester)
      const requestingUser = await User.findOne({ _id: req.user._id });

      if (!requestingUser) {
        return next(CustomErrorHandler.unAuthorized("Unauthorized access!"));
      }

      // Check if the requesting user has the 'admin' role
      if (requestingUser.user_role !== "admin") {
        return next(
          CustomErrorHandler.unAuthorized("Only admins can delete users.")
        );
      }

      // Find the user to be deleted by the ID provided in the request body
      const userToDelete = await User.findOne({ _id: id });

      if (!userToDelete) {
        return next(CustomErrorHandler.notFound("User not found"));
      }

      // Delete the user
      await User.deleteOne({ _id: id });

      // Respond with a success message
      res
        .status(200)
        .json({ success: true, message: "User deleted successfully!" });
    } catch (err) {
      // Handle any potential errors
      return next(err);
    }
  },
};

module.exports = deleteUserController;
