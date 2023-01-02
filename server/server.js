import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import login from "./login.js";
import signup from "./signup.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/login", login);
app.use("/signup", signup);
app.listen(4000, () => {
  console.log("Server is running on port 4000!");
});
