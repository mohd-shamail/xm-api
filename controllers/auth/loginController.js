const Joi = require("joi");
const bcrypt = require("bcrypt");
const JwtService = require("../../services/JwtService");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const User = require("../../models/user");
//const RefreshToken = require('../../models/refreshToken');
//const { REFRESH_SECRET } = require('../../config/index')


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
    });
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    try {
        var user;
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
      //compare the password
      const matchPwd = await bcrypt.compare(req.body.password, user.password);
      if (!matchPwd) {
        return next(CustomErrorHandler.invalidCredentials("invalid Password!"));
      }
      // Generate new access token
      var access_token = JwtService.sign({ _id: user._id, role: user.role });
      // Generate new refresh token
     // var refresh_token = JwtService.sign({ _id: user._id, role: user.role },'1y',REFRESH_SECRET);
    } catch (err) {
      return next(err);
    }
    res
      .status(200)
      .json({ 
        success: true, msg: "login Successfuly!", 
        email:user.email,  
        access_token: access_token, 
        //refresh_token:refresh_token,
      });
  },
};
module.exports = loginController;
