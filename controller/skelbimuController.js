const Skelbimai = require("../models/skelbimuModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Darbdavio = require("../models/darbdavioModel");
const APIFeatures = require("../utils/apiFeatures");

exports.visiSkelbimai = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Skelbimai, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // const doc = await features.query.explain();
  const doc = await features.query.populate("imonesInfo");

  res.status(201).json({
    status: "success",
    Skelbimai: doc,
  });
});

exports.gautiSkelbima = catchAsync(async (req, res, next) => {
  const gautiSkelbima = await Skelbimai.findOne({
    _id: req.params.id,
  }).populate("imonesInfo");

  if (!gautiSkelbima) {
    return next(
      new AppError(`Su šiuo id: ${req.params.id} skelbimo nėra`, 404)
    );
  }
  res.status(201).json({
    status: "success",
    skelbimas: gautiSkelbima,
  });
});

exports.updateSkelbima = catchAsync(async (req, res, next) => {
  //Ant routo uzdeta protectDoc(authController) patikirinimui ar skelbima updatina useris, kuris ir sukure skelbima

  const skelbimasUpdate = await Skelbimai.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!skelbimasUpdate) {
    return next(
      new AppError(`Su šiuo id: ${req.params.id} skelbimo nėra`, 404)
    );
  }

  res.status(201).json({
    status: "success",
    skelbimas: skelbimasUpdate,
  });
});

exports.deleteSkelbima = catchAsync(async (req, res, next) => {
  //Ant routo uzdeta protectDoc(authController) patikirinimui ar skelbima trina useris, kuris ir sukure skelbima
  const skelbimasTrinti = await Skelbimai.findByIdAndDelete(req.params.id);

  if (!skelbimasTrinti) {
    return next(
      new AppError(`Su šiuo id: ${req.params.id} skelbimo nėra`, 404)
    );
  }
  res.status(201).json({
    status: "success",
    message: `Skelbimas ištrintas`,
  });
});

exports.sukurtiSkelbima = catchAsync(async (req, res, next) => {
  const imonesInfo = await Darbdavio.findOne({ user: req.user.id });

  if (!imonesInfo) {
    return next(
      new AppError(
        "Prieš kuriant skelbimą turite pateikti informaciją apie įmonę: /users/darbdavioInfo"
      )
    );
  }

  if (!req.body.imonesInfo) req.body.imonesInfo = imonesInfo;
  req.body.user = req.user.id;
  const sukurtiSkelbima = await Skelbimai.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      skelbimas: sukurtiSkelbima,
    },
  });
});

exports.manoSkelbimai = catchAsync(async (req, res, next) => {
  const docs = await Skelbimai.find({ user: req.user.id });
  res.status(201).json({
    status: "success",
    data: {
      skelbimai: docs,
    },
  });
});
