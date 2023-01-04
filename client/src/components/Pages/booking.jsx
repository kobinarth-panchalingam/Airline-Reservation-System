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

function Booking() {
  const [departDate, setDepartDate] = useState("");
  const [flights, setflights] = useState([]);
  const [returnDate, setReturnDate] = useState("");
  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:4000/origins").then((response) => {
      const { data } = response;
      setOrigins(data);
      console.log(data.result);
    });
  }, []);

  const showFlights = () => {
    const origin = newOrigin.slice(0, 3);
    const destination = newDestination.slice(0, 3);
    const flightInfo = { origin: origin, destination: destination, departDate: departDate, returnDate: returnDate };
    console.log([origin, destination, departDate, returnDate]);
    Axios.post("http://localhost:4000/viewFlights", flightInfo).then((response) => {
      console.log(response.data.length);
      setflights(response.data);
    });
  };

  return (
    <>
      <Container className="rounded rounded-5 border border-5 border-secondary  my-5">
        <Row>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>From</Form.Label>
            <Form.Select defaultValue="Choose..." onChange={(e) => setNewOrigin(e.target.value)} value={newOrigin}>
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
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>To</Form.Label>
            <Form.Select defaultValue="Choose..." onChange={(e) => setNewDestination(e.target.value)} value={newDestination}>
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
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Deapart</Form.Label>
            <Form.Control type="date" name="datepic" placeholder="DatzeRange" value={departDate} onChange={(e) => setDepartDate(e.target.value)} />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>Return</Form.Label>
            <Form.Control type="date" name="datepic" placeholder="DateRange" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Button variant="warning" onClick={showFlights}>
            Show Flights
          </Button>
        </Row>
      </Container>
      {flights.length === 0 ? (
        <Container>
          <Alert variant="warning"> No Flights Available</Alert>
        </Container>
      ) : (
        <ShowTable flights={flights} />
      )}
    </>
  );
}

export default Booking;
