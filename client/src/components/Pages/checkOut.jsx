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
const date = new Date();
const futureDate = date.getDate();
date.setDate(futureDate);
const currentDate = date.toLocaleDateString("en-CA");

function CheckOut() {
  useEffect(() => {}, []);

  return (
    <>
      <NavBar />
    </>
  );
}

export default CheckOut;
