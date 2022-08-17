const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  // console.log(err.name, err.message);
  // console.log("UNCAUGHT EXCEPTION, Shutting down");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE;

mongoose.connect(DB, {}).then(() => {
  console.log("DB connected");
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,

    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log("DB connected");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // console.log(`Server is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION, Shutting down");
  server.close(() => {
    process.exit(1);
  });
});
