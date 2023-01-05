import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/seats.css";
import DrawGrid from "./drawGrid";
function Test() {
  const [seats, setSeats] = useState(["a", "b", "c", "d", "a", "b", "c", "d", "a", "b", "c", "d"]);
  const [seatAvialable, setSeatAvailable] = useState(["a", "b", "c", "d"]);
  const [seatReserved, setSeatReserved] = useState(["a"]);

  //   useEffect(() => {
  //     Axios.get("http://localhost:4000/origins").then((response) => {
  //       const { data } = response;
  //       setOrigins(data);
  //       console.log(data.result);
  //     });
  //   }, []);
  return (
    <>
      <DrawGrid
        seats={seats}
        seatAvialable={seatAvialable}
        seatReserved={seatReserved}
        setSeats={setSeats}
        setSeatAvailable={setSeatAvailable}
        setSeatReserved={setSeatReserved}
      />
    </>
  );
}

export default Test;
