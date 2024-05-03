const express = require("express");
const router = express.Router();
const controllers = require("../controllers");
const auth = require("../middlewares/auth");
//const refreshController = require("../controllers/auth/refreshController");

//user Authentication
router.post("/register", controllers.registerController.register);
router.post("/login", controllers.loginController.login);
router.post("/changePwd", controllers.changePasswordController.changePassword);
router.post("/forgotPwd", controllers.forgotPasswordController.forgotpassword);
router.get("/getUserProfile", auth, controllers.getUserController.getUserProfile);
router.post("/updateProfile", auth, controllers.updateProfileController.updateProfile);
router.post("/uploadProfileImg",auth, controllers.uploadProfilePictureController.store);
//router.post('/refresh', refreshController.refresh);
router.post("/submitfee",auth, controllers.submitfeeController.submitfees);


module.exports = router;
