const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const skelbimuRouter = require("./routes/skelbimuRoutes");
const userRouter = require("./routes/userRoutes");
const darbdavioRouter = require("./routes/darbdavioRoutes");

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100, // per valanda
  message: "Per daug užklausu iš to pačio ip, mėginkite už valandos",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" })); // body data gavimui

//Data sanitization against NoSQL query ijection
app.use(mongoSanitize());

// Data sanitization against against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whiteList: [""],
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/skelbimai", skelbimuRouter);
app.use("/api/v1/", darbdavioRouter);

app.all("*", (req, res, next) => {
  next(
    new AppError(
      `Prašome patikrinti ar jūsų įvestas url teisingas: ${req.originalUrl}`,
      404
    )
  );
});

app.use(globalErrorHandler);
module.exports = app;
