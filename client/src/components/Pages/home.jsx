import React, { Component } from "react";
import Header from "./header";
import "../styles/home.css";
import { SearchFlights } from "./searchFlights";
import Footer from "./footer.jsx";
import Aboutus from "./aboutUs";
import { useParams } from "react-router-dom";
function Home() {
  const { userid } = useParams();
  console.log(userid == "undefined");
  return (
    <div className="home">
      <Header userid={userid} />
      <SearchFlights userid={userid} />
      <Footer />
    </div>
  );
}

export default Home;
