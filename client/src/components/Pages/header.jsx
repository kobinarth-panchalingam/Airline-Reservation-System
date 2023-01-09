import NavBar from "./navbar";
import { Link } from "react-router-dom";
import auth from "../utils/auth";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
function Header() {
  const [user, setUser] = useState({ user_id: null, first_name: "", last_name: "Guest" });
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const loggedInAdmin = localStorage.getItem("admin");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser[0]);
      // console.log(user.user_id);
      // navigate("/" + foundUser[0].user_id);
    } else if (loggedInAdmin) {
      const foundAdmin = JSON.parse(loggedInAdmin);
      setAdmin(foundAdmin[0]);
      console.log(foundAdmin[0].name);
    }
  }, []);

  return (
    <header>
      <NavBar />
      <div
        className="p-5 text-center bg-image"
        style={{
          backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')",
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
                <Link style={{ color: "white" }} to={"/upComingFlights"}>
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
