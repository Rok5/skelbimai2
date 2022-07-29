const express = require("express");
const skelbimuController = require("../controller/skelbimuController");
const router = express.Router({ mergeParams: true });
const authController = require("../controller/authController");

router
  .route("/")
  .get(skelbimuController.visiSkelbimai)
  .post(authController.protect, skelbimuController.sukurtiSkelbima);

router
  .route("/:id")
  .get(authController.protect, skelbimuController.gautiSkelbima)
  .patch(
    authController.protect,
    authController.protectDoc,
    authController.restrictTo("siūlau darba", "admin"),
    skelbimuController.updateSkelbima
  )
  .delete(
    authController.protect,
    authController.protectDoc,
    authController.restrictTo("siūlau darba", "admin"),
    skelbimuController.deleteSkelbima
  );

// router
//   .route("/:skelbimoId/darbdaviai/:id")
//   .get(authController.protect, darbdavioController.gautiDarbdavi);

module.exports = router;
