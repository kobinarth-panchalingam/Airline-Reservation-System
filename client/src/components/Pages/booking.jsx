import React, { useState, useEffect } from "react";
import Axios from "axios";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

function Booking() {
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");

  useEffect(() => {
    // axios.get("http://localhost:8001/").then((response) => {
    //   const { data } = response;
    //   setflights(data.result);
    //   console.log(data.result);
    // });

    Axios.get("http://localhost:4000/origins").then((response) => {
      const { data } = response;
      setOrigins(data);
      console.log(data.result);
    });
  }, []);

  return (
    <div className="container rounded rounded-5 border border-5 border-secondary my-5">
      <Row className="mb-3">
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
      <Row>
        <Button variant="warning">Show Flights</Button>{" "}
      </Row>
    </div>
  );
}

export default Booking;
