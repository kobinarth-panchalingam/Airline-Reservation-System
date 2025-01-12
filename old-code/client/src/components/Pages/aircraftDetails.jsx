import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBRipple,
  MDBCardImage,
  MDBContainer,
  MDBCarousel,
  MDBCarouselItem,
} from "mdb-react-ui-kit";
import NavBar from "./navbar";
import Footer from "./footer";

export default function AircraftDetails() {
  return (
    <>
      <NavBar />
      <MDBCarousel showIndicators showControls fade>
        <MDBCarouselItem className="w-100 d-block" itemId={1} src={require("../images/flight_for_Details.jpg")} alt="...">
          <h1>AircraftDetails</h1>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </MDBCarouselItem>

        <MDBCarouselItem className="w-100 d-block" itemId={2} src={require("../images/Aeroflot-Air-HostessForDetails.jpg")} alt="...">
          <h1>AircraftDetails</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </MDBCarouselItem>

        <MDBCarouselItem className="w-100 d-block" itemId={3} src={require("../images/forDetails.jpg")} alt="...">
          <h1>AircraftDetails</h1>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
        </MDBCarouselItem>
      </MDBCarousel>

      <MDBContainer className="p-3 my-5 d-flex flex-column col-md-8 col-lg-9">
        <MDBRow className="my-4">
          <MDBCol sm="4">
            <MDBCard className="h-100">
              <MDBRipple rippleColor="light" rippleTag="div" className="bg-image hover-overlay">
                <MDBCardImage style={{ height: "200px" }} src={require("../images/Boeing 737.jpg")} fluid alt="..." />
                <a>
                  <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}></div>
                </a>
              </MDBRipple>
              <MDBCardBody>
                <MDBCardTitle>Boeing 737 MAX 10</MDBCardTitle>
                <MDBCardText>
                  <li>
                    <i className="flaticon-startup"></i>
                    <b>Max Passenger Capacity: </b>186
                  </li>
                  <li>
                    <i className="flaticon-coffee"></i>
                    <b>Fuel Capacity: </b>26 035 litres
                  </li>
                  <li>
                    <i className="flaticon-search-interface-symbol"></i>
                    <b>Max Load: </b>89 765 kg
                  </li>
                  <li>
                    <i className="flaticon-plane"></i>
                    <b>Avg Air Speed: </b>839 kmph
                  </li>
                  <li>
                    <i className="flaticon-internet"></i>
                    <b>Manufacturer: </b>Boeing Commercial
                  </li>
                </MDBCardText>
                <MDBBtn href="https://en.wikipedia.org/wiki/Boeing_737" target="new">
                  Learn more...
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol sm="4">
            <MDBCard className="h-100">
              <MDBRipple rippleColor="light" rippleTag="div" className="bg-image hover-overlay">
                <MDBCardImage style={{ height: "200px" }} src={require("../images/Boeing 757.jpg")} fluid alt="..." />
                <a>
                  <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}></div>
                </a>
              </MDBRipple>
              <MDBCardBody>
                <MDBCardTitle>Boeing 757 300</MDBCardTitle>
                <MDBCardText>
                  <li>
                    <i className="flaticon-startup"></i>
                    <b>Max Passenger Capacity: </b>242
                  </li>
                  <li>
                    <i className="flaticon-coffee"></i>
                    <b>Fuel Capacity: </b>43 400 litres
                  </li>
                  <li>
                    <i className="flaticon-search-interface-symbol"></i>
                    <b>Max Load: </b>123 600 kg
                  </li>
                  <li>
                    <i className="flaticon-plane"></i>
                    <b>Avg Air Speed: </b>918 kmph
                  </li>
                  <li>
                    <i className="flaticon-internet"></i>
                    <b>Manufacturer: </b>Boeing Commercial
                  </li>
                </MDBCardText>
                <MDBBtn href="https://en.wikipedia.org/wiki/Boeing_757" target="new">
                  Learn more...
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol sm="4">
            <MDBCard className="h-100">
              <MDBRipple rippleColor="light" rippleTag="div" className="bg-image hover-overlay">
                <MDBCardImage style={{ height: "200px" }} src={require("../images/Airbus A380.jpg")} fluid alt="..." />
                <a>
                  <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}></div>
                </a>
              </MDBRipple>
              <MDBCardBody>
                <MDBCardTitle>Airbus A380 800</MDBCardTitle>
                <MDBCardText>
                  <li>
                    <i className="flaticon-startup"></i>
                    <b>Max Passenger Capacity: </b>568
                  </li>
                  <li>
                    <i className="flaticon-coffee"></i>
                    <b>Fuel Capacity: </b>320 000 litres
                  </li>
                  <li>
                    <i className="flaticon-search-interface-symbol"></i>
                    <b>Max Load: </b>560 000 kg
                  </li>
                  <li>
                    <i className="flaticon-plane"></i>
                    <b>Avg Air Speed: </b>900 kmph
                  </li>
                  <li>
                    <i className="flaticon-internet"></i>
                    <b>Manufacturer: </b>Airbus
                  </li>
                </MDBCardText>
                <MDBBtn href="https://en.wikipedia.org/wiki/Airbus_A380" target="new">
                  Learn more...
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Footer />
    </>
  );
}
