const express = require("express");
const skelbimuController = require("../controller/skelbimuController");
const router = express.Router({ mergeParams: true });
const authController = require("../controller/authController");

router
  .route("/")
  .get(skelbimuController.visiSkelbimai)
  .post(authController.protect, skelbimuController.sukurtiSkelbima);

router
  .route("/manoSkelbimai")
  .get(
    authController.isLogedIn,
    authController.protect,
    authController.restrictTo("siūlau darba", "admin"),
    skelbimuController.manoSkelbimai
  );

router
  .route("/:id")
  .get(skelbimuController.gautiSkelbima)
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

// Search
// router.get("/search", (req, res) => {
//   const { raktinisZodis } = req.query;
//   Skelbimai.findAll({ where: { pavadinimas: {} } });
// });

module.exports = router;
