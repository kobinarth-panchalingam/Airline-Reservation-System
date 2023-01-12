import db from "./dbconfig.js";
import express from "express";
var router = express.Router();

//signup
router.post("/", (req, res) => {
  const { email, password, firstName, lastName, gender, phoneNumber, dob, nic } = req.body;
  // const sqlInsert =
  //   "insert into registerd_users(first_name, last_name, password, email, phone_number, gender, dob, NIC, user_type) values (?,?,?,?,?,?,?,?,?)";
  const sqlInsert = "call insertRegisterdUser(?,?,?,?,?,?,?,?)";
  db.query(sqlInsert, [firstName, lastName, password, email, phoneNumber, gender, dob, nic], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("1");
    }
  });
});

router.get("/ports", (req, res) => {
  const sqlGet = "call select_airport('BIA')";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

export default router;
