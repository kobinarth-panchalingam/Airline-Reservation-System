import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/viewFlights.css";
import NavBar from "./navbar";
import ShowTable from "./showTable";
function ViewFlights() {
  const [flights, setflights] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:4000/flights").then((response) => {
      const { data } = response;
      setflights(data);
      console.log(data);
    });
  }, []);

  return (
    <>
      <NavBar />
      <div className="mb-5" />
      <ShowTable flights={flights} />
    </>
  );
}

export default ViewFlights;
