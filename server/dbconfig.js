import mysql from "mysql";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

//create connection

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync("DigiCertGlobalRootCA.crt.pem"),
  },
});

//connect
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("database connected successfully!!!!!");
  }
});

export default db;
