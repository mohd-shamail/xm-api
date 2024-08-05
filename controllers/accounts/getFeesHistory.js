const User = require("../../models/user");
const Joi = require("joi");
const StudentFees = require("../../models/studentFees");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const feesHistoryController = {
  async viewFeesHistory(req, res, next) {
    // Validate the request body
    // const viewFeesHistorySchema = Joi.object({
    //   _id: Joi.string().required(),
    // });
    // const { error } = viewFeesHistorySchema.validate(req.body);
    // if (error) {
    //   return next(error);
    // }

    // const { _id } = req.body;

    try {
      //const user = await User.findById(_id).select("name"); // Only fetching name to keep it minimal
      const user = await User.findById(req.user._id).select("name");
      if (!user) {
        console.log("User not found");
        return next(CustomErrorHandler.notFound());
      }

      // Fetch the student fees data for the user with only the required fields
      const feesHistory = await StudentFees.find({ user: user._id })
        .select("receiptId totalPayment dueMonth submitDate")
        .lean();

      if (!feesHistory.length) {
        return next(CustomErrorHandler.notFound("No fees history found"));
        //console.log("No fees history found for user:", _id);
      }

      // Include the fees history in the response
      res.status(200).json({ user: user.toJSON(), feesHistory });
    } catch (err) {
      console.error("Error fetching fees history:", err);
      return next(err);
    }
  },
};

module.exports = feesHistoryController;
