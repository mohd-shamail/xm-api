const StudentCertificate = require("../../models/studentCertificates");
const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const Joi = require("joi");
const moment = require("moment");

const certificatesController = {
  async addCertificate(req, res, next) {
    // Validation schema
    const addCertificateSchema = Joi.object({
      id: Joi.string().required(),
      certificateType: Joi.string().required(),
      subject: Joi.string().required(),
      rank: Joi.string().required(),
      examDate: Joi.string().required(),
    });

    const { error } = addCertificateSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { id, certificateType, subject, rank, examDate } = req.body;

    try {
      // Find user by ID
      const user = await User.findOne({ _id: id }).select(
        "-password -updatedAt -__v -createdAt -_id -profile._id -profile.updatedAt -profile.createdAt"
      );
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      // Generate a unique numeric certificate ID
      const currentYear = new Date().getFullYear(); // e.g., 2024
      const randomNum = Math.floor(Math.random() * 100000);
      let certificateId = `${currentYear}${randomNum}`.slice(0, 10);
      while (certificateId.length < 10) {
        certificateId = certificateId + "0"; // Append zeros until it reaches 10 digits
      }

      // Format the current date as issue date (e.g., "12-July-2024")
      const issueDate = moment().format("DD-MMM-YYYY");

      // Create a new certificate document
      const newCertificate = new StudentCertificate({
        user: id,
        certificateType,
        subject,
        rank,
        examDate,
        issueDate, // Set the current formatted date
        certificateId: Number(certificateId), // Convert to number
      });

      // Save the certificate to the database
      await newCertificate.save();

      res.status(201).json({
        success: true,
        message: "Certificate created successfully",
      });
    } catch (err) {
      return next(err);
    }
  },
  async getCertificates(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select(
        "-password -updatedAt -__v -createdAt -_id -mobile_number -user_role -profile -admissionDate"
      );
      console.log(user);
      if (!user) {
        return next(CustomErrorHandler.notFound("User not found"));
      }
      const certificates = await StudentCertificate.find({
        user: req.user._id,
      });

      if (!certificates || certificates.length === 0) {
        return res
          .status(404)
          .json({ message: "No certificates found for this user." });
      }

      res.status(200).json({ success: true, user, certificates });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = certificatesController;
