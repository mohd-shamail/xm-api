const Joi = require("joi");
const User = require("../../models/user");
const Event = require("../../models/events");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const moment = require("moment");

const eventController = {
  async addEvents(req, res, next) {
    // Validation schema using Joi
    const addEventsSchema = Joi.object({
      title: Joi.string().required(),
      sentBy: Joi.string().required(),
      desc: Joi.string().required(),
      imageUrl: Joi.string().uri().required(),
    });

    // Validate request body
    const { error } = addEventsSchema.validate(req.body);
    if (error) {
      return next(error); // Return error if validation fails
    }

    try {
      // Find the user
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      const { title, sentBy, desc, imageUrl } = req.body;
      const date = moment().toDate(); 

      // Set expiresAt to 14 days from now
      const expiresAt = moment().add(14, "days").toDate();
      // Log the URL to check if it's valid
      console.log("Image URL being saved:", imageUrl);
      // Create a new event document
      const eventsData = new Event({
        title,
        sentBy,
        date,
        desc,
        imageUrl,
        expiresAt, // Set the expiration date
      });
      console.log(eventsData);
      // Save the event to the database
      await eventsData.save();

      res.status(200).json({
        success: true,
        message: "Event added successfully.",
      });
    } catch (err) {
      console.error("Error adding event:", err); // Detailed logging
      return next(err); // Handle any errors that occur during saving
    }
  },

  async getEvents(req, res, next) {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }
      // Fetch all events from the database
      const events = await Event.find();
      if (events.length === 0) {
        // Return a 404 Not Found error if no events exist
        return next(CustomErrorHandler.notFound("No events found"));
      }
      // Return the events in JSON format
      res.status(200).json({
        success: true,
        data: events,
      });
    } catch (err) {
      // Handle any errors that occur while fetching events
      return next(CustomErrorHandler.notFound(err.message));
    }
  },
};

module.exports = eventController;
