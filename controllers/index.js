//controllers:-
const registerController = require("./auth/registerController");
const loginController = require("./auth/loginController");
const changePasswordController = require("./auth/changePasswordController");
const forgotPasswordController = require("./auth/forgotPasswordController");
const getUserController = require("./userProfile/getUserProfile");
const  updateProfileController = require('./userProfile/updateProfile');
const submitfeeController = require("./accountsController/submitfeeController");
const uploadProfilePictureController = require('./userProfile/uploadProfilePicture');


module.exports = {
  registerController,
  loginController,
  changePasswordController,
  forgotPasswordController,
  getUserController,
  updateProfileController,
  uploadProfilePictureController,
  submitfeeController,
 
  
};
