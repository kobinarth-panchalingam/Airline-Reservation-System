import db from "./dbconfig.js";
import express from "express";
var router = express.Router();

//to add a new user
router.post("/", (req, res) => {
  const { email, password, firstName, lastName, gender, phoneNumber, dob, nic } = req.body;
  const sqlInsert = "call insert_registered_user(?,?,?,?,?,?,?,?)";
  db.query(sqlInsert, [firstName, lastName, password, email, phoneNumber, gender, dob, nic], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send("1");
    }
  });
});

export default router;
