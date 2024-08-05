const Joi = require("joi");
const bcrypt = require("bcrypt");
const JwtService = require("../../services/JwtService");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const User = require("../../models/user");

const loginController = {
  async login(req, res, next) {
    const loginSchema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "in"] },
      }),
      mobile_number: Joi.string().min(10).max(10),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()-_+=<>?/{}|~]{3,30}$")),
    }).xor('email', 'mobile_number');  // Ensures at least one of email or mobile_number is present

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      let user;

      // Check if the user exists with email
      if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
      } else if (req.body.mobile_number) {
        // Check if the user exists with mobile_number
        user = await User.findOne({ mobile_number: req.body.mobile_number });
      }

      if (!user) {
        return next(CustomErrorHandler.invalidCredentials());
      }

      // Compare the password
      const matchPwd = await bcrypt.compare(req.body.password, user.password);
      if (!matchPwd) {
        return next(CustomErrorHandler.invalidCredentials("Invalid password!"));
      }

      // Generate new access token
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      console.log("access_token =" ,access_token);
      // Optionally generate a refresh token
      // const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

      res.status(200).json({
        success: true,
        userName:user.name,
        msg: "Login successful!",
        email: user.email,
        access_token: access_token,
        user_roles: user.user_role,
        course:user.profile.course,
        // refresh_token: refresh_token,
      });

    } catch (err) {
      return next(err);
    }
  },
};

module.exports = loginController;
