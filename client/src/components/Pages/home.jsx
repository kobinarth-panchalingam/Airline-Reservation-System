import React, { Component } from "react";
import Header from "./header";
import "../styles/home.css";
import { SearchFlights } from "./searchFlights";
import Footer from "./footer.jsx";
import Aboutus from "./aboutUs";
function Home() {
  return (
    <div className="home">
      <Header />
      <SearchFlights />
      <Footer />
    </div>
  );
}

export default Home;
