import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import NavBar from "./navbar";
import { useParams } from "react-router-dom";
import DrawGrid from "./drawGrid";
import { currentDate } from "./searchFlights";

function Booking() {
  const platinum = [];
  const economy = [];
  const business = [];
  const [economyBooked, setEconomyBooked] = useState([]);
  const [platinumBooked, setPlatinumBooked] = useState([]);
  const [businessBooked, setBusinessBooked] = useState([]);
  for (var i = 1; i <= 30; i++) {
    platinum.push("" + i);
  }
  for (var i = 1; i <= 60; i++) {
    business.push("" + i);
  }
  for (var i = 1; i <= 120; i++) {
    economy.push("" + i);
  }
  const [passengerSeats, setPassengerSeats] = useState([]);
  const [passengerNames, setPassengerNames] = useState([]);
  const [passengerPassports, seetPassengerPassports] = useState([]);

  const [seatsPlatinum, setSeatsPlatinum] = useState(platinum);
  const [seatAvialablePlatinum, setSeatAvailablePlatinum] = useState(platinum);

  const [seatsBusiness, setSeatsBusiness] = useState(business);
  const [seatAvialableBusiness, setSeatAvailableBusiness] = useState(business);

  const [seatsEconomy, setSeatsEconomy] = useState(economy);
  const [seatAvialableEconomy, setSeatAvailableEconomy] = useState(economy);

  const [ticketIfo, setTicketInfo] = useState({
    bookedBy: "",
    class: "economy",
    totalPrice: 0,
    noOfPassengers: 1,
  });
  var options = [];
  const { id } = useParams();
  const [flightInfo, setFlightInfo] = useState([]);

  const handleChange = (event) => {
    if (event.target.name === "class") {
      if (event.target.value === "economy") {
        setTicketInfo({ ...ticketIfo, totalPrice: flightInfo.economy_fare, class: event.target.value });
      } else if (event.target.value === "business") {
        setTicketInfo({ ...ticketIfo, totalPrice: flightInfo.business_fare, class: event.target.value });
      } else {
        setTicketInfo({ ...ticketIfo, totalPrice: flightInfo.platinum_fare, class: event.target.value });
      }
    } else if (event.target.name === "passengerName") {
      setPassengerNames({ ...passengerNames, [event.target.id]: event.target.value });
    } else if (event.target.name === "passengerPassport") {
      seetPassengerPassports({ ...passengerPassports, [event.target.id]: event.target.value });
    } else {
      setTicketInfo({ ...ticketIfo, [event.target.name]: event.target.value });
    }
    console.log(passengerNames[0]);
  };

  const handleSubmit = (event) => {
    if (passengerSeats.length != ticketIfo.noOfPassengers) {
      event.preventDefault();
    } else {
      for (var i = 0; i < ticketIfo.noOfPassengers; i++) {
        Axios.post("http://localhost:4000/ticket", {
          flight_id: id,
          type: ticketIfo.class,
          passenger_name: passengerNames[i],
          booked_date: currentDate,
          booked_by: ticketIfo.bookedBy,
          seat_no: passengerSeats[i],
          passport_number: passengerPassports[i],
        }).then((response) => {
          if (response === "0") {
            alert("Unscusseful Registration");
          } else {
            alert("Success");
          }
        });
      }
    }
  };

  useEffect(() => {
    Axios.get(`http://localhost:4000/flightDetails/${id}`).then((response) => {
      setFlightInfo(response.data[0]);
      setTicketInfo({ ...ticketIfo, totalPrice: response.data[0].economy_fare });
    });
    Axios.post(`http://localhost:4000/seats`, { type: "Economy", id: id }).then((response) => {
      response.data.forEach((element) => {
        economyBooked.push(element.seat_no + "");
      });
    });
    Axios.post(`http://localhost:4000/seats`, { type: "Business", id: id }).then((response) => {
      response.data.forEach((element) => {
        businessBooked.push(element.seat_no + "");
      });
    });
    Axios.post(`http://localhost:4000/seats`, { type: "Platinum", id: id }).then((response) => {
      response.data.forEach((element) => {
        platinumBooked.push(element.seat_no + "");
      });
    });
  }, []);

  for (var i = 0; i < ticketIfo.noOfPassengers; i++) {
    options.push(
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Passenger Name
        </Form.Label>
        <Col sm="5">
          <Form.Control type="text" id={"" + i} placeholder="Full Name" name={"passengerName"} onChange={handleChange} required />
        </Col>
        <Col sm="5">
          <Form.Control type="text" id={"" + i} placeholder="Passport" name={"passengerPassport"} onChange={handleChange} required />
        </Col>
      </Form.Group>
    );
  }

  return (
    <>
      <NavBar />
      <Form onSubmit={handleSubmit}>
        <div className="container">
          <div className="row mt-3 justify-content-between">
            <div className="card col-8 mb-4">
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                <Form.Label column sm="2">
                  Full Name
                </Form.Label>
                <Col sm="10">
                  <Form.Control onChange={handleChange} name="bookedBy" type="text" placeholder="Full Name" required />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                  Class
                </Form.Label>
                <Col sm="10">
                  <Form.Select defaultValue="economy" name="class" onChange={handleChange} aria-label="Default select example" required>
                    {/* <option>Open this select menu</option> */}
                    <option value="platinum" required>
                      Platinum
                    </option>
                    <option value="business" required>
                      Business
                    </option>
                    <option value="economy" required>
                      Economy
                    </option>
                  </Form.Select>
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                  No of Passengers
                </Form.Label>
                <Col sm="10">
                  <Form.Select defaultValue="1" name="noOfPassengers" onChange={handleChange} aria-label="Default select example">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </Form.Select>
                </Col>
              </Form.Group>
              {options.map((option) => {
                return option;
              })}
            </div>

            <div className="card col-3 mb-4">
              <div className="card-header py-3">
                <h5 className="mb-1">Flight Details</h5>
                <h6 className="mx-2">
                  {flightInfo.origin} ---- {flightInfo.destination}
                </h6>
                <h6 className="mx-2"> {flightInfo.departure_time}</h6>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li key="list1" className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Platinum
                    <span>$ {flightInfo.platinum_fare}</span>
                  </li>
                  <li key="list2" className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Business
                    <span>$ {flightInfo.business_fare}</span>
                  </li>
                  <li key="list3" className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Economy
                    <span>$ {flightInfo.economy_fare}</span>
                  </li>
                  {/* <li key="5" className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Discount
                  <span>Gratis</span>
                </li> */}
                  <li key="list4" className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div>
                      <strong>Total amount</strong>
                      <strong>
                        <p className="mb-0">(including VAT)</p>
                      </strong>
                    </div>
                    <span>
                      <strong>$ {ticketIfo.totalPrice * ticketIfo.noOfPassengers}</strong>
                    </span>
                  </li>
                </ul>

                <button type="submit" className="btn btn-warning btn-lg btn-block">
                  Go to checkout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mb-3 card">
          {ticketIfo.class === "platinum" && (
            <div className="row text-center ">
              <h3 className="col-8">Platinum Class</h3>

              <DrawGrid
                seats={seatsPlatinum}
                seatAvialable={seatAvialablePlatinum}
                seatReserved={passengerSeats}
                setSeats={setSeatsPlatinum}
                setSeatAvailable={setSeatAvailablePlatinum}
                setSeatReserved={setPassengerSeats}
                seatBooked={platinumBooked}
                max={ticketIfo.noOfPassengers}
              />
            </div>
          )}
          {ticketIfo.class === "business" && (
            <div className="row text-center ">
              <h3 className="col-8">Business Class</h3>

              <DrawGrid
                seats={seatsBusiness}
                seatAvialable={seatAvialableBusiness}
                seatReserved={passengerSeats}
                setSeats={setSeatsBusiness}
                setSeatAvailable={setSeatAvailableBusiness}
                setSeatReserved={setPassengerSeats}
                seatBooked={businessBooked}
                max={ticketIfo.noOfPassengers}
              />
            </div>
          )}
          {ticketIfo.class === "economy" && (
            <div className="row text-center ">
              <h3 className="col-8">Economy</h3>

              <DrawGrid
                seats={seatsEconomy}
                seatAvialable={seatAvialableEconomy}
                seatReserved={passengerSeats}
                setSeats={setSeatsEconomy}
                setSeatAvailable={setSeatAvailableEconomy}
                setSeatReserved={setPassengerSeats}
                seatBooked={economyBooked}
                max={ticketIfo.noOfPassengers}
              />
            </div>
          )}
        </div>
      </Form>
    </>
  );
}

export default Booking;
