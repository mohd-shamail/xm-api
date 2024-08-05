const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carouselSchema = new Schema({
  carouselImg: {
    type: String,
    default: "",
  }
});

module.exports = mongoose.model("CarouselData", carouselSchema, "carouselData");
