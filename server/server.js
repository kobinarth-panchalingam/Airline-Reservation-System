const express = require("express");
const app = express();
const mysql = require("mysql");

const db = mysql.createPool({
  host: "airlinesystem.ccetemk7f6vi.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Itsme043",
  database: "airline_system",
});

app.get("/", (req, res) => {
  const sqlGet = "select * from Airplane;";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

app.listen(5000);
