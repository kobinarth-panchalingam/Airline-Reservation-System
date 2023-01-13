import db from "./dbconfig.js";
import express from "express";
var router = express.Router();

//signup
router.post("/passengerCount", (req, res) => {
  const { destination, startDate, endDate } = req.body;
  const sqlGet = "call passenger_count(?,?,?)";
  db.query(sqlGet, [destination, startDate, endDate], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.post("/bookingCount", (req, res) => {
  const { startDate, endDate } = req.body;
  const sqlGet = "call booking_count(?,?)";
  db.query(sqlGet, [startDate, endDate], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/totalRevenue", (req, res) => {
  const sqlGet = "call total_revenue()";
  db.query(sqlGet, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

router.post("/pastFlights", (req, res) => {
  const { origin, destination } = req.body;
  const sqlGet = "call past_flights(?,?)";
  db.query(sqlGet, [origin, destination], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

router.post("/passengerByAge", (req, res) => {
  const { flight_no } = req.body;
  const sqlGet = "call passenger_agewise(?)";
  db.query(sqlGet, [flight_no], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

export default router;
