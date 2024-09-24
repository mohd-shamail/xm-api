const Joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const User = require("../../models/user");
//const RefreshToken = require('../../models/refreshToken');
const bcrypt = require("bcrypt");
const JwtService = require("../../services/JwtService");
//const { REFRESH_SECRET } = require('../../config/index')

const registerController = {
  async register(req, res, next) {
    const registerSchema = Joi.object({
      name: Joi.string()
        .regex(/^[a-zA-Z\s.]+$/)
        .min(3)
        .max(30)
        .required(),
      email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in"] } }),
      mobile_number: Joi.string().required().min(10).max(10),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*()-_+=<>?/{}|~]{3,30}$"))
        .min(3)
        .max(30),
      user_role: Joi.string(),
    });

    console.log("sign up data = ", req.body);
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    try {
      const exist = await User.exists({ email: req.body.email });
      if (exist) {
        return next(
          CustomErrorHandler.alreadyexists("This email is already exists!")
        );
      }
    } catch (err) {
      return next(err);
    }
    //prepare modal
    const { name, email, mobile_number, password, user_role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      mobile_number,
      password: hashedPassword,
      user_role,
    });
    let access_token;
    //let refresh_token;
    try {
      const result = await user.save();
      //token
      access_token = JwtService.sign({ _id: result._id, role: result.role });
      //refresh_token = JwtService.sign({ _id: result._id, role: result.role },'1y',REFRESH_SECRET);
      //database white-list
      //await RefreshToken.create({token:refresh_token});
    } catch (err) {
      return next(err);
    }
    res.status(200).json({
      success: true,
      msg: "successFully registered user!",
      token: access_token,
      //refresh_token:refresh_token,
    });
  },
};

module.exports = registerController;
