import db from "./dbconfig.js";
import express from "express";
import util from "util";
var router = express.Router();

router.get("/flightDetails/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet =
    "select f.flight_id, f.origin, f.destination, DATE_FORMAT(f.departure_time , '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(f.arrival_time , '%Y-%m-%d | %h:%i %p') as arrival_time, f.economy_fare, f.business_fare, f.platinum_fare  from shedule f where flight_id=?";
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
    //     if (result.length > 0) {
    //       res.send(result);
    //     } else {
    //       res.send(result);
    //       // console.log(result);
    //     }
    else res.send(result);
  });
});

router.get("/seatCount/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "select s.economy_seatcapacity, s.business_seatcapacity,platinum_seatcapacity from seat_details s where flight_id=?";
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
    //     if (result.length > 0) {
    //       res.send(result);
    //     } else {
    //       res.send(result);
    //       // console.log(result);
    //     }
    else res.send(result);
  });
});

router.post("/seats", (req, res) => {
  const { type, id } = req.body;
  const sqlGet = "select seat_no from ticket where booking_id in (select booking_id from booking where flight_id =  ? and seat_class = ?)";
  db.query(sqlGet, [id, type], (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

router.post("/ticket", (req, res) => {
  const { ticketInfo, passengerIds, passengerSeats } = req.body;

  for (var i = 0; i < ticketInfo.noOfPassengers; i++) {
    const sqlInsert = "insert into ticket(seat_no, passenger_id, booking_id) values (?,?,?)";
    db.query(sqlInsert, [passengerSeats[i], passengerIds[i].passenger_id, ticketInfo.bookingID], (err, result) => {
      if (err) {
        console.log("error in ticket");
      } else {
        console.log("ticket entered   ");
      }
    });
  }
  res.send("1");
});

router.post("/passenger", (req, res) => {
  const { passengerName, passengerPassports, passengerDob, ticketInfo } = req.body;
  var passports = [];
  for (var i = 0; i < ticketInfo.noOfPassengers; i++) {
    passports.push(passengerPassports[i]);
    const sqlInsert = "insert into passengers(passenger_name, passport_number, dob ) values (?,?,?)";
    db.query(sqlInsert, [passengerName[i], passengerPassports[i], passengerDob[i]], (err, result) => {
      if (err) {
        console.log("passenger already entered");
      } else {
        console.log("passenger entered succss");
      }
    });
  }
  const x = passports.length;
  for (var i = 0; i < 5 - x; i++) {
    passports.push("0");
  }
  const sqlGet = "select passenger_id from passengers where passport_number in (?,?,?,?,?)";
  db.query(sqlGet, passports, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/discount/:id", (req, res) => {
  const { id } = req.params;
  const getDiscount = "select discount from user_types where user_type= ?";
  db.query(getDiscount, [id], (err, result) => {
    if (err) {
      console.log("error");
    } else {
      res.send(result);
    }
  });
});

router.post("/book", (req, res) => {
  const { ticketInfo } = req.body;
  console.log(ticketInfo);
  const amount = (ticketInfo.totalPrice * (100 - ticketInfo.discount)) / 100;
  const sqlInsert = "insert into booking(amount, user_id, flight_id, booked_date, status, count, seat_class) values (?,?,?,?,?,?,?)";
  db.query(
    sqlInsert,
    [amount, ticketInfo.user.user_id, ticketInfo.flight_id, ticketInfo.date, "unpaid", ticketInfo.noOfPassengers, ticketInfo.class],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("1");
      }
    }
  );
});

router.get("/bookingID/:id", (req, res) => {
  const { id } = req.params;
  const getBookingId = "select max(booking_id) as booking_id from booking where user_id= ?";
  db.query(getBookingId, [id], (err, result) => {
    if (err) {
      console.log("error");
    } else {
      res.send(result[0]);
    }
  });
});

router.get("/passenger/:id", (req, res) => {
  const { id } = req.params;

  const sqlGet = "select * from passengers where passport_number=?";
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("0");
    }
  });
});

export default router;
