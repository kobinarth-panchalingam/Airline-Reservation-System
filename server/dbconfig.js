import mysql from "mysql";
// const db = mysql.createPool({
//   host: "babp2opux5u9tqxicgxw-mysql.services.clever-cloud.com",
//   user: "uohkxrmqex9ejwtv",
//   password: "9WFiZPlvWpZFeOCTLiOZ",
//   database: "babp2opux5u9tqxicgxw",
// });

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "airline_db",
});

export default db;
