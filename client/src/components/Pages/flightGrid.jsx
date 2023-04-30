import React from "react";
import { MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBContainer } from "mdb-react-ui-kit";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer, toast, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function FlightGrid({ userid }) {
  const [data, setData] = useState([{ image_url: "sample.jpg" }]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("https://bairways-backend.onrender.com/flight/getFlights").then((response) => {
      setData(response.data);
    });
  }, []);

  const handleBookMe = (id) => {
    if (userid == null) {
      toast.info("You need to sign up first as a registered  user");
      // navigate("/signup");
    } else {
      navigate(`/booking/${userid}/${id}`);
    }
  };
  return (
    <MDBContainer className="mb-5">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Flip}
      />
      <MDBRow className="row-cols-1 row-cols-md-3 g-5">
        {data.map((flight) => {
          return (
            <MDBCol>
              <MDBCard className="h-100 hover-shadow ">
                <MDBCardImage src={require("../images/airports/" + flight.image_url)} height="250" alt="..." position="top" />
                <MDBCardBody>
                  <MDBCardTitle className="row">
                    <div class="col-12 col-md-8 mb-2">
                      {flight.origin} &nbsp;
                      <i className="bi bi-arrow-left-right"></i> &nbsp;
                      {flight.destination}
                    </div>
                    <div className="col-12 col-md-4">{flight.flight_time}</div>
                    <hr />
                  </MDBCardTitle>

                  <h6>
                    <i className="bi bi-clock"></i> &nbsp;
                    {flight.time}
                  </h6>
                  <h6>
                    <i className="bi bi-calendar2-month"></i> &nbsp;
                    {flight.date}
                  </h6>
                  <h6>
                    <i className="bi bi-airplane"></i> &nbsp; B Air Ways
                  </h6>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      handleBookMe(flight.flight_id);
                    }}
                  >
                    BOOK ME
                  </button>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          );
        })}
      </MDBRow>
    </MDBContainer>
  );
}
