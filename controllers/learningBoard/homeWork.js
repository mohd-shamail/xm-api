const HomeWork = require("../../models/homeWork");
const Joi = require("joi");
const moment = require("moment");

const homeWorkController = {
  async updateHomeWork(req, res, next) {
    // Validation schema
    const updateHomeWorkSchema = Joi.object({
      title: Joi.string(),
      // date: Joi.string(),
      course: Joi.string(),
      description: Joi.string(),
      homeWorkUrl: Joi.string().uri(),
    });
    const { error } = updateHomeWorkSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { title, course, description, homeWorkUrl } = req.body;
    const date = moment().format("DD-MM-YYYY");
    // Calculate expiration time (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 30);
    const homeWork = new HomeWork({
      title,
      date,
      course,
      description,
      homeWorkUrl,
      expiresAt,
    });
    try {
      await homeWork.save();
      res.status(200).json({
        success: true,
        msg: "Successfully Updated Home-Work!",
      });
    } catch (err) {
      return next(err);
    }
  },

  //View Home-Work here
  async viewHomeWork(req, res, next) {
    const viewHomeWorkSchema = Joi.object({
      course: Joi.string().required(),
    });

    const { error } = viewHomeWorkSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { course } = req.body;

    try {
      const homeWorks = await HomeWork.find({ course }).select(
        "-_id -expiresAt -createdAt -__v"
      );

      if (!homeWorks || homeWorks.length === 0) {
        return res.status(404).json({
          success: false,
          msg: "No homework found for the specified course",
        });
      }

      res.status(200).json({
        success: true,
        data: homeWorks,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = homeWorkController;
