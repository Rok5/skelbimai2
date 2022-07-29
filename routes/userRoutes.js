const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const darbdavioController = require("../controller/darbdavioController");
const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.resetPassowrd);
router
  .route("/updatePassword")
  .patch(authController.protect, authController.updatePassword);

router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);

router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteMe);

// router.route("/darbdaviai/:darbdavioId").post();
// router
//   .route("/darbdavioInfo")
//   .post(authController.protect, darbdavioController.darbdavioInfo);

// router.route("/darbdaviai").get(darbdavioController.visiDarbdaviai);

// router.route("/darbdaviai/:id").get(darbdavioController.gautiDarbdavi);

router.route("/").get(userController.visiUseriai);

module.exports = router;
