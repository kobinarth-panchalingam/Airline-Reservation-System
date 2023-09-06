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
import { v4 as uuid } from "uuid";
function Reports() {
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [passengerCount, setPassengerCount] = useState(0);
  const [bookingCount, setBookingCount] = useState([]);
  const [pastFlights, setPastFlights] = useState([]);
  const [passengerByAge, setPassengerByAge] = useState([]);
  const date = new Date();
  const futureDate = date.getDate();
  date.setDate(futureDate);
  const defaultValue = date.toLocaleDateString("en-CA");
  const [departDate, setDepartDate] = useState(defaultValue);
  const [routes, setRoutes] = useState([]);
  const [returnDate, setReturnDate] = useState(defaultValue);
  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState("");
  const [newDestination, setNewDestination] = useState("");
  const [flightNo, setFlightNo] = useState("");

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_API_URL}/report/totalRevenue`).then((response) => {
      setTotalRevenue(response.data[0]);
    });

    Axios.get(`${process.env.REACT_APP_API_URL}/flight/origins`).then((response) => {
      setOrigins(response.data);
    });
    Axios.get(`${process.env.REACT_APP_API_URL}/flight/routes`).then((response) => {
      setRoutes(response.data);
    });
  }, []);

  const handlePassengerCount = (event) => {
    event.preventDefault();
    Axios.post(`${process.env.REACT_APP_API_URL}/report/passengerCount`, {
      destination: newDestination.slice(0, 3),
      startDate: departDate,
      endDate: returnDate,
    }).then((response) => {
      setPassengerCount(response.data[0][0].passenger_count);
    });
  };

  const handleBookingCount = (event) => {
    event.preventDefault();
    Axios.post(`${process.env.REACT_APP_API_URL}/report/bookingCount`, {
      destination: newDestination.slice(0, 3),
      startDate: departDate,
      endDate: returnDate,
    }).then((response) => {
      setBookingCount(response.data[0]);
    });
  };

  const handlePastFlights = (event) => {
    event.preventDefault();
    Axios.post(`${process.env.REACT_APP_API_URL}/report/pastFlights`, {
      origin: newOrigin.slice(0, 3),
      destination: newDestination.slice(0, 3),
    }).then((response) => {
      setPastFlights(response.data[0]);
    });
  };

  const handlePassengerbyAge = (event) => {
    event.preventDefault();
    Axios.post(`${process.env.REACT_APP_API_URL}/report/passengerByAge`, {
      flight_no: flightNo,
    }).then((response) => {
      setPassengerByAge(response.data[0]);
    });
  };

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
                {totalRevenue.map((row) => {
                  const { model_name, variant, total_revenue } = row;
                  return (
                    <tr key={model_name}>
                      <td className="text-center">{model_name}</td>
                      <td className="text-center">{variant}</td>
                      <td className="text-center">$ {total_revenue}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row">
            <Form className="col-6" onSubmit={handlePassengerCount}>
              <div className="mb-4 p-2 card border border-2">
                <h2 className="text-center">Passenger Count</h2>
                <Row>
                  <Form.Group controlId="formGridState">
                    <Form.Label column sm="8">
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
                    <Form.Control
                      type="date"
                      name="datepic"
                      placeholder="DateRange"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </Form.Group>

                  <div className="container">
                    <div className="row my-2 gx-2 mx-1">
                      <h3 className="col-lg-6 col-md-12 border border-2 bg-primary text-center text-white">Passenger Count</h3>
                      <h3 className="col-lg-6 col-md-12 border border-2 bg-primary text-center text-white">{passengerCount}</h3>
                    </div>
                    <Form.Group className="mt-3 text-center">
                      <Button type="submit">Count</Button>
                    </Form.Group>
                  </div>
                </Row>
              </div>
            </Form>

            <Form className="col-6" onSubmit={handleBookingCount}>
              <div className="mb-4 p-2 card border border-2">
                <h2 className="text-center">Booking Count</h2>
                <Row className="mb-3">
                  <h6>No of booking by each customer type</h6>
                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>From</Form.Label>
                    <Form.Control
                      type="date"
                      name="datepic"
                      placeholder="DatzeRange"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridState">
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      type="date"
                      name="datepic"
                      placeholder="DateRange"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </Form.Group>
                  <div className="container">
                    {bookingCount.map((row) => {
                      const { user_type, booking_count } = row;
                      return (
                        <div key={user_type} className="row my-2 gx-2 m-1">
                          <h3 className="col-lg-6 col-md-12 border border-2 bg-primary text-center text-white">{user_type}</h3>
                          <h3 className="col-lg-6 col-md-12 border border-2 bg-primary text-center text-white">{booking_count}</h3>
                        </div>
                      );
                    })}

                    <Form.Group className="mt-3 text-center">
                      <Button type="submit">Count</Button>
                    </Form.Group>
                  </div>
                </Row>
              </div>
            </Form>
          </div>
          {/* <div className="row"> */}
          <Form className="col" onSubmit={handlePastFlights}>
            <div className="mb-4 p-2 card border border-2">
              <h2 className="text-center">Past Flight Report</h2>
              <Row className="">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label column sm="6">
                    Passengers travelling from
                  </Form.Label>
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
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label column sm="6">
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
              </Row>
              <table className="table table-ligh table-striped table-sm  table-hover">
                <thead className=" table-light">
                  <tr>
                    <th className="text-center">flight_id</th>
                    <th className="text-center">airplane_id</th>
                    <th className="text-center">flight_no</th>
                    <th className="text-center">passenger_count</th>
                  </tr>
                </thead>
                <tbody>
                  {pastFlights.map((row) => {
                    const { flight_id, airplane_id, flight_no, passenger_count } = row;
                    return (
                      <tr key={flight_id}>
                        <td className="text-center">{flight_id}</td>
                        <td className="text-center">{airplane_id}</td>
                        <td className="text-center">{flight_no}</td>
                        <td className="text-center">{passenger_count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Form.Group className="mt-3 text-center">
                <Button type="submit">Count</Button>
              </Form.Group>
            </div>
          </Form>
          {/* </div> */}

          {/* <div className="row"> */}
          <Form className="col" onSubmit={handlePassengerbyAge}>
            <div className="mb-4 p-2 card border border-2">
              <h2 className="text-center">Passenger Details by age</h2>
              <Row className="">
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label column sm="6">
                    Select flight no
                  </Form.Label>
                  <Form.Select onChange={(e) => setFlightNo(e.target.value)} value={flightNo}>
                    <option>Choose...</option>
                    {routes.map((from) => {
                      const { route_id, route } = from;
                      return (
                        <option key={route_id} value={route_id}>
                          {route}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Row>
              <table className="table table-ligh table-striped table-sm  table-hover">
                <thead className=" table-light">
                  <tr>
                    <th className="text-center">passenger_name</th>
                    <th className="text-center">passport_number</th>
                    <th className="text-center">age</th>
                  </tr>
                </thead>
                <tbody>
                  {passengerByAge.map((row) => {
                    const unique_id = uuid();
                    const small_id = unique_id.slice(0, 8);
                    const { passenger_name, passport_number, age } = row;
                    return (
                      <tr key={small_id}>
                        <td className="text-center">{passenger_name}</td>
                        <td className="text-center">{passport_number}</td>
                        <td className="text-center">{age}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Form.Group className="mt-3 text-center">
                <Button type="submit">Count</Button>
              </Form.Group>
            </div>
          </Form>
          {/* </div> */}
        </div>
        <Footer />
      </>
    )
  );
}

export default Reports;
