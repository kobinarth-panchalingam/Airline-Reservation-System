import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "bootstrap/dist/css/bootstrap.css";
import "../styles/viewFlights.css";
import NavBar from "./navbar";
function ViewFlights() {
  const [flights, setflights] = useState([]);
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:4000/flights").then((response) => {
      const { data } = response;
      setflights(data);
      console.log(data);
    });

    // Axios.get("http://localhost:4000/origins").then((response) => {
    //   const { data } = response;
    //   setOrigins(data);
    //   console.log(data.result);
    // });
  }, []);

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <table className="table table-bordered table-striped table-hover">
          <thead className=" table-light">
            <tr>
              <th className="text-center">Flight ID</th>
              <th className="text-center">Origin</th>
              <th className="text-center">Destination</th>
              <th className="text-center">Departure Time</th>
              <th className="text-center">Arival Time</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => {
              const { flight_id, origin, destination, departure_time, arrival_time } = flight;
              return (
                <tr key={flight_id}>
                  <td>{flight_id}</td>
                  <td>{origin}</td>
                  <td>{destination}</td>
                  <td>{departure_time}</td>
                  <td>{arrival_time}</td>
                  <td className="text-center">
                    <button type="button" className="btn btn-danger">
                      BOOK ME
                    </button>
                  </td>
                  {/* <td>
                  <EditableText
                    value={departure_time}
                    onChange={(value) => onChangeHandler(flight_id, "address", value)}
                  />
                </td> */}
                  {/* <td>
                <Button intent="primary" onClick={() => updateAddress(departure_time)}>
                  Update
                </Button>
                &nbsp;
                <Button intent="danger" onClick={() => deleteflight(flight_id)}>
                  Delete
                </Button>
              </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ViewFlights;
