//controllers:-
const registerController = require("./auth/registerController");
const loginController = require("./auth/loginController");
const changePasswordController = require("./auth/changePasswordController");
const forgotPasswordController = require("./auth/forgotPasswordController");
const getUserController = require("./user/getUserProfile");
const updateProfileController = require("./user/updateProfile");
const submitfeeController = require("./accounts/submitfeeController");
const uploadProfilePictureController = require("./user/uploadProfilePicture");
const feesInvoiceController = require("./accounts/downloadFeesInvoice");

module.exports = {
  registerController,
  loginController,
  changePasswordController,
  forgotPasswordController,
  getUserController,
  updateProfileController,
  uploadProfilePictureController,
  submitfeeController,
  feesInvoiceController,
};
