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
const studentsListController = require('../controllers/accounts/getStudentsList');
const attendanceController = require('../controllers/attendence/attendanceController');
const holidayController = require('../controllers/attendence/holidayController');
const feesHistoryController = require('../controllers/accounts/getFeesHistory');
const allFeesHistoryController = require('../controllers/accounts/viewAllFeeHistory');
const viewAttendanceController = require('../controllers/attendence/viewAttendance');
const timeTableController = require('../controllers/attendence/timeTable');
const homeWorkController = require('../controllers/learningBoard/homeWork');
const testExamController = require('../controllers/learningBoard/testExam');
const learningNotesController = require('../controllers/learningBoard/notes');
const carouselController = require('../controllers/learningBoard/carousel');
const eventController = require('../controllers/events/eventsController');
const mylearningController = require('../controllers/learningBoard/myLearning');

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
  studentsListController,
  attendanceController,
  holidayController,
  feesHistoryController,
  allFeesHistoryController,
  viewAttendanceController,
  timeTableController,
  homeWorkController,
  testExamController,
  learningNotesController,
  carouselController,
  eventController,
  mylearningController,
};
