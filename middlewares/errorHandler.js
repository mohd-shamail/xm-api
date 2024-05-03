const { DEBUG_MODE } = require("../config");
const Joi = require("joi");
const CustomErrorHandler = require("../services/CustomErrorHandler");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let data = {
    message: "internal Server Error!",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };
  if (err instanceof Joi.ValidationError) {
    statusCode = 400;
    data = {
      message: err.message,
    };
  }
  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }
  return res.status(statusCode).json(data);
};

module.exports = errorHandler;
