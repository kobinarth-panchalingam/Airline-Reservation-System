import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../styles/navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function NavBar() {
  const [user, setUser] = useState(false);
  const [admin, setAdmin] = useState(false);
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const loggedInAdmin = localStorage.getItem("admin");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser[0]);
    } else if (loggedInAdmin) {
      const foundAdmin = JSON.parse(loggedInAdmin);
      setAdmin(foundAdmin[0]);
    }
  }, []);
  var offset = new Date().getTimezoneOffset();
  var sign = offset < 0 ? "+" : "-";
  var offsetInHours = Math.abs(offset / 60);
  var offsetWithColon = `${sign}${Math.floor(offsetInHours)}:${Math.abs(offset % 60)}`;
  return (
    <Navbar sticky="top" bg="light" expand="md  ">
      <Container>
        <Navbar.Brand>B Air-Ways</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={"/"}>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to={"/serachFlights/" + user.user_id}>
              Flights
            </Nav.Link>
            {admin && (
              <Nav.Link as={Link} to="/viewFlights">
                Edit Flights
              </Nav.Link>
            )}
            {admin && (
              <Nav.Link as={Link} to="/reports">
                Reports
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/aboutUs">
              AboutUs
            </Nav.Link>
            <Nav.Link as={Link} to="/aircraftDetails">
              Aircrafts
            </Nav.Link>
            {/* <NavDropdown title="More" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/aboutUs">
                AboutUs
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/aircraftDetails">
                Aircrafts
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown> */}
          </Nav>

          <Nav>
            {(user || admin) && (
              <Nav.Link
                onClick={() => {
                  localStorage.clear();
                }}
                className="d-flex pr-2"
                href="/login"
              >
                Logout
              </Nav.Link>
            )}
            {!(user || admin) && (
              <>
                <Nav.Link className="d-flex" href="/login">
                  Login &nbsp;
                </Nav.Link>
                <span></span>
                <Nav.Link className="d-flex" href="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
          </Nav>
          <Nav.Link className="px-0">{timeZone}</Nav.Link>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
