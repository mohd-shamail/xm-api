const CarouselData = require("../../models/carousel");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/carouselImage/"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e7
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const handleMultipartData = multer({
  storage,
  limits: { fileSize: 1000000 * 2 }, // Correct key: fileSize
}).single("image");

const carouselController = {
  async updateCarouseldata(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      if (err) {
        return next(
          CustomErrorHandler.notFound("upload Failed! Please try again.")
        );
      }
      if (!req.file) {
        return next(CustomErrorHandler.badRequest("No file uploaded."));
      }
      const filePath = req.file.path;
      console.log("filePath of Img =", filePath);
      try {
        const carousel = new CarouselData({
          carouselImg: filePath,
        });
        await carousel.save();
        res.status(200).json({
          success: true,
          message: "Carousel image uploaded successfully.",
        });
      } catch (err) {
        fs.unlink(`${appRoot}/${filePath}`, (err) => {
          return next(CustomErrorHandler.notFound(err.message));
        });
        return next(err);
      }
    });
  },

  async getCarouseldata(req, res, next) {
    try {
      const carousels = await CarouselData.find().select("-__v");
      res.status(200).json({
        success: true,
        data: carousels,
      });
    } catch (err) {
      return next(err);
    }
  },
};

module.exports = carouselController;
