import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
// import "../styles/Booking.css";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import NavBar from "./navbar";
import { useParams } from "react-router-dom";
import Footer from "./footer";
import auth from "../utils/auth";
function Reports() {
  const date = new Date();
  const futureDate = date.getDate();
  date.setDate(futureDate);
  const defaultValue = date.toLocaleDateString("en-CA");
  const [departDate, setDepartDate] = useState(defaultValue);
  const [flights, setflights] = useState([]);
  const [returnDate, setReturnDate] = useState(defaultValue);
  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:4000/flight/origins").then((response) => {
      const { data } = response;
      setOrigins(data);
      console.log(data.result);
    });
  }, []);
  return (
    auth.isAuthenticated() && (
      <>
        <NavBar />
        <div className="container mt-5">
          <div className="row mb-4 card border border-2">
            <h2 className="text-center">Total Revenue by each model</h2>
            <table className="table table-ligh table-striped table-sm  table-hover">
              <thead className=" table-light">
                <tr>
                  <th className="text-center">Model Name</th>
                  <th className="text-center">Variant</th>
                  <th className="text-center">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">Boeing</td>
                  <td className="text-center">Max a0</td>
                  <td className="text-center">100</td>
                </tr>
                <tr>
                  <td className="text-center">Boeing</td>
                  <td className="text-center">Max a0</td>
                  <td className="text-center">100</td>
                </tr>
                <tr>
                  <td className="text-center">Boeing</td>
                  <td className="text-center">Max a0</td>
                  <td className="text-center">100</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="row mb-4 card border border-2">
            <h2 className="text-center">Passenger Count</h2>
            <Row className="mb-3">
              <Form.Group controlId="formGridState">
                <Form.Label column sm="2">
                  Passengers travelling to
                </Form.Label>
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
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Deapart</Form.Label>
                <Form.Control
                  type="date"
                  name="datepic"
                  placeholder="DatzeRange"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Return</Form.Label>
                <Form.Control type="date" name="datepic" placeholder="DateRange" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
              </Form.Group>
              <Form.Group className="mt-3 text-center">
                <Button>Count</Button>
              </Form.Group>
            </Row>
          </div>
          <div className="row mb-4 card border border-2">
            <h2 className="text-center">Booking Count</h2>
            <Row className="mb-3">
              <h6>No of booking by each customer type</h6>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Deapart</Form.Label>
                <Form.Control
                  type="date"
                  name="datepic"
                  placeholder="DatzeRange"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Return</Form.Label>
                <Form.Control type="date" name="datepic" placeholder="DateRange" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
              </Form.Group>
              <Form.Group className="mt-3 text-center">
                <Button>Count</Button>
              </Form.Group>
            </Row>
          </div>
        </div>
        <Footer />
      </>
    )
  );
}

export default Reports;
