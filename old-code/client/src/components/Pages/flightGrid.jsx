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
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/flight/getFlights`).then((response) => {
      setData(response.data);
    });
  }, []);

  if (!data) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  const handleBookMe = (id) => {
    if (userid == null) {
      toast.info("You need to sign up first as a registered  user");
      // navigate("/signup");
    } else {
      navigate(`/booking/${userid}/${id}`);
    }
  };
  return (
    <MDBContainer className="mb-5 p-0">
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
      <hr />

      <MDBRow className="row-cols-1 row-cols-md-3 g-5">
        {data &&
          data.map((flight) => {
            return (
              <MDBCol key={flight.flight_id}>
                <MDBCard className="h-100 hover-shadow ">
                  <MDBCardImage src={require("../images/airports/" + flight.image_url)} height="250" alt="..." position="top" />
                  <MDBCardBody>
                    <MDBCardTitle className="row">
                      <div className="col-12 col-md-8 mb-2">
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
