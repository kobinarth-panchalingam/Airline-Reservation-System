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
  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [user, setUser] = useState({ user_id: null });
  useEffect(() => {
    Axios.get("https://bairways-backend.onrender.com/flight/origins").then((response) => {
      const { data } = response;
      setOrigins(data);
    });

    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser[0]);
    }
  }, []);

  console.log(user.user_id);
  const showFlights = () => {
    const origin = newOrigin.slice(0, 3);
    const destination = newDestination.slice(0, 3);
    const flightInfo = { origin: origin, destination: destination, departDate: departDate };
    console.log([origin, destination, departDate]);
    Axios.post("https://bairways-backend.onrender.com/flight/upComingFlights", flightInfo).then((response) => {
      console.log(response.data.length);
      setflights(response.data);
    });
  };

  return (
    <>
      <Container className="rounded rounded-5 bg-gradient bg-secondary border-secondary  my-5">
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
            <Form.Label>Deapart</Form.Label>
            <Form.Control type="date" name="datepic" placeholder="DatzeRange" value={departDate} onChange={(e) => setDepartDate(e.target.value)} />
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Button variant="primary" onClick={showFlights}>
            Show Flights
          </Button>
        </Row>
      </Container>
      {flights.length === 0 ? (
        <Container>
          <Alert variant="warning"> No Flights Available</Alert>
        </Container>
      ) : (
        <ShowTable flights={flights} userid={user.user_id} />
      )}
    </>
  );
}

export default UpComingFlights;
