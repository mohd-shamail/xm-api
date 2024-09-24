const User = require("../../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const updateProfileController = {
  async updateProfile(req, res, next) {
    //req validation
    const updateProfileSchema = Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "in"] },
      }),
      mobile_number: Joi.string().min(10).max(13), // New
      course: Joi.array().items(Joi.string().min(3).max(100)),
      schoolName: Joi.string()
        .regex(/^[a-zA-Z\s.]+$/)
        .min(3)
        .max(50),
      fatherName: Joi.string()
        .regex(/^[a-zA-Z\s.]+$/)
        .min(3)
        .max(30),
      address: Joi.string().min(3).max(50),
      gender: Joi.string().min(2).max(10),
      dateOfBirth: Joi.string().min(3).max(20),
    });
    console.log(req.body);
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const {
      email,
      mobile_number,
      course,
      schoolName,
      fatherName,
      address,
      gender,
      dateOfBirth,
    } = req.body;
    try {
      // Find the user by email
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        next(CustomErrorHandler.notFound());
      }
      // Initialize user profile if it doesn't exist
      if (!user.profile) {
        user.profile = {};
      }
      user.email = email;
      user.mobile_number = mobile_number;
      user.profile.course = course;
      user.profile.schoolName = schoolName;
      user.profile.fatherName = fatherName;
      user.profile.address = address;
      user.profile.dateOfBirth = dateOfBirth;
      user.profile.gender = gender;

      // Save the updated user document
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "profile updated successfully" });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = updateProfileController;
