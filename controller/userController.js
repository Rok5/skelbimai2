const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Darbdavio = require("../models/darbdavioModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.visiUseriai = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;

  res.status(201).json({
    status: "success",
    Vartotojai: doc,
  });
});

// exports.updateMe = catchAsync(async (req, res, next) => {
//   // 1) Sukurti error, jei useris postina password ar passwordConfrim

//   if (req.body.password || req.body.passwordConfirm) {
//     return next(
//       new AppError(
//         "Ši skilts neskirta slaptažodžio atnaujinimui, prašome naudotis: /updatePassword",
//         400
//       )
//     );
//   }

//   // 2) Updatinti userio dokumenta
//   // if req.user.role = ieskau darbo
//   const filteredBody = filterObj(req.body, "logInName", "email");
//   const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
//     new: true,
//     runValidators: true,
//   });

//   // if req.user.role = siulau darba updatinti daugiau lauku

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(`You can change password here: ${"/updatePassword"}`, 400)
    );
  }
  const filteredBody = filterObj(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
