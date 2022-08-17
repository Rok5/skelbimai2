const Darbdavio = require("../models/darbdavioModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Skelbimai = require("../models/skelbimuModel");
const APIFeatures = require("../utils/apiFeatures");

exports.darbdavioInfo = catchAsync(async (req, res, next) => {
  if (req.user.role === "siūlau darba") {
    const arUserJauPridejesInfo = await Darbdavio.find({
      user: req.user.id,
    });

    // console.log("pridetas: ", arUserJauPridejesInfo.length);
    if (arUserJauPridejesInfo.length === 1) {
      return next(
        new AppError(
          "Jau esate pridėję informaciją apie įmonę, jei norite ją atnaujinti, eikite į: /updateDarbdavi ",
          400
        )
      );
    }
    if (!req.body.user) req.body.user = req.user.id;
    const darbdavioInfo = await Darbdavio.create({
      imonesPav: req.body.imonesPav,
      imonesKodas: req.body.imonesKodas,
      kontaktinisAsmuo: req.body.kontaktinisAsmuo,
      user: req.body.user,
    });

    res.status(201).json({
      status: "success",
      data: {
        info: darbdavioInfo,
      },
    });
  } else {
    return next(new AppError("Jūs nesate užsiregistravęs kaip darbdavys"));
  }
});

exports.visiDarbdaviai = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Darbdavio, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  res.status(201).json({
    status: "success",
    DarbdaviuInfo: doc,
  });
});

exports.gautiDarbdaviPerSkelbima = catchAsync(async (req, res, next) => {
  const imone = await Skelbimai.findOne({ _id: req.params.id });
  // if (req.params.id) filter = { Darbdavio: req.params.id };
  const gautiDarbdavi = await Darbdavio.findOne({
    _id: imone.imonesInfo,
  }).populate("skelbimai user");

  if (!gautiDarbdavi) {
    return next(
      new AppError(`Su šiuo id: ${req.params.id} darbdavio nėra`, 404)
    );
  }
  res.status(201).json({
    status: "success",
    gautiDarbdavi,
  });
});

exports.gautiDarbdavi = catchAsync(async (req, res, next) => {
  const gautiDarbdavi = await Darbdavio.findById(req.params.id).populate(
    "skelbimai"
  );
  if (!gautiDarbdavi) {
    return next(new AppError("Darbdavio su tokiu id nėra", 404));
  }
  res.status(201).json({
    status: "success",
    darbdavys: gautiDarbdavi,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateDarbdavi = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(`You can change password here: ${"/updatePassword"}`, 400)
    );
  }
  const filteredBody = filterObj(
    req.body,
    "imonesPav",
    "imonesKodas",
    "kontaktinisAsmuo"
  );

  const findUser = await Darbdavio.findOne({ user: req.user.id });
  console.log(findUser);
  const updatedUser = await Darbdavio.findByIdAndUpdate(
    findUser,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});
