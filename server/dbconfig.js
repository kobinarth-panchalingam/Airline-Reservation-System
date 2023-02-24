import mysql from "mysql";
const db = mysql.createPool({
  host: "bwrpq0dqxituxdarkkfx-mysql.services.clever-cloud.com",
  user: "uohkxrmqex9ejwtv",
  password: "9WFiZPlvWpZFeOCTLiOZ",
  database: "bwrpq0dqxituxdarkkfx",
  port: "20140",
});

export default db;
