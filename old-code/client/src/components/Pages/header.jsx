import NavBar from "./navbar";
import { Link } from "react-router-dom";
import auth from "../utils/auth";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Background from "../images/jet-airways.webp";
function Header() {
  const [user, setUser] = useState({ user_id: null, first_name: "", last_name: "Guest" });
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
    }
  }, []);

  return (
    <header>
      <div
        className="p-5 text-center bg-image"
        style={{
          backgroundImage: `url(${Background})`,
          height: "400px",
        }}
      >
        <div className="mask" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-white">
              <h1 className="mb-3">Welcome to B Airways</h1>
              {!admin && <h4 className="mb-3">{user.first_name + " " + user.last_name} </h4>}
              {admin && <h4 className="mb-3">Admin {admin.name}</h4>}
              <button className="btn btn-outline-light btn-lg">
                <Link style={{ color: "white" }} to={"/serachFlights/" + user.user_id}>
                  BOOK
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
