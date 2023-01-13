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
function Home() {
  const [user, setUser] = useState(false);
  const [admin, setAdmin] = useState(false);
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const loggedInAdmin = localStorage.getItem("admin");
    console.log(timeZone);
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser[0]);
    } else if (loggedInAdmin) {
      const foundAdmin = JSON.parse(loggedInAdmin);
      setAdmin(foundAdmin[0]);
    }
  }, []);
  return (
    <div className="home">
      <NavBar />
      <Header userid={user.user_id} />
      <UpComingFlights />
      <FlightGrid userid={user.user_id} />
      <AircraftDetails />
      <Footer />
    </div>
  );
}

export default Home;
