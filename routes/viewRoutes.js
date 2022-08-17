const express = require("express");
const viewsController = require("../controller/viewsController");
const authController = require("../controller/authController");
const darbdavioController = require("../controller/darbdavioController");
const skelbimuController = require("../controller/skelbimuController");

const router = express.Router();

router.use(authController.isLogedIn);

router
  .route("/")
  .get(viewsController.getOverview)
  .post(viewsController.getOverview);

router.get("/skelbimas/:id", viewsController.getSkelbima);

router.get("/login", viewsController.getLogInForm);
router.get("/signup", viewsController.getSignUpForm);
router.get("/me", authController.protect, viewsController.getAccount);
router.get(
  "/sukurtiSkelbima",
  authController.protect,
  authController.restrictTo("siūlau darba", "admin"),
  viewsController.sukurtiSkelbima
);
router.get(
  "/manoSkelbimai",
  authController.protect,
  authController.restrictTo("siūlau darba", "admin"),
  viewsController.manoSkelbimai
);

router.get(
  "/manoSkelbimai/:id",
  authController.protect,
  authController.restrictTo("siūlau darba", "admin"),
  viewsController.getManoSkelbima
);

router.delete(
  "/skelbimas/:id",
  authController.protect,
  authController.restrictTo("siūlau darba", "admin"),
  viewsController.trintiSkelbima
);
router
  .route("/darbdavioInfo")
  .get(
    authController.protect,
    authController.restrictTo("siūlau darba", "admin"),
    viewsController.darbdavioInfo
  );

router
  .route("/updateDarbdavi")
  .get(
    authController.protect,
    authController.restrictTo("siūlau darba", "admin"),
    viewsController.updateDarbdavi
  );

router.get(
  "/darbdavys/:imonesId/",
  viewsController.gautiDarbdaviPerSkelbimaViews
);

router.get("/forgotPassword", viewsController.forgotPassword);
router.get("/resetPassword/:token", viewsController.resetPassword);

module.exports = router;
