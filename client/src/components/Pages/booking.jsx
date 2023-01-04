import React, { useState, useEffect } from "react";
import Axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
// import "../styles/Booking.css";
import NavBar from "./navbar";
import { useParams } from "react-router-dom";
function Booking() {
  const { id } = useParams();
  return (
    <>
      <NavBar />
      <div className="container">
        <div className="d-flex flex-wrap mt-3 justify-content-between">
          <div className=" card col-8 mb-4">
            <div className="card-header py-3">
              <h5 className="mb-0">{id.flight_id}</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Total
                  <span>$53.98</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Discount
                  <span>Gratis</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                  <div>
                    <strong>Total amount</strong>
                    <strong>
                      <p className="mb-0">(including VAT)</p>
                    </strong>
                  </div>
                  <span>
                    <strong>$53.98</strong>
                  </span>
                </li>
              </ul>

              <button type="button" className="btn btn-warning btn-lg btn-block">
                Go to checkout
              </button>
            </div>
          </div>
          <div className="card col-3 mb-4">
            <div className="card-header py-3">
              <h5 className="mb-0">Summary</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                  Total
                  <span>$53.98</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Discount
                  <span>Gratis</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                  <div>
                    <strong>Total amount</strong>
                    <strong>
                      <p className="mb-0">(including VAT)</p>
                    </strong>
                  </div>
                  <span>
                    <strong>$53.98</strong>
                  </span>
                </li>
              </ul>

              <button type="button" className="btn btn-warning btn-lg btn-block">
                Go to checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Booking;
