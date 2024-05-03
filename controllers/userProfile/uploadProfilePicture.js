const CustomErrorHandler = require("../../services/CustomErrorHandler");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const User = require("../../models/user");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e7
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fieldSize: 1000000 * 2 },
}).single("image");

//route logic is here =>
const uploadProfilePictureController = {
  async store(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(
          CustomErrorHandler.notFound("upload Failed! Please try again.")
        );
      }
      const filePath = req.file.path;
      try {
        const user = await User.findOne({ _id: req.user._id });
        if (!user) {
          fs.unlink(`${appRoot}/${filePath}`, (err) => {
            return next(CustomErrorHandler.notFound(err.message));
          });
          return next(CustomErrorHandler.notFound());
        }
         // Check if the user already has an image
         if (user.profile.userImage) {
            // Delete the previous image
            fs.unlink(`${appRoot}/${user.profile.userImage}`, (err) => {
              if (err) {
                // Handle error if unable to delete previous image
                console.log("Error deleting previous image:", err);
              }
            });
          }
        user.profile.userImage = filePath;
        await user.save();
        res.status(201).json("profile picture updated successfully");
      } catch (err) {
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          return next(CustomErrorHandler.notFound(err.message));
        });
        return next(err);
      }
    });
  },
};

module.exports = uploadProfilePictureController;
