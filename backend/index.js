const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbCOnnect = require("./config/db");
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const setupEventNotifications = require("./utils/scheduleNotification");

const app = express();

const PORT = process.env.PORT;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/event", eventRouter);
app.listen(PORT, () => {
  console.log("listening..");
  dbCOnnect();
});

setupEventNotifications()