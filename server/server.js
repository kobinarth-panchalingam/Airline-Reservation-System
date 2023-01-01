const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createPool({
  host: "airlinesystem.ccetemk7f6vi.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Itsme043",
  database: "airline_system",
});

//signin
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "select * from user where email=? and password=?",
    [email, password],
    (err, result) => {
      if (err) res.send({ err: err });
      if (result.length > 0) res.send(result);
      else {
        res.send({ msg: "Invalid Admin Login" });
      }
    }
  );
});

//signup
app.post("/signup", (req, res) => {
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
      if (err) res.send({ err: err });
    }
  );
});

app.listen(4000, () => {
  console.log("Server is running on port 4000!");
});
