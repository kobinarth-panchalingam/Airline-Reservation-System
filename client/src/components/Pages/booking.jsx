import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import NavBar from "./navbar";
import { useNavigate, useParams } from "react-router-dom";
import DrawGrid from "./drawGrid";
import { currentDate } from "./searchFlights";
import auth from "../utils/auth";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

function Booking() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(true);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const { id, userid } = useParams();
  const [seatInfo, setSeatInfo] = useState([]);
  const platinum = [];
  const economy = [];
  const business = [];
  const [passengerSeats, setPassengerSeats] = useState([]);
  const [passengerNames, setPassengerNames] = useState([]);
  const [passengerPassports, seetPassengerPassports] = useState([]);
  const [passengerDob, seetPassengerDob] = useState([]);
  const [passengerIds, setPassengerIds] = useState([]);

  const [seatAvialablePlatinum, setSeatAvailablePlatinum] = useState(platinum);
  const [seatAvialableBusiness, setSeatAvailableBusiness] = useState(business);
  const [seatAvialableEconomy, setSeatAvailableEconomy] = useState(economy);
  const [economyBooked, setEconomyBooked] = useState([]);
  const [platinumBooked, setPlatinumBooked] = useState([]);
  const [businessBooked, setBusinessBooked] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);

  const [ticketInfo, setTicketInfo] = useState({
    class: "economy",
    totalPrice: price,
    noOfPassengers: 1,
    flight_id: id,
    user: auth.userId,
    date: currentDate,
    discount: 0,
    bookingID: null,
  });
  const [flightInfo, setFlightInfo] = useState([]);
  useEffect(() => {
    console.log(userid);
    Axios.get(`http://localhost:4000/login/user/${userid}`).then((response) => {
      setDiscount(response.data[0].discount);
    });
    console.log(discount);
    //   // setSeatInfo(response.data[0]);
    //   setTicketInfo({ ...ticketInfo, discount: response.data[0].discount });
    //   console.log(ticketInfo);
    // });

    Axios.get(`http://localhost:4000/booking/flightDetails/${id}`).then((response) => {
      setFlightInfo(response.data[0]);
      setPrice(response.data[0].economy_fare);
      setTicketInfo({ ...ticketInfo, totalPrice: response.data[0].economy_fare });
    });
    Axios.get(`http://localhost:4000/booking/seatCount/${id}`).then((response) => {
      setSeatInfo(response.data[0]);
    });

    Axios.post(`http://localhost:4000/booking/seats`, { type: "economy", id: id }).then((response) => {
      response.data.forEach((element) => {
        economyBooked.push(element.seat_no + "");
      });
    });
    Axios.post(`http://localhost:4000/booking/seats`, { type: "business", id: id }).then((response) => {
      response.data.forEach((element) => {
        businessBooked.push(element.seat_no + "");
      });
    });
    Axios.post(`http://localhost:4000/booking/seats`, { type: "platinum", id: id }).then((response) => {
      response.data.forEach((element) => {
        platinumBooked.push(element.seat_no + "");
      });
    });
  }, []);

  for (var i = 1; i <= seatInfo.platinum_seatcapacity; i++) {
    platinum.push("" + i);
  }
  for (var i = 1; i <= seatInfo.business_seatcapacity; i++) {
    business.push("" + (i + seatInfo.platinum_seatcapacity));
  }
  for (var i = 1; i <= seatInfo.economy_seatcapacity; i++) {
    economy.push("" + (i + seatInfo.platinum_seatcapacity + seatInfo.business_seatcapacity));
  }

  var options = [];

  const handleChange = (event) => {
    if (event.target.name === "class") {
      if (event.target.value === "economy") {
        setPrice(flightInfo.economy_fare);
        setTicketInfo({ ...ticketInfo, totalPrice: flightInfo.economy_fare, class: event.target.value });
      } else if (event.target.value === "business") {
        setPrice(flightInfo.business_fare);
        setTicketInfo({ ...ticketInfo, totalPrice: flightInfo.business_fare, class: event.target.value });
      } else {
        setPrice(flightInfo.platinum_fare);
        setTicketInfo({ ...ticketInfo, totalPrice: flightInfo.platinum_fare, class: event.target.value });
      }
    } else if (event.target.name === "passengerName") {
      setPassengerNames({ ...passengerNames, [event.target.id]: event.target.value });
    } else if (event.target.name === "passengerPassport") {
      seetPassengerPassports({ ...passengerPassports, [event.target.id]: event.target.value });
    } else if (event.target.name === "passengerDob") {
      seetPassengerDob({ ...passengerDob, [event.target.id]: event.target.value });
    } else {
      setTicketInfo({ ...ticketInfo, [event.target.name]: event.target.value });
    }
  };

  for (var i = 0; i < ticketInfo.noOfPassengers; i++) {
    options.push(
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2">
          Passenger Name
        </Form.Label>

        <Col sm="4">
          <Form.Floating>
            <Form.Control type="text" id={"" + i} name={"passengerName"} onChange={handleChange} required />
            <label htmlFor={"" + i}>Full Name</label>
          </Form.Floating>
        </Col>
        <Col sm="3">
          <Form.Floating>
            <Form.Control type="text" id={"" + i} name={"passengerPassport"} onChange={handleChange} required />
            <label htmlFor={"" + i}>Passport</label>
          </Form.Floating>
        </Col>
        <Col sm="3">
          <Form.Floating>
            <Form.Control type="date" id={"" + i} placeholder="Date of Birth" name={"passengerDob"} onChange={handleChange} required />
            <label htmlFor={"" + i}>Date of Birth</label>
          </Form.Floating>
        </Col>
      </Form.Group>
    );
  }

  const handleSubmitPassengers = async (event) => {
    event.preventDefault();
    await savePassengers();
    setShow2(false);
  };
  const savePassengers = async () => {
    Axios.post("http://localhost:4000/booking/passenger", {
      ticketInfo: ticketInfo,
      passengerName: passengerNames,
      passengerPassports: passengerPassports,
      passengerDob: passengerDob,
    }).then((response) => {
      console.log("pId", response.data);
      setShow3(true);
    });

    Axios.post("http://localhost:4000/booking/book", {
      id: id,
      user_id: userid,
      price: price,
      discount: discount,
      ticketInfo: ticketInfo,
    }).then((response) => {
      console.log("b_id", response);
      setTicketInfo({ ...ticketInfo, bookingID: response.data });
      setShow4(true);
    });
  };

  // const fetchBooking = async () => {
  //   Axios.get("http://localhost:4000/booking/bookingID/" + userid).then((response) => {
  //     setTicketInfo({ ...ticketInfo, bookingID: response.data.booking_id });
  //     console.log("bookingId fetched",);
  //   });
  // };

  const handleCheckOut = () => {
    if (passengerSeats.length != ticketInfo.noOfPassengers) {
      setShow(true);
    } else {
      // Axios.get("http://localhost:4000/booking/bookingID/" + ticketInfo.user.user_id).then((response) => {
      //   setTicketInfo({ ...ticketInfo, bookingID: response.data.booking_id });
      //   console.log("bookingId fetched");
      // });

      Axios.post("http://localhost:4000/booking/ticket", {
        ticketInfo: ticketInfo,
        passengerSeats: passengerSeats,
        passengerPassports: passengerPassports,
      }).then((response) => {
        console.log("ticket finished");
        navigate("/checkOut/" + ticketInfo.bookingID);
      });
    }
  };
  return (
    <>
      <NavBar />

      <div className="container">
        <div className="row mt-3 justify-content-between">
          <div className="card col-8 mb-4">
            <h3 className="mt-3">Step 1 - Fill passenger deatails</h3>
            <hr />
            <Form onSubmit={handleSubmitPassengers}>
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
              {show2 && (
                <button type="submit" className="btn btn-primary btn-lg btn-block">
                  Submit Passenger Details
                </button>
              )}
            </Form>
          </div>

          <div className="card col-4 mb-4">
            <div className="card-header py-3">
              <h5 className="mb-1">Flight Details</h5>
              <h6 className="mx-2">
                {flightInfo.origin} ---- {flightInfo.destination}
              </h6>
              <h6 className="mx-2"> {flightInfo.departure_time}</h6>
            </div>
            <div className="card-body py-0">
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
                      <p className="mb-0">(including discount {discount} % ) </p>
                    </strong>
                  </div>
                  <span>
                    <strong>$ {(price * ticketInfo.noOfPassengers * (100 - discount)) / 100}</strong>
                  </span>
                </li>
              </ul>
            </div>
            <Alert show={show} variant="success">
              <Alert.Heading></Alert.Heading>
              <p>Select ALL seats first</p>
              <hr />
              <div className="d-flex justify-content-end">
                <Button onClick={() => setShow(false)} variant="outline-success">
                  Ok
                </Button>
              </div>
            </Alert>
            {show3 && show4 && (
              // <Button variant="warning" onClick={() => handleCheckOut()}>
              //   Checkout
              // </Button>
              <button type="submit" onClick={() => handleCheckOut()} className="btn btn-warning btn-lg btn-block">
                Checkout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mb-3 card">
        <h3 className="mt-3">Step 2 - Select seats</h3>
        <hr />
        {ticketInfo.class === "platinum" && (
          <div className="row text-center ">
            <h3 className="col-8">Platinum Class</h3>

            <DrawGrid
              seats={platinum}
              seatAvialable={seatAvialablePlatinum}
              seatReserved={passengerSeats}
              setSeatAvailable={setSeatAvailablePlatinum}
              setSeatReserved={setPassengerSeats}
              seatBooked={platinumBooked}
              max={ticketInfo.noOfPassengers}
            />
          </div>
        )}
        {ticketInfo.class === "business" && (
          <div className="row text-center ">
            <h3 className="col-8">Business Class</h3>

            <DrawGrid
              seats={business}
              seatAvialable={seatAvialableBusiness}
              seatReserved={passengerSeats}
              setSeatAvailable={setSeatAvailableBusiness}
              setSeatReserved={setPassengerSeats}
              seatBooked={businessBooked}
              max={ticketInfo.noOfPassengers}
            />
          </div>
        )}
        {ticketInfo.class === "economy" && (
          <div className="row text-center ">
            <h3 className="col-8">Economy</h3>

            <DrawGrid
              seats={economy}
              seatAvialable={seatAvialableEconomy}
              seatReserved={passengerSeats}
              setSeatAvailable={setSeatAvailableEconomy}
              setSeatReserved={setPassengerSeats}
              seatBooked={economyBooked}
              max={ticketInfo.noOfPassengers}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Booking;
