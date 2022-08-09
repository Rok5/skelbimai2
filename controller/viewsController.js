const Skelbimai = require("../models/skelbimuModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Darbdavio = require("../models/darbdavioModel");
const APIFeatures = require("../utils/apiFeatures");

exports.getOverview = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Skelbimai, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const skelbimai = await features.query;
  // let key;

  // console.log(skelbimai);

  res.status(200).render("overview", {
    title: "Visi skelbimai",
    skelbimai,
  });
});

exports.getSkelbima = catchAsync(async (req, res, next) => {
  const skelbimas = await Skelbimai.findOne({ _id: req.params.id });

  // const currentUserId = req.user.id;
  if (!skelbimas) {
    return next(new AppError("Skelbimo su tokiu id nėra", 404));
  }
  res.status(200).render("skelbimas", {
    title: "Skelbimas",
    skelbimas,
  });
});

exports.getLogInForm = catchAsync(async (req, res) => {
  res.status(200).render("login", {
    title: "Prisijunkite prie paskyros",
  });
});

exports.getSignUpForm = catchAsync(async (req, res) => {
  res.status(200).render("signup", {
    title: "Registracija",
  });
});

exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render("account", {
    title: "Nustatymai",
  });
});

exports.sukurtiSkelbima = catchAsync(async (req, res) => {
  const [imonesInfo] = await Darbdavio.find({ user: req.user.id });
  console.log(`imones info is viewsController`, imonesInfo);
  res.status(200).render("sukurtiSkelbima", {
    title: "Skelbimo kūrimas",
    imonesInfo,
  });
});

exports.manoSkelbimai = catchAsync(async (req, res, next) => {
  const skelbimai = await Skelbimai.find({ user: req.user.id });
  const currentUserId = req.user.id;

  res.status(201).render("manoSkelbimai", {
    title: "Mano skelbimai",
    skelbimai,
    currentUserId,
  });
});

exports.getManoSkelbima = catchAsync(async (req, res, next) => {
  const skelbimas = await Skelbimai.findOne({ _id: req.params.id });
  const currentUserId = req.user.id;
  // const currentUserId = req.user.id;
  if (!skelbimas) {
    return next(new AppError("Skelbimo su tokiu id nėra", 404));
  }
  res.status(200).render("manoSkelbimas", {
    title: "Skelbimas",
    skelbimas,
    currentUserId,
  });
});

exports.darbdavioInfo = catchAsync(async (req, res, next) => {
  const darbdavioInfo = await Darbdavio.findOne({ user: req.user.id });

  res.status(201).render("darbdavioInfo", {
    title: "Darbdavio informacija",
    darbdavioInfo,
  });
});

exports.filtruotiSkelbimai = catchAsync(async (req, res, next) => {
  const keyName = req.query.key;
  const cityName = req.query.city;
  const sritis = req.query.sritis;

  let filters = {};
  if (cityName.length > 0) {
    filters = {
      ...filters,
      miestas: cityName,
    };
  }
  if (keyName.length > 0) {
    filters = {
      ...filters,
      $text: { $search: keyName },
    };
  }

  if (sritis.length > 0) {
    filters = {
      ...filters,
      darboSritis: sritis,
    };
  }

  const skelbimai = await Skelbimai.find(filters);
  res.status(201).render("overview", {
    title: "Skelbimai",
    skelbimai,
    sritis,
    cityName,
  });
});

exports.trintiSkelbima = catchAsync(async (req, res, next) => {
  const skelbimai = await Skelbimai.find({ user: req.user.id });
  //Ant routo uzdeta protectDoc(authController) patikirinimui ar skelbima trina useris, kuris ir sukure skelbima
  const skelbimasTrinti = await Skelbimai.findByIdAndDelete(req.params.id);

  if (!skelbimasTrinti) {
    return next(
      new AppError(`Su šiuo id: ${req.params.id} skelbimo nėra`, 404)
    );
  }

  res.status(201).render("manoSkelbimai", {
    title: "Mano skelbimai",
    skelbimai,
  });
});
