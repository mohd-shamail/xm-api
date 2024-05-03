const CustomErrorHandler = require("../services/CustomErrorHandler");
const JwtService = require("../services/JwtService");

const auth = async (req, res, next) => {
  let authheader = req.headers.authorization;
  if (!authheader) {
    return next(CustomErrorHandler.unAuthorized());
  }
  const access_token = authheader.split(" ")[1];
  try {
    const { _id, role } = await JwtService.verify(access_token);
    const user = { _id, role };
    req.user = user;
    next();
  } catch (err) {
    return next(CustomErrorHandler.unAuthorized());
  }
};
module.exports = auth;
