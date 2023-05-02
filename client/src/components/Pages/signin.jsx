import React, { useEffect, useState } from "react";
import Axios from "axios";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import auth from "../utils/auth";
import { ToastContainer, toast, Flip } from "react-toastify";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBTypography,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
function SignIn() {
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const loggedInAdmin = localStorage.getItem("admin");

    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      console.log(foundUser[0].user_id);
      navigate("/");
    } else if (loggedInAdmin) {
      const foundAdmin = JSON.parse(loggedInAdmin);
      setAdmin(foundAdmin);
      console.log(foundAdmin[0].user_id);
      navigate("/");
    }
  }, []);
  const navigate = useNavigate();
  const [justifyActive, setJustifyActive] = useState("tab1");
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setLoginInfo({ ...loginInfo, [event.target.id]: event.target.value });
  };

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };
  const handleSubmit = (evt) => {
    console.log(loginInfo);
    evt.preventDefault();

    Axios.get(`${process.env.REACT_APP_API_URL}/login/admin/` + loginInfo.email).then((response) => {
      const { data } = response;
      if (data.length > 0) {
        Axios.post(`${process.env.REACT_APP_API_URL}/login/admin`, {
          email: loginInfo.email,
          password: loginInfo.password,
        }).then((response) => {
          if (response.data.msg) {
            toast.error("Incorrect username and password");
          } else {
            setAdmin(response.data);
            // store the user in localStorage
            localStorage.setItem("admin", JSON.stringify(response.data));
            auth.adminLogin();
            navigate("/");
          }
        });
      } else {
        Axios.post(`${process.env.REACT_APP_API_URL}/login/user`, {
          email: loginInfo.email,
          password: loginInfo.password,
        }).then((response) => {
          if (response.data.msg) {
            // alert("Incorrect username and password");
            toast.error("Incorrect username and password");
          } else {
            setUser(response.data);
            // store the user in localStorage
            localStorage.setItem("user", JSON.stringify(response.data));
            auth.userLogin(response.data[0]);
            navigate("/");
          }
        });
      }
    });
  };

  return (
    <React.Fragment>
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
      <form onSubmit={handleSubmit}>
        <MDBContainer className="p-3 mt-5 d-flex flex-column col-md-8 col-lg-6">
          <MDBTypography tag="div" className="display-6 text-center mb-4 text-primary">
            B Airways Reservation System
          </MDBTypography>
          <MDBTabs pills justify className="mb-3 d-flex flex-row justify-content-between">
            <MDBTabsItem>
              <MDBTabsLink onClick={() => handleJustifyClick("tab1")} active={justifyActive === "tab1"}>
                Login
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink onClick={() => navigate("/signup")} active={justifyActive === "tab2"}>
                Register
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            <MDBTabsPane show={justifyActive === "tab1"}>
              <MDBInput wrapperClass="mb-4" label="Email address" id="email" onChange={handleChange} type="email" required />
              <MDBInput wrapperClass="mb-4" label="Password" id="password" onChange={handleChange} type="password" required />

              <div className="d-flex justify-content-between mx-4 mb-4">
                <MDBCheckbox name="flexCheck" value="" id="flexCheckDefault" label="Remember me" />
                {/* <a href="!#">Forgot password?</a> */}
              </div>

              <MDBBtn type="submit" className="mb-4 w-100">
                Sign in
              </MDBBtn>
              <p className="text-center">
                Not a member?{" "}
                <a href="#!" onClick={() => navigate("/signup")}>
                  Register
                </a>
              </p>
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBContainer>
      </form>
      <MDBContainer className="d-flex flex-column col-md-8 col-lg-6">
        <h4 className="text-center">OR</h4>
        <p className="text-center">Sign in as</p>
        <MDBBtn onClick={() => navigate("/")} className="me-1">
          GUEST
        </MDBBtn>
      </MDBContainer>
    </React.Fragment>
  );
}

export default SignIn;
