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
router.get(
  "/getUserProfile",
  auth,
  controllers.getUserController.getUserProfile
);
router.post(
  "/updateProfile",
  auth,
  controllers.updateProfileController.updateProfile
);
router.post(
  "/uploadProfileImg",
  auth,
  controllers.uploadProfilePictureController.store
);
//router.post('/refresh', refreshController.refresh);
router.post("/submitfee", controllers.submitfeeController.submitfees);
router.post(
  "/downloadFeesInvoice",
  controllers.feesInvoiceController.downloadInvoice
);
router.get(
  "/getStudentsList",
  auth,
  controllers.studentsListController.studentsList
);
router.post(
  "/markAttendance",
  auth,
  controllers.attendanceController.markAttendance
);
router.post(
  "/getAttendanceByStudent",
  controllers.attendanceController.getAttendanceByStudent
);
router.get(
  "/getAllAttendance",
  controllers.attendanceController.getAllAttendance
);
router.get("/getHolidays", controllers.holidayController.viewHoliday);
router.get(
  "/viewFeesHistory",
  auth,
  controllers.feesHistoryController.viewFeesHistory
);
router.post(
  "/viewallFeesHistory",
  controllers.allFeesHistoryController.viewAllFeesHistory
);
router.post(
  "/viewAttendance",
  auth,
  controllers.viewAttendanceController.viewAttendance
);
router.post("/viewTimeTable",auth, controllers.timeTableController.viewTimeTable);
router.post(
  "/updateTimeTable",
  controllers.timeTableController.updateTimeTable
);
router.post("/updateHomeWork", controllers.homeWorkController.updateHomeWork);
router.post("/viewHomeWork", controllers.homeWorkController.viewHomeWork);
router.post("/updateTestPaper", controllers.testExamController.updateTestExam);
router.post("/viewTestPaper", controllers.testExamController.ViewTestpaper);
router.post("/updateNotes", controllers.learningNotesController.updateNotes);
router.post("/viewNotes", controllers.learningNotesController.ViewNotes);
router.post(
  "/updateCarousel",
  controllers.carouselController.updateCarouseldata
);
router.get("/getCarousel", controllers.carouselController.getCarouseldata);
router.post("/addEvent", auth, controllers.eventController.addEvents);
router.get("/myLearning", auth, controllers.mylearningController.myLearning);

module.exports = router;
