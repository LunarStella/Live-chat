const express = require("express");
const app = express();

const roomController = require("./controllers/roomController");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const roomRouter = require("./routes/roomRoutes");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config({ path: "./config.env" });

app.use("/chat", roomRouter);
app.get("/rooms", roomController.getAllRooms);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
