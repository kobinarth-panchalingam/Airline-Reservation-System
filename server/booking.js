import db from "./dbconfig.js";
import express from "express";
var router = express.Router();
import { v4 as uuidv4 } from "uuid";
import { offsetWithColon } from "./server.js";

router.get("/flightDetails/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = `select f.flight_id, f.origin, f.destination, DATE_FORMAT(CONVERT_TZ(f.departure_time,'+00:00','${offsetWithColon}'), '%Y-%m-%d | %h:%i %p') as departure_time, DATE_FORMAT(CONVERT_TZ(f.arrival_time,'+00:00','${offsetWithColon}') , '%Y-%m-%d | %h:%i %p') as arrival_time, f.economy_fare, f.business_fare, f.platinum_fare  from shedule f where flight_id=?`;
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
    else res.send(result);
  });
});

router.get("/seatCount/:id", (req, res) => {
  const { id } = req.params;
  const sqlGet = "select s.economy_seatcapacity, s.business_seatcapacity,platinum_seatcapacity from seat_details s where flight_id=?";
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
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
  const { ticketInfo, passengerPassports, passengerSeats } = req.body;

  for (var i = 0; i < ticketInfo.noOfPassengers; i++) {
    const sqlInsert = "insert into ticket(seat_no, passport_number, booking_id) values (?,?,?)";
    db.query(sqlInsert, [passengerSeats[i], passengerPassports[i], ticketInfo.bookingID], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log("ticket entered   ");
      }
    });
  }
  res.send("1");
});

router.post("/passenger", (req, res) => {
  const { passengerName, passengerPassports, passengerDob, ticketInfo } = req.body;
  for (var i = 0; i < ticketInfo.noOfPassengers; i++) {
    const sqlInsert = "insert into passenger(passenger_name, passport_number, dob ) values (?,?,?)";
    db.query(sqlInsert, [passengerName[i], passengerPassports[i], passengerDob[i]], (err, result) => {
      if (err) {
        console.log("ALREADY ENTERED");
      } else {
        console.log("Success");
      }
    });
  }
  res.send("succesS");
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
  let uuid = uuidv4();
  const { ticketInfo, price, discount, user_id, id } = req.body;
  console.log(ticketInfo);
  const amount = (price * ticketInfo.noOfPassengers * (100 - discount)) / 100;
  var datetime = new Date().toISOString().slice(0, 19).replace("T", " "); //utc date
  console.log(datetime);
  const sqlInsert = "insert into booking(booking_id, amount, user_id, flight_id, booked_date, status, count, seat_class) values (?,?,?,?,?,?,?,?)";
  db.query(sqlInsert, [uuid, amount, user_id, id, datetime, "unpaid", ticketInfo.noOfPassengers, ticketInfo.class], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(uuid);
    }
  });
});

router.get("/passenger/:id", (req, res) => {
  const { id } = req.params;

  const sqlGet = "select * from passenger where passport_number=?";
  db.query(sqlGet, id, (err, result) => {
    if (err) res.send({ err: err });
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("0");
    }
  });
});

router.get("/bookingDetails/:id", (req, res) => {
  const { id } = req.params;
  const getBooking = `select b.booking_id, b.flight_id, b.seat_class, b.amount, DATE_FORMAT(CONVERT_TZ(b.booked_date,'+00:00','${offsetWithColon}') , '%Y-%m-%d | %h:%i:%p') as booked_date, t.ticket_id, t.seat_no, p.passenger_name, p.passport_number  from ticket t left join booking b on t.booking_id = b.booking_id left join passenger p on t.passport_number = p.passport_number  where b.booking_id=?`;
  console.log(id);
  db.query(getBooking, [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const sqlUpdate = "update booking set status=? where booking_id=?";
  db.query(sqlUpdate, ["paid", id], (err, result) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
});
export default router;
