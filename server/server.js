import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import login from "./login.js";
import signup from "./signup.js";
const app = express();
import db from "./dbconfig.js";
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/login", login);
app.use("/signup", signup);

app.get("/origins", (req, res) => {
  const sqlGet = "select concat( airport.airport_code,' | ', airport.city) as origin from airport";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000!");
});
