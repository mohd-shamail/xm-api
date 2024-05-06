const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const getUserController = {
  async getUserProfile(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );
      if (!user) {
        next(CustomErrorHandler.notFound());
      }
      res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = getUserController;
