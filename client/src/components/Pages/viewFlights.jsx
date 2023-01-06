import React, { useState, useEffect } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/viewFlights.css";
import NavBar from "./navbar";
import ShowTable from "./showTable";
import axios from "axios";
import auth from "../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { Toaster, Position } from "@blueprintjs/core";

function ViewFlights() {
  const [flights, setflights] = useState([]);
  const [status, setStatus] = useState(1);
  const navigate = useNavigate();
  const AppToaster = Toaster.create({
    position: Position.TOP,
  });
  const handleBookMe = (id) => {
    navigate("/booking/" + id);
    console.log("/booking/" + id);
  };

  const handleAction = (flight_id) => {
    console.log(status);
    axios.put(`http://localhost:4000/flight/update/${flight_id}`, { status: status }).then((response) => {
      AppToaster.show({
        message: "Data updated successfully",
        intent: "success",
        timeout: 3000,
      });
    });
  };
  useEffect(() => {
    Axios.get("http://localhost:4000/flights").then((response) => {
      const { data } = response;
      setflights(data);
    });
  }, []);

  return (
    auth.isAuthenticated() && (
      <>
        <NavBar />
        <div className="mb-5" />
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
                    <td className="text-center">{flight_id}</td>
                    <td className="text-center">{origin}</td>
                    <td className="text-center">{destination}</td>
                    <td className="text-center">{departure_time}</td>
                    <td className="text-center">{arrival_time}</td>
                    <td className="text-center">
                      <Form>
                        <Form.Select onChange={(e) => setStatus(e.target.value)}>
                          <option value={1}>Sheduled</option>
                          <option value={2}>Delayed</option>
                          <option value={3}>Departed</option>
                          <option value={4}>In Air</option>
                          <option value={5}>Diverted</option>
                          <option value={6}>Cancelled</option>
                        </Form.Select>

                        <button
                          type="button"
                          className="btn btn-danger mt-2"
                          onClick={() => {
                            handleAction(flight_id);
                          }}
                        >
                          CHANGE
                        </button>
                      </Form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    )
  );
}

export default ViewFlights;
