import db from "./dbconfig.js";
import express from "express";
var router = express.Router();
router.post("/user", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query("select * from registerd_users where email=? and password=?", [email, password], (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      console.log(email, password);
      res.send(result);
    } else {
      res.send({ msg: "Invalid user Login" });
    }
  });
});

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

router.get("/admin/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "select * from admin where username= ?";
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
    else {
      console.log(result);
      res.send(result);
    }
  });
});

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
export default router;
