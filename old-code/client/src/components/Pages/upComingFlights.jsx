import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ShowTable from "./showTable";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { toast } from "react-toastify";
import NavBar from "./navbar";
import { useParams } from "react-router-dom";
import FlightGrid from "./flightGrid";
const date = new Date();
const futureDate = date.getDate();
date.setDate(futureDate);
const currentDate = date.toLocaleDateString("en-CA");

function UpComingFlights() {
  const [departDate, setDepartDate] = useState(currentDate);
  const [flights, setflights] = useState([]);
  const [origins, setOrigins] = useState();
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [user, setUser] = useState({ user_id: null });
  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/flight/origins`).then((response) => {
      const { data } = response;
      setOrigins(data);
    });

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser[0]);
    }
  }, []);

  if (!origins) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const showFlights = () => {
    const origin = newOrigin.slice(0, 3);
    const destination = newDestination.slice(0, 3);
    const flightInfo = { origin: origin, destination: destination, departDate: departDate };
    Axios.post(`${process.env.REACT_APP_API_URL}/flight/upComingFlights`, flightInfo).then((response) => {
      if (response.data.length == 0) {
        toast.warn("Sorry, No Flights available", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setflights(response.data);
    });
  };

  return (
    <>
      <Container className="rounded rounded-5   border bg-light text-dark border-secondary  my-5">
        <Row>
          <Form.Group as={Col} md={4} sm={6} controlId="formGridState">
            <Form.Label>From</Form.Label>
            <Form.Select onChange={(e) => setNewOrigin(e.target.value)} value={newOrigin}>
              <option>Choose...</option>
              {origins.map((from) => {
                const { origin } = from;
                return (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={4} sm={6} controlId="formGridState">
            <Form.Label>To</Form.Label>
            <Form.Select onChange={(e) => setNewDestination(e.target.value)} value={newDestination}>
              <option>Choose...</option>
              {origins.map((from) => {
                const { origin } = from;
                return (
                  <option key={origin} value={origin}>
                    {origin}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md={4} sm={12} controlId="formGridState">
            <Form.Label>Depart</Form.Label>
            <Form.Control type="date" name="datepic" placeholder="DatzeRange" value={departDate} onChange={(e) => setDepartDate(e.target.value)} />
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Button variant="primary" onClick={showFlights}>
            Show Flights
          </Button>
        </Row>
      </Container>
      {flights.length !== 0 && <ShowTable flights={flights} userid={user.user_id} />}
    </>
  );
}

export default UpComingFlights;
