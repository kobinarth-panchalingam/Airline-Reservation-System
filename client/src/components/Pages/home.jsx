import React, { Component } from "react";
import Header from "./header";
import "../styles/home.css";
import Booking from "./booking";
function Home() {
  return (
    <div className="home">
      <Header />
      <Booking />
    </div>
  );
}

export default Home;
