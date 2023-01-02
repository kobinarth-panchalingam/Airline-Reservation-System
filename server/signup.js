import db from "./dbconfig.js";
import express from "express";
var router = express.Router();

//signup
router.post("/", (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    gender,
    phoneNumber,
    dob,
    nic,
    discount,
  } = req.body;
  const sqlInsert =
    "insert into user(first_name, last_name, password, email, phone_number, gender, dob, NIC, discount) values (?,?,?,?,?,?,?,?,?)";
  db.query(
    sqlInsert,
    [
      firstName,
      lastName,
      password,
      email,
      phoneNumber,
      gender,
      dob,
      nic,
      discount,
    ],
    (err, result) => {
      if (err) res.send("registration unsuccessful!");
      else {
        res.send("registered successfully!");
      }
    }
  );
});

export default router;
