import db from "./dbconfig.js";
import express from "express";
var router = express.Router();
import bcrypt from "bcrypt";

//to get admin details
router.get("/admin/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "select * from admin where username= ?";
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
    else {
      res.send(result);
    }
  });
});

// to ger user details
router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "select u.first_name, u.last_name, u.user_type, t.discount from registerd_users u left join user_types t on (u.user_type = t.user_type) where user_id=?",
    [id],
    (err, result) => {
      if (err) res.send({ err: err });
      else res.send(result);
    }
  );
});

//to validate user login
router.post("/user", (req, res) => {
  const { email, password } = req.body;
  db.query("select * from registerd_users where email=?", [email], (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password).then((matches) => {
        if (!matches) res.send({ msg: "Invalid user Login" });
        else res.send(result);
      });
    } else {
      res.send({ msg: "Invalid user Login" });
    }
  });
});

//to validate admin login
router.post("/admin", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("select * from admin where username=? and password=?", [email, password], (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      console.log(email, password);
      res.send(result);
    } else {
      res.send({ msg: "Invalid Admin Login" });
    }
  });
});

export default router;
