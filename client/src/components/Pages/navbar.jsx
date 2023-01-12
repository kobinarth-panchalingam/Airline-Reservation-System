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
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const loggedInAdmin = localStorage.getItem("admin");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser[0]);
    } else if (loggedInAdmin) {
      const foundAdmin = JSON.parse(loggedInAdmin);
      setAdmin(foundAdmin[0]);
      console.log(foundAdmin[0].name);
    }
  }, []);

  return (
    <Navbar sticky="top" bg="light" expand="lg">
      <Container>
        <Navbar.Brand>B Air-Ways</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to={"/"}>
              Home
            </Nav.Link>

            <Nav.Link as={Link} to={"/upComingFlights"}>
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
            <NavDropdown title="More" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/aboutUs">
                AboutUs
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/aircraftDetails">
                Aircrafts
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        {(user || admin) && (
          <Nav.Link
            onClick={() => {
              localStorage.clear();
            }}
            className="d-flex p-0"
            href="/login"
          >
            Logout
          </Nav.Link>
        )}

        {!(user || admin) && (
          <>
            <Nav.Link className="card d-flex p-2 " href="/login">
              Login &nbsp;
            </Nav.Link>
            <span></span>
            <Nav.Link className="card d-flex p-2" href="/signup">
              Signup
            </Nav.Link>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
