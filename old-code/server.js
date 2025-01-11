import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import login from "./login.js";
import signup from "./signup.js";
import booking from "./booking.js";
import flights from "./flights.js";
import admin from "./admin.js";
import report from "./reports.js";
import dotenv from "dotenv";
const app = express();
var offset = new Date().getTimezoneOffset();
var sign = offset < 0 ? "+" : "-";
var offsetInHours = Math.abs(offset / 60);
export var offsetWithColon = `${sign}${Math.floor(offsetInHours)}:${Math.abs(offset % 60)}`;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
app.use("/login", login);
app.use("/signup", signup);
app.use("/booking", booking);
app.use("/flight", flights);
app.use("/admin", admin);
app.use("/report", report);

app
  .listen(process.env.PORT || 4000, () => {
    console.log("Server is running on port 4000!");
  })
  .on("error", console.log);
