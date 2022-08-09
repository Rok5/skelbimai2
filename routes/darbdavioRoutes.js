const express = require("express");
const darbdavioController = require("../controller/darbdavioController");
const router = express.Router();
const authController = require("../controller/authController");
const skelbimuController = require("../controller/skelbimuController");

router
  .route("/darbdavioInfo")
  .post(
    authController.protect,
    authController.restrictTo("siūlau darba"),
    darbdavioController.darbdavioInfo
  )
  .patch(authController.protect, darbdavioController.updateDarbdavi);

router
  .route("/darbdaviai")
  .get(authController.protect, darbdavioController.visiDarbdaviai);

router
  .route("/darbdaviai/:id")
  .get(authController.protect, darbdavioController.gautiDarbdavi);

// router
//   .route("/updateDarbdavi")
//   .patch(authController.protect, darbdavioController.updateDarbdavi);

router
  .route("/skelbimai/:id/darbdavys")
  .get(authController.protect, darbdavioController.gautiDarbdaviPerSkelbima);

module.exports = router;
