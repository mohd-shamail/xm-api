const User = require("../../models/user");
const Joi = require("joi");
const StudentFees = require("../../models/studentFees");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const feesInvoiceController = {
  async downloadInvoice(req, res, next) {
    const downloadInvoiceSchema = Joi.object({
      _id: Joi.string().required(),
      month: Joi.string().required(), //Jan2024
    });

    const { error } = downloadInvoiceSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { _id, month } = req.body;
    console.log(_id, month);
    try {
      const [user, feeSlipData] = await Promise.all([
        User.findOne({ _id }),
        StudentFees.findOne({
          user: _id,
          dueMonth: { $in: [month] },
        }),
      ]);

      if (!user) {
        return next(CustomErrorHandler.notFound("User not found!"));
      }

      if (!feeSlipData) {
        return next(
          CustomErrorHandler.notFound(
            "No fee data found for the specified month!"
          )
        );
      }

      const {
        receiptId,
        courseFee = 0,
        discount = 0,
        paymentMode,
        lateFee = 0,
        submitDate,
        fromDate,
        toDate,
        totalPayment,
        dueMonth,
      } = feeSlipData;

      const username = user.name;
      const mobileNumber = user.mobile_number;
      const courseName = Array.isArray(user.profile.course)
        ? user.profile.course.join(", ")
        : "N/A"; // Ensure `course` is an array and handle if it isn't.

      const formatCourseName = courseName.replace(/,([^,]*)$/, ", and$1");

      // Ensure dueMonth is valid and not empty
      const due_months =
        Array.isArray(dueMonth) && dueMonth.length > 0
          ? formatMonths(dueMonth)
          : "N/A";

      // Ensure valid number parsing
      const subtotalAmt = (parseFloat(courseFee) + parseFloat(lateFee)).toFixed(
        2
      );

      // Constructing response data
      const data = {
        username,
        mobileNumber,
        receiptId,
        courseFee,
        discount,
        paymentMode,
        lateFee,
        submitDate,
        fromDate,
        toDate,
        totalPayment,
        dueMonth: due_months,
        formatCourseName,
        subtotalAmt,
      };

      // Return a success response with the data
      res.status(200).json({ success: true, data });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = feesInvoiceController;

function formatMonths(months) {
  // Handle empty array scenario
  if (!Array.isArray(months) || months.length === 0) {
    return "No months available";
  }

  let formattedMonths = months.map((month) => {
    const monthName = month.slice(0, 3); // Extract first three characters (e.g., Jan, Feb)
    return monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
  });

  if (formattedMonths.length > 1) {
    const lastMonth = formattedMonths.pop();
    return formattedMonths.join(", ") + " and " + lastMonth;
  } else {
    return formattedMonths[0];
  }
}
