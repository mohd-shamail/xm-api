const User = require("../../models/user");
const Leaves = require("../../models/leaves");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const Joi = require("joi");

const leaveController = {
  async leaveApply(req, res, next) {
    // Validate request body
    const leaveApplySchema = Joi.object({
      leaveType: Joi.string().required(),
      startDate: Joi.string().required(),
      endDate: Joi.string().required(),
      reason: Joi.string().required(),
    });

    const { error } = leaveApplySchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    try {
      // Convert startDate and endDate to Date objects
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if startDate is before endDate
      if (start > end) {
        return res.status(400).json({
          success: false,
          message: "Start date cannot be after end date.",
        });
      }

      // Find the user by ID
      const user = await User.findById(req.user._id).lean();
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      // Check if a leave already exists for the same student with overlapping dates
      const existingLeave = await Leaves.findOne({
        studentId: user._id,
        $or: [
          { startDate: { $lte: end }, endDate: { $gte: start } }, // Overlapping leaves
        ],
      });

      if (existingLeave) {
        return res.status(400).json({
          success: false,
          message: "A leave has already been applied for the selected date range.",
        });
      }

      // Create a new leave record if no existing leave is found
      const leave = new Leaves({
        studentId: user._id,
        leaveType,
        startDate: start,
        endDate: end,
        reason,
      });

      // Save the leave to the database
      await leave.save();

      res.status(201).json({
        success: true,
        message: "Leave application submitted successfully.",
      });

    } catch (err) {
      return res.status(500).json({
        success: false,
        error: "An error occurred while applying for leave.",
      });
    }
  },
};

module.exports = leaveController;
