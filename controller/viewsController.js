const Skelbimai = require("../models/skelbimuModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Darbdavio = require("../models/darbdavioModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  const keyName = req.query.key;
  const cityName = req.query.city;
  const sritis = req.query.sritis;

  let filters = {};
  if (req.query.key || req.query.city || req.query.sritis !== undefined) {
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
  }

  let query = Skelbimai.find(filters);

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const count = await Skelbimai.count(filters);

  const currentURL = req.originalUrl;

  // console.log(currentURL.startsWith("/?key", "bababa"));
  let keyURL;
  if (currentURL.startsWith("/?key")) {
    keyURL = true;
  }

  let url;
  if (currentURL === "/") {
    url = true;
  }

  const currentURLSplit = currentURL.split("&page")[0];

  const skelbimai = await query.skip(skip).limit(limit);

  res.status(201).render("overview", {
    title: "Skelbimai",
    skelbimai,
    current: page,
    pages: Math.ceil(count / limit),
    sritis,
    cityName,
    keyName,
    filters,
    currentURLSplit,
    keyURL,
    url,
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

exports.sukurtiSkelbima = catchAsync(async (req, res, next) => {
  const imonesInfo = await Darbdavio.findOne({ user: req.user.id });
  if (!imonesInfo) {
    return next(
      new AppError(
        "Prieš kuriant skelbimą turite pateikti informaciją apie įmonę: /darbdavioInfo"
      )
    );
  }

  res.status(200).render("sukurtiSkelbima", {
    title: "Skelbimo kūrimas",
    imonesInfo,
  });
});

exports.manoSkelbimai = catchAsync(async (req, res, next) => {
  const currentUserId = req.user.id;

  let query = Skelbimai.find({ user: req.user.id });

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const count = await Skelbimai.count({ user: currentUserId });

  const skelbimai = await query.skip(skip).limit(limit);

  res.status(201).render("manoSkelbimai", {
    title: "Mano skelbimai",
    skelbimai,
    currentUserId,
    current: page,
    pages: Math.ceil(count / limit),
  });
});

exports.getManoSkelbima = catchAsync(async (req, res, next) => {
  const skelbimas = await Skelbimai.findOne({ _id: req.params.id });
  const currentUserId = req.user.id;

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

exports.updateDarbdavi = catchAsync(async (req, res, next) => {
  const darbdavioInfo = await Darbdavio.findOne({ user: req.user.id });

  res.status(201).render("updateDarbdavioInfo", {
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

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  const count = await Skelbimai.count();

  const skelbimai = await Skelbimai.find({ filters }).skip(skip).limit(limit);

  res.status(201).render("overview", {
    title: "Skelbimai",
    skelbimai,
    current: page,
    pages: Math.ceil(count / limit),
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

exports.gautiDarbdaviPerSkelbimaViews = catchAsync(async (req, res, next) => {
  // const imone = await Skelbimai.findOne({ _id: req.params.id });
  console.log(req.params.imonesId);

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const gautiDarbdavi = await Darbdavio.findOne({
    _id: req.params.imonesId,
  })
    .skip(skip)
    .limit(limit)
    .populate("skelbimai user");

  const count = await Darbdavio.count({
    _id: req.params.imonesId,
  });

  if (!gautiDarbdavi) {
    return next(
      new AppError(`Su šiuo id: ${req.params.imonesId} darbdavio nėra`, 404)
    );
  }
  res.status(201).render("gautiDarbdavi", {
    title: "Skelbimai",
    gautiDarbdavi,
    current: page,
    pages: Math.ceil(count / limit),
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.status(201).render("forgotPassword", {
    title: "Pamiršau slaptažodį",
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(201).render("resetPassword", {
    title: "Atkurti slaptažodį",
  });
});
