import db from "./dbconfig.js";
import express from "express";
import bcrypt from "bcrypt";
var router = express.Router();

//to add a new user
router.post("/", (req, res) => {
  let { email, password, firstName, lastName, gender, phoneNumber, dob, nic } = req.body;
  //   IF LENGTH(val_password) < 8 THEN
  //   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must be at least 8 characters long.';
  // END IF;
  // IF NOT (val_password REGEXP '^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).*$') THEN
  //   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must contain at least one uppercase letter, one lowercase letter, and one digit.';
  // END IF;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      password = hash;
      const sqlInsert = "call insert_registered_user(?,?,?,?,?,?,?,?)";
      db.query(sqlInsert, [firstName, lastName, password, email, phoneNumber, gender, dob, nic], (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send("1");
        }
      });
    })
    .catch((err) => console.error(err.message));
});

export default router;
