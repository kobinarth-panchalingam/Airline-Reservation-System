import db from "./dbconfig.js";
import express from "express";
import { offsetWithColon } from "./server.js";
var router = express.Router();

// to get all available airports
router.get("/origins", (req, res) => {
  const sqlGet = "select concat( airport.airport_code,' | ', airport.city) as origin from airport";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

//to get all available routes
router.get("/routes", (req, res) => {
  const sqlGet = "select route.route_id, concat( route.route_id,' | ', route.origin, ' - ', route.destination) as route from route order by route_id";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

// //
// router.get("/flights", (req, res) => {
//   const sqlGet =
//     "select s.flight_id, s.airplane_id, s.origin, s.destination, DATE_FORMAT(s.departure_time , '%Y-%m-%d | %h:%i:%p') as departure_time, DATE_FORMAT(s.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time, s.economy_fare, s.business_fare, s.platinum_fare, s.status from shedule s order by s.flight_id";
//   db.query(sqlGet, (err, result) => {
//     if (err) res.send({ err: err });
//     else res.send(result);
//   });
// });

//geting upcoming 6 flight details in user time zone
router.get("/getFlights", (req, res) => {
  const sqlGet = `SELECT s.flight_id, s.origin, s.destination, s.economy_fare, concat(date_format(CONVERT_TZ(s.departure_time,'+00:00','${offsetWithColon}'), '%h:%i %p'), ' - ', date_format(CONVERT_TZ(s.arrival_time,'+00:00','${offsetWithColon}'), '%h:%i %p')) as time, concat(date_format(CONVERT_TZ(s.departure_time,'+00:00','${offsetWithColon}'), '%a %b %D %Y'),' - ', date_format(CONVERT_TZ(s.arrival_time,'+00:00','${offsetWithColon}'), '%a %b %D %Y')) as date, s.image_url, duration(s.departure_time, s.arrival_time) as flight_time from shedule s where s.departure_time > now() and s.status='Scheduled' order by s.departure_time limit 6`;
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

//searching all flights available in between two dates
router.post("/viewFlights", (req, res) => {
  const { origin, destination, departDate, returnDate } = req.body;
  const sqlGet = `select s.flight_id, s.origin, s.destination,  DATE_FORMAT(CONVERT_TZ(s.departure_time,'+00:00','${offsetWithColon}') , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(CONVERT_TZ(s.arrival_time,'+00:00','${offsetWithColon}') , '%Y-%m-%d | %h:%i %p') as arrival_time  from shedule s where origin=? and destination=? and departure_time >= ? and arrival_time <= ?`;
  db.query(sqlGet, [origin, destination, departDate, returnDate], (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send(result);
    }
  });
});

//searching the flights available on a specific date
router.post("/upComingFlights", (req, res) => {
  var { origin, destination, departDate } = req.body;
  departDate = departDate + "%";
  const sqlGet = `select s.flight_id, s.origin, s.destination,  DATE_FORMAT(CONVERT_TZ(s.departure_time,'+00:00','${offsetWithColon}') , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(CONVERT_TZ(s.arrival_time,'+00:00','${offsetWithColon}') , '%Y-%m-%d | %h:%i %p') as arrival_time  from shedule s where origin=? and destination=? and departure_time like ?`;
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

export default router;
