import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import { MDBBtn, MDBContainer, MDBIcon } from "mdb-react-ui-kit";
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
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./footer.jsx";
import "../styles/booking.css";

function Booking() {
  const navigate = useNavigate();
  const [control, setControl] = useState(false);
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
    Axios.get(`${process.env.REACT_APP_API_URL}/login/user/${userid}`).then((response) => {
      setDiscount(response.data[0].discount);
    });

    Axios.get(`${process.env.REACT_APP_API_URL}/booking/flightDetails/${id}`).then((response) => {
      setFlightInfo(response.data[0]);
      setPrice(response.data[0].economy_fare);
      setTicketInfo({ ...ticketInfo, totalPrice: response.data[0].economy_fare });
    });
    Axios.get(`${process.env.REACT_APP_API_URL}/booking/seatCount/${id}`).then((response) => {
      setSeatInfo(response.data[0]);
    });

    Axios.post(`${process.env.REACT_APP_API_URL}/booking/seats`, { type: "economy", id: id }).then((response) => {
      response.data.forEach((element) => {
        economyBooked.push(element.seat_no + "");
      });
    });
    Axios.post(`${process.env.REACT_APP_API_URL}/booking/seats`, { type: "business", id: id }).then((response) => {
      response.data.forEach((element) => {
        businessBooked.push(element.seat_no + "");
      });
    });
    Axios.post(`${process.env.REACT_APP_API_URL}/booking/seats`, { type: "platinum", id: id }).then((response) => {
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
            <Form.Control type="text" id={"" + i} name={"passengerName"} onChange={handleChange} required disabled={control} />
            <label htmlFor={"" + i}>Full Name</label>
          </Form.Floating>
        </Col>
        <Col sm="3">
          <Form.Floating>
            <Form.Control type="text" id={"" + i} name={"passengerPassport"} onChange={handleChange} required disabled={control} />
            <label htmlFor={"" + i}>Passport</label>
          </Form.Floating>
        </Col>
        <Col sm="3">
          <Form.Floating>
            <Form.Control
              type="date"
              id={"" + i}
              placeholder="Date of Birth"
              name={"passengerDob"}
              onChange={handleChange}
              required
              disabled={control}
            />
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
    Axios.post(`${process.env.REACT_APP_API_URL}/booking/passenger`, {
      ticketInfo: ticketInfo,
      passengerName: passengerNames,
      passengerPassports: passengerPassports,
      passengerDob: passengerDob,
    }).then((response) => {
      console.log("pId", response.data);
      setShow3(true);
      toast.success("Passenger deatails are submitted");
      setControl(true);
      setControlInput(style2);
    });

    Axios.post(`${process.env.REACT_APP_API_URL}/booking/book`, {
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

  const handleCheckOut = (event) => {
    if (passengerSeats.length != ticketInfo.noOfPassengers) {
      toast.warn("select all seats first");
    } else {
      Axios.post(`${process.env.REACT_APP_API_URL}/booking/ticket`, {
        ticketInfo: ticketInfo,
        passengerSeats: passengerSeats,
        passengerPassports: passengerPassports,
      }).then((response) => {
        console.log(response);
        if (response.data == "1") {
          console.log("ticket finished");
          navigate("/checkOut/" + ticketInfo.bookingID);
        } else {
          toast.error(response.data.sqlMessage);
        }
      });
    }
  };

  const style1 = {
    "pointer-events": "none",
    opacity: 0.5,
  };
  const style2 = {
    opacity: 1,
  };
  const [controlInput, setControlInput] = useState(style1);

  let mybutton;

  window.onscroll = function () {
    mybutton = document.getElementById("btn-back-to-top");
    scrollFunction(mybutton);
  };

  function scrollFunction(mybutton) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
  return (
    <>
      <MDBBtn
        onClick={backToTop}
        id="btn-back-to-top"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "none",
        }}
        className="btn-floating"
        color="primary"
        size="lg"
      >
        <MDBIcon fas icon="arrow-up" />
      </MDBBtn>
      <NavBar />
      <ToastContainer
        position="top-center"
        autoClose={3000}
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
      <div className="container">
        <div className="row mt-3 justify-content-between">
          <div className="card col-12 col-md-8 order-2   order-md-1  mb-4">
            <h3 className="mt-3">Step 1 - Fill passenger deatails</h3>
            <hr />
            <Form onSubmit={handleSubmitPassengers}>
              <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                <Form.Label column sm="2">
                  Class
                </Form.Label>
                <Col sm="10">
                  <Form.Select
                    defaultValue="economy"
                    name="class"
                    onChange={handleChange}
                    aria-label="Default select example"
                    required
                    disabled={control}
                  >
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
                  <Form.Select defaultValue="1" name="noOfPassengers" onChange={handleChange} aria-label="Default select example" disabled={control}>
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
                <>
                  <p className="text-warning">After submitting passenger details you can't change above fields</p>
                  <button type="submit" className="btn btn-primary btn-lg btn-block pt-3">
                    Submit Passenger Details
                  </button>
                </>
              )}
            </Form>
          </div>

          <div className="card col-12 col-md-4 order-1 order-md-2 mb-4">
            <div className="card-header pt-3 pb-0">
              <h5 className="mb-1">Flight Details</h5>
              <hr />
              <h6 className="mx-2">
                {flightInfo.origin} <i className="bi bi-arrow-right"></i> &nbsp;
                {flightInfo.destination}
              </h6>
              <p className="mx-2">
                Depart -<strong> {flightInfo.departure_time}</strong>
              </p>
              <p className="mx-2">
                Arival &nbsp; -<strong> {flightInfo.arrival_time}</strong>
              </p>
            </div>
            <div className="card-body py-0">
              <ul className="list-group list-group-flush mx-2">
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
            {show3 && show4 && (
              <button type="submit" onClick={(event) => handleCheckOut(event)} className="btn btn-primary btn-lg btn-block">
                Checkout
              </button>
            )}
          </div>
        </div>
      </div>

      {true && (
        <div style={controlInput} className="container mb-3 card">
          <h3 className="mt-3">Step 2 - Select seats</h3>
          <hr />
          {ticketInfo.class === "platinum" && (
            <div className="row text-center ">
              <h3 className="col-12 col-md-8">Platinum Class</h3>

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
              <h3 className="col-12 col-md-8">Business Class</h3>

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
              <h3 className="col-12 col-md-8">Economy</h3>

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
      )}
      <Footer />
    </>
  );
}

export default Booking;
