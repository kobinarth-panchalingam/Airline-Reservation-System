import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import login from "./login.js";
import signup from "./signup.js";
const app = express();
import db from "./dbconfig.js";
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/login", login);
app.use("/signup", signup);

app.get("/origins", (req, res) => {
  const sqlGet = "select concat( airport.airport_code,' | ', airport.city) as origin from airport";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

app.get("/flights", (req, res) => {
  const sqlGet =
    "select f.flight_id, f.airplane_id, f.origin, f.destination, DATE_FORMAT(f.departure_time , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(f.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time, f.flight_time, f.economy_fare, f.business_fare, f.platinum_fare from flight f order by f.flight_id";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

app.get("/flightDetails/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet =
    "select f.flight_id, f.origin, f.destination, DATE_FORMAT(f.departure_time , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(f.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time, f.economy_fare, f.business_fare, f.platinum_fare  from flight f where flight_id=?";
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send(result);
      // console.log(result);
    }
  });
});

app.post("/seats", (req, res) => {
  const { type, id } = req.body;
  const sqlGet = "select seat_no from ticket where class=? and flight_id=?";
  db.query(sqlGet, [type, id], (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

app.post("/ticket", (req, res) => {
  const { flight_id, type, passenger_name, booked_date, seat_no, booked_by, passport_number } = req.body;
  const sqlInsert = "insert into ticket(flight_id, class, passenger_name, booked_date, seat_no, booked_by, passport_number) values (?,?,?,?,?,?,?)";
  db.query(sqlInsert, [flight_id, type, passenger_name, booked_date, seat_no, booked_by, passport_number], (err, result) => {
    if (err) {
      res.send("0");
      console.log(err);
    } else {
      res.send("1");
    }
  });
});

app.post("/viewFlights", (req, res) => {
  const { origin, destination, departDate, returnDate } = req.body;
  const sqlGet =
    "select f.flight_id, f.origin, f.destination,  DATE_FORMAT(f.departure_time , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(f.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time    from flight f where origin=? and destination=? and departure_time >= ? and arrival_time <= ?";
  db.query(sqlGet, [origin, destination, departDate, returnDate], (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send(result);
      // console.log(result);
    }
  });
});

app.post("/upComingFlights", (req, res) => {
  var { origin, destination, departDate } = req.body;
  departDate = departDate + "%";
  const sqlGet =
    "select f.flight_id, f.origin, f.destination,  DATE_FORMAT(f.departure_time , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(f.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time    from flight f where origin=? and destination=? and departure_time like ?";
  db.query(sqlGet, [origin, destination, departDate], (err, result) => {
    if (err) res.send({ err: err });
    console.log(result);
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send(result);
    }
  });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000!");
});
