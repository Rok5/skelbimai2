const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const Skelbimai = require("../models/skelbimuModel");

const Darbdavio = require("../models/darbdavioModel");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 + 1000
    ),
    httpOnly: true,
  };
  if (req.secure || req.get("x-forwarded-proto") === "https")
    cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError("Prašome įvesti email ir slaptažodį", 400));
  }
 
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Neteisingas email arba slaptažodis", 401));
  }
  
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("Jūs esate neprisijungęs", 401));
  }
  
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
 

  const freshUser = await User.findById(decoded.id);
  
  if (!freshUser) {
    return next(new AppError("Vartotojas su tokiu token neegzistuoja", 401));
  }
  
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "Neseniai buvo pakeistas slaptažodis, prašome prisijungti iš naujo",
        401
      )
    );
  }
  req.user = freshUser;
  res.locals.user = freshUser;
  next();
});

exports.isLogedIn = async (req, res, next) => {
 
  if (req.cookies.jwt) {
    try {
      
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );


      const freshUser = await User.findById(decoded.id);

     
      if (!freshUser) {
        next();
      }
    
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // Loged in user
      res.locals.user = freshUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("Neturite leidimo šiam veiksmui", 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Su tokiu email vartotojo nėra", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resetPassword/${resetToken}`;
  const message = `Pamiršote slaptažodį? Paspauskite šia nuorodą ir susikurkite nauja: ${resetURL} \n Jei nepamiršote slaptažodžio, ignoruokite šį laišką`;
  try {
    await sendEmail({
      email: req.body.email,
      subject: "Slaptažodžio atkūrimas, galioja 10 min.",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "slpatažodžio atkūrimo nuoroda išsiųsta į email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    // console.log(err);
    return next(
      new AppError("Įvyko klaida siunčiant email, pabandykite vėliau", 500)
    );
  }
});

exports.resetPassowrd = catchAsync(async (req, res, next) => {

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
 
  if (!user) {
    return next(
      new AppError(
        "Netinkama nuoroda arba nuorodos galiojimo laikas pasibaigęs",
        400
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3. Update changedPasswordAt i now
  // 4. Priloginti useri, nusiusti JWT
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
 
  const user = await User.findById(req.user.id).select("password");
  
  if (
    !user ||
    !(await user.correctPassword(req.body.currentPassword, user.password))
  ) {
    return next(new AppError("Neteisingas slaptažodis"), 401);
  }
  
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  createSendToken(user, 200, req, res);
});

exports.protectDoc = catchAsync(async (req, res, next) => {
 
  const skelbimas = await Skelbimai.find({ _id: req.params.id });
  
  const userIdIsSkelbimo = skelbimas[0].user;


  if (userIdIsSkelbimo !== req.user.id) {
    return next(
      new AppError("Negalite atlikti veiksmų ne su savo skelbimu"),
      400
    );
  }
  next();
});
