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
const date = new Date();
const futureDate = date.getDate();
date.setDate(futureDate);
const currentDate = date.toLocaleDateString("en-CA");

function CheckOut() {
  const [show, setShow] = useState(false);
  const { booking_id } = useParams();
  const [user, setUser] = useState([{ first_name: "-", last_name: "-" }]);
  const [admin, setAdmin] = useState();
  const [ticketInfo, setTicketInfo] = useState([{ amount: "-", booked_date: "-" }]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    Axios.get(`${process.env.REACT_APP_API_URL}/booking/bookingDetails/${booking_id}`).then((response) => {
      setTicketInfo(response.data);
      setLoading(false);
    });

    const loggedInUser = localStorage.getItem("user");
    const loggedInAdmin = localStorage.getItem("admin");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser[0]);
    } else if (loggedInAdmin) {
      const foundAdmin = JSON.parse(loggedInAdmin);
      setAdmin(foundAdmin[0]);
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    Axios.put(`${process.env.REACT_APP_API_URL}/booking/update/${booking_id}`).then((response) => {
      setShow(true);
    });
  };

  if (true) {
    return (
      <>
        <NavBar />
        <div className="container">
          <h1>Hello {user.first_name + " " + user.last_name}</h1>
          <hr />
          <div className="row">
            <div className="col-12 col-md-4">
              <h5>Ticket Details</h5>
            </div>
            <div className="col-12 col-md-4">
              <h5>Booked date - UTC</h5>
              <h6 className="text-danger">{ticketInfo[0].booked_date}</h6>
            </div>
            <div className="col-12 col-md-4">
              <h5>Total Amount</h5>
              <h6 className="text-danger">$ {ticketInfo[0].amount}</h6>
            </div>
            {/* <div className="col-3">
              <h4>Total Amount</h4>
              <h5>$ {ticketInfo[0].flight_id}</h5>
            </div> */}
          </div>
          <hr />
          <div className="table-responsive">
            <table className="table   table-bordered table-striped table-hover ">
              <thead className=" table-light">
                <tr>
                  <th className="text-center">Ticket ID</th>
                  <th className="text-center">Seat No</th>
                  <th className="text-center">Class</th>
                  <th className="text-center">Passenger Name</th>
                  <th className="text-center">Passport Number</th>
                </tr>
              </thead>
              <tbody>
                {ticketInfo.map((ticket) => {
                  const { ticket_id, seat_no, seat_class, passenger_name, passport_number } = ticket;
                  return (
                    <tr key={ticket_id}>
                      <td className="text-center">{ticket_id}</td>
                      <td className="text-center">{seat_no}</td>
                      <td className="text-center">{seat_class}</td>
                      <td className="text-center">{passenger_name}</td>
                      <td className="text-center">{passport_number}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Alert show={show} variant="success">
            <Alert.Heading></Alert.Heading>
            <h3 className="text-center">Thank You For your Payment</h3>
            <h3 className="text-center">
              Your ticket deatils will be sent to your <b className="text-danger">{user.email}</b>
            </h3>
            <h3 className="text-center">Have a safe journey</h3>
            <hr />
          </Alert>
          <div className="col text-center">
            {!show && (
              <button onClick={handlePayment} className="btn btn-primary btn-lg ">
                Pay Now
              </button>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default CheckOut;
