import React, { useState, useEffect } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/viewFlights.css";
import NavBar from "./navbar";
import axios from "axios";
import auth from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Flip } from "react-toastify";
import { Button, EditableText, InputGroup, Toaster, Position } from "@blueprintjs/core";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";

function ViewFlights() {
  const [flights, setflights] = useState([]);
  const [status, setStatus] = useState(1);
  const [change, setChange] = useState(0);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/admin/flights`).then((response) => {
      setflights(response.data);
    });
  }, [change]);

  const handleAction = (flight_id) => {
    axios.put(`${process.env.REACT_APP_API_URL}/admin/flightStatus/update/${flight_id}`, { status: status }).then((response) => {
      toast.success("flight status changed");
      setChange(change + 1);
    });
  };

  const handleDeparture = (flight_id, event) => {
    axios.put(`${process.env.REACT_APP_API_URL}/admin/departureTime/update/${flight_id}`, { departure_time: event.value }).then((response) => {
      if (response.data == "1") {
        toast.success("departure time changed");
      }
      setChange(change + 1);
    });
  };

  const handleArival = (flight_id, event) => {
    axios.put(`${process.env.REACT_APP_API_URL}/admin/arrivalTime/update/${flight_id}`, { arrival_time: event.value }).then((response) => {
      if (response.data == "1") {
        toast.success("arrival time changed");
      }
      setChange(change + 1);
    });
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Flip}
      />
      <NavBar />
      <div className="mb-5" />
      <div className="container table-responsive">
        <table className="table  table-bordered table-striped table-hover">
          <thead className=" table-light">
            <tr>
              <th className="text-center">Flight ID</th>
              <th className="text-center">Origin</th>
              <th className="text-center">Destination</th>
              <th className="text-center">Departure Time - UTC</th>
              <th className="text-center">Arival Time - UTC</th>
              <th className="text-center">Status</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => {
              const { flight_id, origin, destination, departure_time, arrival_time, status } = flight;
              return (
                <tr key={flight_id}>
                  <td className="text-center">{flight_id}</td>
                  <td className="text-center">{origin}</td>
                  <td className="text-center">{destination}</td>

                  <td>
                    <EditText
                      name="departure_time"
                      defaultValue={departure_time}
                      style={{ fontSize: "16px" }}
                      onSave={(event) => {
                        handleDeparture(flight_id, event);
                      }}
                      placeholder="This is a uncontrolled component"
                      showEditButton
                    />
                  </td>
                  <td>
                    <EditText
                      name="departure_time"
                      defaultValue={arrival_time}
                      style={{ fontSize: "16px" }}
                      onSave={(event) => {
                        handleArival(flight_id, event);
                      }}
                      placeholder="This is a uncontrolled component"
                      showEditButton
                    />
                  </td>
                  <td className="text-center">{status}</td>
                  <td className="text-center">
                    <Form>
                      <Form.Select onChange={(e) => setStatus(e.target.value)}>
                        <option value={1}>Sheduled</option>
                        <option value={2}>Delayed</option>
                        <option value={3}>Departed</option>
                        <option value={4}>In Air</option>
                        <option value={5}>Landed</option>
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
  );
}

export default ViewFlights;
