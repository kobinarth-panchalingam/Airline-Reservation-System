import React from "react";
import { MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBContainer } from "mdb-react-ui-kit";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function FlightGrid({ userid }) {
  const [data, setData] = useState([{}]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("http://localhost:4000/flight/getFlights").then((response) => {
      setData(response.data);
    });
  }, []);

  const handleBookMe = (id) => {
    if (userid == null) {
      toast.warn("You need to sign up first", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/signup");
    } else {
      navigate(`/booking/${userid}/${id}`);
    }
  };
  return (
    <MDBContainer className="mb-5">
      <MDBRow className="row-cols-2 row-cols-md-3 g-5">
        {data.map((flight) => {
          return (
            <MDBCol>
              <MDBCard className="h-100">
                <MDBCardImage src={flight.image_url} height="250" alt="..." position="top" />
                <MDBCardBody>
                  <MDBCardTitle>
                    <h5>
                      {flight.origin} &nbsp;
                      <i class="bi bi-arrow-left-right"></i> &nbsp;
                      {flight.destination}
                    </h5>
                    <hr />
                  </MDBCardTitle>
                  <MDBCardText>
                    <h6>
                      <i class="bi bi-clock"></i> &nbsp;
                      {flight.time}
                    </h6>
                    <h6>
                      <i class="bi bi-calendar2-month"></i> &nbsp;
                      {flight.date}
                    </h6>
                    <h6>
                      <i class="bi bi-airplane"></i> &nbsp; B Air Ways
                    </h6>
                  </MDBCardText>
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
