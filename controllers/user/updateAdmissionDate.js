const User = require("../../models/user");
const Joi = require("joi");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const admissionDateController = {
  async updateAdmissionDate(req, res, next) {
    const updateAdmissionDateSchema = Joi.object({
      id: Joi.string().required(),
      admissionDate: Joi.string().required(),
    });
    const { error } = updateAdmissionDateSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { id, admissionDate } = req.body;
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        next(CustomErrorHandler.notFound());
      }
      // Update the admission date
      user.profile.admissionDate = admissionDate;
      await user.save();
      res.status(200).json({success:true, message: "Admission date updated successfully" });
    } catch (err) {
      return next(CustomErrorHandler.serverError(err.message));
    }
  },
};
module.exports = admissionDateController;
