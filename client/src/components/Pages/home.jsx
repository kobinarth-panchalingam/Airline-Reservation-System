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
function Home() {
  const [user, setUser] = useState(false);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const loggedInAdmin = localStorage.getItem("admin");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser[0]);
    } else if (loggedInAdmin) {
      const foundAdmin = JSON.parse(loggedInAdmin);
      setAdmin(foundAdmin[0]);
      console.log(foundAdmin[0].name);
    }
  }, []);
  return (
    <div className="home">
      <NavBar />
      <Header userid={user.user_id} />
      <SearchFlights userid={user.user_id} />
      <FlightGrid userid={user.user_id} />
      <Footer />
    </div>
  );
}

export default Home;
