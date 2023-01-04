import React, { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "bootstrap/dist/css/bootstrap.css";
import "../styles/viewFlights.css";
function ShowTable({ flights }) {
  return (
    <div className="container table-responsive">
      <table className="table  table-bordered table-striped table-hover">
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ShowTable;
