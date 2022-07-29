const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Neteisingas ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidatorError = (err) => {
  return new AppError(err.message, 400);
};

const handleDuplicateFields = (err) => {
  const keyVal = err.keyValue;
  const mess = keyVal[Object.keys(keyVal)];
  const message = `Duplikatas, prašome įrašyti kitą pavadinimą: ${mess}`;
  console.log(err.keyValue);
  return new AppError(message, 401);
};

const handleJsonWebTokenError = (err) => {
  return new AppError("Prašome prisijungti iš naujo", 401);
};
const handleTokenExpiredError = (err) => {
  return new AppError("Prašome prisijungti iš naujo", 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Įvyko nenumatyta klaida",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.name = err.name;
    error.message = err.message;
    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (err.name === "ValidationError") {
      error = handleValidatorError(error);
    }

    if (err.code === 11000) {
      error = handleDuplicateFields(error);
    }
    if (err.name === "JsonWebTokenError") {
      error = handleJsonWebTokenError(error);
    }
    if (err.name === "TokenExpiredError") {
      error = handleTokenExpiredError(error);
    }
    sendErrorProd(error, res);
  }
};
