import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/seats.css";

const DrawGrid = (props) => {
  const { seats, seatAvialable, seatReserved, setSeatAvailable, setSeatReserved, seatBooked, max } = props;

  const onClickData = (seat) => {
    if (seatBooked.indexOf(seat) > -1) {
      console.log("already Booked");
    } else if (seatReserved.indexOf(seat) > -1) {
      setSeatAvailable([...seatAvialable, seat]);
      setSeatReserved(seatReserved.filter((res) => res != seat));
    } else if (seatReserved.length < max) {
      setSeatReserved([...seatReserved, seat]);
      setSeatAvailable(seatAvialable.filter((res) => res != seat));
    } else {
    }
  };

  const onClickSeat = (seat) => {
    onClickData(seat);
  };
  return (
    <div className="container">
      <div className="row col-12 col-md-8 grid">
        {seats.map((row) => {
          return (
            <div
              className={seatBooked.indexOf(row) > -1 ? "booked  col-2 " : seatReserved.indexOf(row) > -1 ? "reserved col-2" : "available col-2"}
              key={row}
              onClick={(e) => onClickSeat(row)}
            >
              <div className="mb-3 seat card">{row}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DrawGrid;
