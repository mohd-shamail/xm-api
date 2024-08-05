const Joi = require("joi");
const User = require("../../models/user");
const Event = require("../../models/events");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/events/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e7
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 2 },
}).single("image");

const eventController = {
  async addEvents(req, res, next) {
    // Validation schema
    const addEventsSchema = Joi.object({
      title: Joi.string().required(),
      subTitle: Joi.string().required(),
      date: Joi.string().required(),
      desc1: Joi.string().required(),
      desc2: Joi.string().required(),
      isNewPost: Joi.boolean(),
      category: Joi.string().required(),
    });
    const { error } = addEventsSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("User not found");
      return next(CustomErrorHandler.notFound());
    }
    const { title, subTitle, date, desc1, desc2, isNewPost, category } =
      req.body;
    console.log("title = " ,title,"subTitle = ", subTitle, "date = " ,date, 
      "desc1 = ", desc1,"desc2 = ", desc2,"isNewPost = ",  isNewPost,"category =", category);
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(
          CustomErrorHandler.notFound("upload Failed! Please try again.")
        );
      }
      if (!req.file) {
        return next(CustomErrorHandler.notFound("No file uploaded."));
      }
      const filePath = req.file.path;
      console.log("filePath of Img =", filePath);
      try {
        const eventsData = new Event({
          title,
          subTitle,
          date,
          desc1,
          desc2,
          isNewPost,
          category,
          // imageUrl: filePath,
        });
        console.log("eventsData = ", eventsData);
        await eventsData.save();
        res.status(200).json({
          success: true,
          message: "Event Added successfully.",
        });
      } catch (err) {
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          return next(CustomErrorHandler.notFound(err.message));
        });
        return next(err);
      }
    });
  },
};

module.exports = eventController;
