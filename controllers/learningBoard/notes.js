const LearningNotes = require("../../models/learningNotes");
const Joi = require("joi");
const moment = require("moment");

const learningNotesController = {
  async updateNotes(req, res, next) {
    const updateNotesSchema = Joi.object({
      title: Joi.string(),
      course: Joi.string(),
      sub: Joi.string(),
      desc: Joi.string(),
      notesUrl: Joi.string().uri(),
    });
    const { error } = updateNotesSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { title, course, sub, desc, notesUrl } = req.body;
    const date = moment().format("DD-MM-YYYY");
    const notes = new LearningNotes({
      title,
      date,
      course,
      sub,
      desc,
      notesUrl,
    });
    try {
      await notes.save();
      res.status(200).json({
        success: true,
        msg: "successFully updated Learning Notes!",
      });
    } catch (err) {
      return next(err);
    }
  },
  //view Learning Notes
    async ViewNotes(req, res, next) {
      const ViewNotesSchema = Joi.object({
        course: Joi.string().required(),
        sub: Joi.string().required()
      });
  
      const { error } = ViewNotesSchema.validate(req.body);
      if (error) {
        return next(error);
      }
  
      const { course, sub } = req.body;
  
      try {
        const notes = await LearningNotes.find({ course, sub }).select(
          "-_id -expiresAt -createdAt -__v"
        );
  
        if (!notes || notes.length === 0) {
          return res.status(404).json({
            success: false,
            data:[],
            msg: "No notes found for the specified course and subject",
          });
        }
  
        res.status(200).json({
          success: true,
          data: notes,
        });
      } catch (err) {
        return next(err);
      }
    },
};

module.exports = learningNotesController;
