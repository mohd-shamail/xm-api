const User = require("../../models/user");
const CustomErrorHandler = require("../../services/CustomErrorHandler");

const getUserController = {
  async getUserProfile(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v -createdAt -_id -profile._id -profile.updatedAt -profile.createdAt" 
      );
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      // Check if the user image exists and construct the URL if it does
      const imageURL = user.profile.userImage
        ? `http://192.168.168.56:3000/${user.profile.userImage}`
        : "";

      // Include the imageURL in the response
      res.status(200).json({ ...user.toJSON(), imageURL });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = getUserController;
