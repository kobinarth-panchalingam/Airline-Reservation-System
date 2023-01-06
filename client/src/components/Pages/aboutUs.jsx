import { MDBCol, MDBContainer, MDBRipple, MDBRow } from "mdb-react-ui-kit";
import React from "react";
import NavBar from "./navbar";
import "../styles/Aboutus.css";
import Footer from "./footer";

function Aboutus() {
  return (
    <>
      <NavBar />
      <div className="class2">
        <div className="container-fluid class1 text-center">
          <br />
          <p className="h3 font-weight bold hover-shadow">What We Offer</p>
          <br />
          <div className="row">
            <div className="col-sm-4 hover-shadow">
              <span className="glyphicon glyphicon-off logo-small "></span>
              <h4>BEST OFFERS</h4>
              <p>Lorem ipsum dolor sit amet..</p>
            </div>
            <div className="col-sm-4 hover-shadow">
              <span className="glyphicon glyphicon-heart logo-small"></span>
              <h4>TRANSPARENCY IN PRICE</h4>
              <p>Lorem ipsum dolor sit amet..</p>
            </div>
            <div className="col-sm-4 hover-shadow">
              <span className="glyphicon glyphicon-lock logo-small"></span>
              <h4>JOB DONE</h4>
              <p>Lorem ipsum dolor sit amet..</p>
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col-sm-4 hover-shadow">
              <span className="glyphicon glyphicon-leaf logo-small"></span>
              <h4>HIGH QUALITY</h4>
              <p>Lorem ipsum dolor sit amet..</p>
            </div>
            <div className="col-sm-4 hover-shadow">
              <span className="glyphicon glyphicon-certificate logo-small"></span>
              <h4>CERTIFIED PROFESSIONALS</h4>
              <p>Lorem ipsum dolor sit amet..</p>
            </div>
            <div className="col-sm-4 hover-shadow">
              <span className="glyphicon glyphicon-wrench logo-small"></span>
              <h4>HARD WORK</h4>
              <p>Lorem ipsum dolor sit amet..</p>
            </div>
          </div>
        </div>

        <section className="my-section">
          <MDBRow>
            <div className="col-lg-6 align-items-center d-flex justify-content-center">
              <MDBRipple rippleColor="light" className="bg-image hover-overlay hover-zoom hover-shadow">
                <img src={require("../images/157.jpg")} width="680" style={{ borderRadius: "20px" }} height="500" />
                <a href="#!">
                  <div className="mask rgba-white-slight"></div>
                </a>
              </MDBRipple>
            </div>

            <MDBCol lg="6" md="6">
              <p style={{ fontSize: "23px", marginLeft: "1px" }}>
                Our focus is on your overall well being and helping you avail
                <br />
                luxurious flights at minimal costs. We provide state-of-the-art <br />
                facilities in all our airways.
              </p>
              <br />
              <br />
              <br />
              <div>
                {" "}
                <b style={{ fontSize: "25px" }}>Our Missions</b>
                <br />
                <p style={{ fontSize: "20px" }}>To make our flights easy, comfortable and reliable for you</p>
              </div>
              <br />
              <br />
              <br />
              <div>
                {" "}
                <b style={{ fontSize: "25px" }}>Professionals in our Airways</b>
                <br />
                <p style={{ fontSize: "20px" }}>Has provided a high class facility for every journey</p>
              </div>

              <button type="button" className="btn btn-light-blue btn-md">
                Read more
              </button>
            </MDBCol>
          </MDBRow>

          <br />
          <br />
          <br />
          <br />

          <MDBRow>
            <MDBCol lg="6" md="6">
              <br />
              <br />
              <br />
              <br />
              <h1 style={{ textAlign: "center" }}>
                Come fly with us and
                <br /> you could win the
                <br /> TRIP OF A LIFETIME
              </h1>
            </MDBCol>

            <div className="col-lg-6 align-items-center d-flex justify-content-center">
              <MDBRipple rippleColor="light" className="bg-image hover-overlay hover-zoom hover-shadow">
                <img src={require("../images/Flight759566385.jpg")} width="950" style={{ borderRadius: "20px" }} height="500" />
                <a href="#!">
                  <div className="mask rgba-white-slight"></div>
                </a>
              </MDBRipple>
            </div>
          </MDBRow>
        </section>

        <br />
        <br />

        <MDBRow>
          <div
            className="col-lg-6 align-items-center d-flex justify-content-center"
            style={{
              width: "650px",
              height: "700px",
              marginRight: "0",
              marginLeft: "70px",
            }}
          >
            <video className="w-100" autoPlay loop muted>
              <source src={require("../images/FLIGHT.mp4")} type="video/mp4" />
            </video>
          </div>

          <div className="col-lg-6 align-items-center d-flex justify-content-center">
            <div className="white border-0" style={{ width: "35rem" }}>
              <h2>
                <strong style={{ fontSize: "35px", marginLeft: "15px" }}>Your comfort is our priority</strong>
              </h2>

              <div className="card-body white border-0">
                <p style={{ fontSize: "22px" }}>
                  We are providing you the most comfortable flights ever. You will feel home when you board in the flight. Staff will treat you as
                  their home members
                </p>
                <button type="button" className="btn btn-success" style={{ fontSize: "22px", padding: "10px" }}>
                  More Information
                </button>
              </div>
            </div>
          </div>
        </MDBRow>
      </div>
    </>
  );
}

export default Aboutus;
