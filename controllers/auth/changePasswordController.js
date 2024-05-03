const Joi = require("joi");
const bcrypt = require("bcrypt");
const JwtService = require("../../services/JwtService");
const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const changePasswordController = {
  async changePassword(req, res, next) {
    const changePasswordSchema = Joi.object({
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()-_+=<>?/{}|~]{3,30}$")),
      newPassword: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()-_+=<>?/{}|~]{3,30}$")),
      email: Joi.string().email().required(),
    });

    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { password, newPassword, email } = req.body;

    try {
      // Fetch user from the database
      const user = await User.findOne({ email });
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }

      // Compare old password
      const matchPwd = await bcrypt.compare(password, user.password);
      if (!matchPwd) {
        return next(
          CustomErrorHandler.invalidCredentials("Invalid old password")
        );
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password in the database
      user.password = hashedPassword;
      await user.save();

      // Optionally, you can generate a new JWT token with the updated user details
      const token = JwtService.sign({ _id: user._id, role: user.role });

      res.status(200).json({
        success: true,
        msg: "Password changed successfully",
        token: token,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = changePasswordController;
