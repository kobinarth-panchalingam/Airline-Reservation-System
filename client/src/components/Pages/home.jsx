import React, { Component } from "react";
import Header from "./header";
import "../styles/home.css";
import { SearchFlights } from "./searchFlights";
import ViewFlights from "./viewFlights";
import Footer from "./footer.jsx";
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
