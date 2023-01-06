import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../styles/navbar.css";
import auth from "../utils/auth";
import { Link } from "react-router-dom";

function NavBar() {
  console.log(auth.isAuthenticated());
  return (
    <Navbar sticky="top" bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          B Air-Ways
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {auth.isAuthenticated() && (
              <Nav.Link as={Link} to="/viewFlights">
                Flights
              </Nav.Link>
            )}
            {!auth.isAuthenticated() && (
              <Nav.Link as={Link} to="/upComingFlights">
                Flights
              </Nav.Link>
            )}
            {auth.isAuthenticated() && (
              <Nav.Link as={Link} to="/reports">
                Reports
              </Nav.Link>
            )}

            <NavDropdown title="More" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/aboutUs">
                AboutUs
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        {auth.isAuthenticated() && (
          <Nav.Link className="d-flex p-0" href="/login">
            Logout
          </Nav.Link>
        )}
        {!auth.isAuthenticated() && (
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
