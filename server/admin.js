import db from "./dbconfig.js";
import express from "express";
var router = express.Router();
//to get flight details in UTC time
router.get("/flights", (req, res) => {
  const sqlGet =
    "select s.flight_id, s.airplane_id, s.origin, s.destination, DATE_FORMAT(s.departure_time , '%Y-%m-%d %k:%i:%s') as departure_time, DATE_FORMAT(s.arrival_time , '%Y-%m-%d %k:%i:%s') as arrival_time, s.economy_fare, s.business_fare, s.platinum_fare, s.status from shedule s order by s.flight_id";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

//to update flight status
router.put("/flightStatus/update/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sqlUpdate = "update flights set flightstatus_id=? where flight_id=?";
  db.query(sqlUpdate, [status, id], (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

//to update departure time
router.put("/departureTime/update/:id", (req, res) => {
  const { id } = req.params;
  const { departure_time } = req.body;
  const sqlUpdate = "update flights set departure_time=? where flight_id=?";
  db.query(sqlUpdate, [departure_time, id], (err, result) => {
    if (err) res.send("0");
    else res.send("1");
  });
});

//to update arrival time
router.put("/arrivalTime/update/:id", (req, res) => {
  const { id } = req.params;
  const { arrival_time } = req.body;
  const sqlUpdate = "update flights set arrival_time=? where flight_id=?";
  db.query(sqlUpdate, [arrival_time, id], (err, result) => {
    if (err) res.send("0");
    else res.send("1");
  });
});
export default router;
