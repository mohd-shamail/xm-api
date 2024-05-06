const User = require("../../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const updateProfileController = {
  async updateProfile(req, res, next) {
    //req validation
    const updateProfileSchema = Joi.object({
      mobile_number: Joi.string().min(10).max(10), // New
      course: Joi.array().items(Joi.string().min(3).max(100)).required(), // New
      schoolName: Joi.string()
      .regex(/^[a-zA-Z\s.]+$/)
        .min(3)
        .max(50),
      fatherName: Joi.string()
      .regex(/^[a-zA-Z\s.]+$/)
        .min(3)
        .max(30),
      address: Joi.string().min(3).max(50),
    });
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { mobile_number, course, schoolName, fatherName, address } = req.body;
    try {
      // Find the user by email
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        next(CustomErrorHandler.notFound());
      }
      user.mobile_number = mobile_number;
      user.profile.course = course;
      user.profile.schoolName = schoolName;
      user.profile.fatherName = fatherName;
      user.profile.address = address;
      // Save the updated user document
      await user.save();
      res.status(200).json("profile updated successfully");
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = updateProfileController;
