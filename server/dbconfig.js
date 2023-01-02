import mysql from "mysql";
const db = mysql.createPool({
  host: "airlinesystem.ccetemk7f6vi.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "Itsme043",
  database: "airline_system",
});
export default db;
