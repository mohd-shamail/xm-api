  const Joi = require("joi");
  const User = require("../../models/user");
  const moment = require("moment");
  const StudentFees = require("../../models/studentFees");
  const CustomErrorHandler = require("../../services/CustomErrorHandler");
  const { v4: uuidv4 } = require('uuid');

  const submitfeeController = {
    async submitfees(req, res, next) {
      const feeSlipSchema = Joi.object({
        courseFee: Joi.string().required(),
        paymentMode: Joi.string().min(3).max(50).required(),
        lateFee: Joi.string().min(3).max(50).required(),
        discount: Joi.string().min(3).max(50),
        fromDate: Joi.date().required(),
        toDate: Joi.date().required(),
        dueMonth: Joi.array().items(Joi.string().min(3).max(100)).required(),
        totalPayment: Joi.string().min(3).max(20).required(),
      });
      const { error } = feeSlipSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      const { courseFee,paymentMode,lateFee,discount,fromDate,toDate,dueMonth,totalPayment } = req.body;
      try {
        // Find the user by email
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
          next(CustomErrorHandler.notFound());
        }
        const uuid = uuidv4();
        const receiptId = uuid.replace(/-/g, '').slice(0, 10);
        const submitDate = moment().format("MM/DD/YYYY hh:mm A");
        console.log("receiptId =",   receiptId);
        console.log("submitDate =",  submitDate);

        // Create a new fee slip
        const feeSlip = new StudentFees({
          user: req.user._id,
          receiptId: receiptId,
          courseFee: courseFee,
          paymentMode: paymentMode,
          lateFee: lateFee,
          submitDate:submitDate,
          discount: discount,
          fromDate: fromDate,
          toDate: toDate,
          dueMonth: dueMonth,
          totalPayment: totalPayment
        });

        // Save the fee slip
        await feeSlip.save();

        res.status(201).json({ message: "Fee slip submitted successfully", feeSlip: feeSlip });
        
      } catch (err) {
        return next(err);
      }
    },
  };
  module.exports = submitfeeController;
