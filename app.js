const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");
const skelbimuRouter = require("./routes/skelbimuRoutes");
const userRouter = require("./routes/userRoutes");
const darbdavioRouter = require("./routes/darbdavioRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, `public`)));
app.use(helmet());
const scriptSrcUrls = [
  "https://api.tiles.mapbox.com/",
  "https://cdnjs.cloudflare.com/",
  "https://*.stripe.com/",
  "https://js.stripe.com/",
];
const styleSrcUrls = ["https://fonts.googleapis.com/"];
const connectSrcUrls = ["https://bundle.js:*", "ws://127.0.0.1:*/"];
const fontSrcUrls = ["fonts.googleapis.com", "fonts.gstatic.com"];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      frameSrc: ["'self'", "https://*.stripe.com"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:"],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

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
app.use(cookieParser());

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

app.use(compression());

// Test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log(req.cookies);
// });

app.use("/", viewRouter);
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
