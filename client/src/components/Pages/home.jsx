import React, { Component } from "react";
import Header from "./header";
import "../styles/home.css";
import { SearchFlights } from "./searchFlights";
import Footer from "./footer.jsx";
import Aboutus from "./aboutUs";
import { useParams } from "react-router-dom";
import NavBar from "./navbar";
import FlightGrid from "./flightGrid";
import { useState } from "react";
import { useEffect } from "react";
import UpComingFlights from "./upComingFlights";
import AircraftDetails from "./aircraftDetails";
import { Alert } from "react-bootstrap";
function Home() {
  const [user, setUser] = useState(false);
  const [admin, setAdmin] = useState(false);
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  useEffect(() => {
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
  const [show, setShow] = useState(true);
  return (
    <div className="home">
      <NavBar />
      <Header userid={user.user_id} />

      <div class="container mt-1">
        <Alert show={show} variant="warning" dismissible onClose={() => setShow(false)}>
          <Alert.Heading>Important Notice</Alert.Heading>! Fligths are sheduled between Feb 1st 2024 to Feb 7th 2024
        </Alert>
      </div>
      <UpComingFlights />
      <FlightGrid userid={user.user_id} />
      <Footer />
    </div>
  );
}

export default Home;
