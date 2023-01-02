import db from "./dbconfig.js";
import express from "express";
var router = express.Router();
router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "select * from user where email=? and password=?",
    [email, password],
    (err, result) => {
      if (err) res.send({ err: err });
      if (result.length > 0) res.send(result);
      else {
        res.send({ msg: "Invalid Admin Login !" });
      }
    }
  );
});

export default router;
