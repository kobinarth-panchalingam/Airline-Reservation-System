import db from "./dbconfig.js";
import express from "express";
var router = express.Router();

router.get("/origins", (req, res) => {
  const sqlGet = "select concat( airport.airport_code,' | ', airport.city) as origin from airport";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

router.get("/flights", (req, res) => {
  const sqlGet =
    "select s.flight_id, s.airplane_id, s.origin, s.destination, DATE_FORMAT(s.departure_time , '%Y-%m-%d | %h:%i:%p') as departure_time, DATE_FORMAT(s.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time, s.economy_fare, s.business_fare, s.platinum_fare from shedule s order by s.flight_id";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

router.post("/viewFlights", (req, res) => {
  const { origin, destination, departDate, returnDate } = req.body;
  const sqlGet =
    "select s.flight_id, s.origin, s.destination,  DATE_FORMAT(s.departure_time , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(s.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time  from shedule s where origin=? and destination=? and departure_time >= ? and arrival_time <= ?";
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

router.post("/upComingFlights", (req, res) => {
  var { origin, destination, departDate } = req.body;
  departDate = departDate + "%";
  const sqlGet =
    "select s.flight_id, s.origin, s.destination,  DATE_FORMAT(s.departure_time , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(s.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time  from shedule s where origin=? and destination=? and departure_time like ?";
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

router.put("/flightStatus/update/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sqlUpdate = "update flights set flightstatus_id=? where flight_id=?";
  db.query(sqlUpdate, [status, id], (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

router.get("/getFlights", (req, res) => {
  const sqlGet =
    "SELECT s.flight_id, s.origin, s.destination, s.economy_fare, concat(date_format(s.departure_time, '%h:%i %p'), ' - ', date_format(s.arrival_time, '%h:%i %p')) as time, concat(date_format(s.arrival_time, '%a %b %D %Y'),' - ', date_format(s.departure_time, '%a %b %D %Y')) as date, s.image_url from shedule s where s.departure_time > now() order by s.departure_time limit 6";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});
export default router;
