import React, { useState } from "react";
import Axios from "axios";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Slide, Zoom, Flip, Bounce } from "react-toastify";
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBRow,
  MDBCol,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBTypography,
  MDBInput,
  MDBRadio,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const [justifyActive, setJustifyActive] = useState("tab2");
  const [signUpInfo, setSignUpInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    nic: "",
    dob: "",
    gender: "",
  });

  const handleChange = (event) => {
    setSignUpInfo({ ...signUpInfo, [event.target.name]: event.target.value });
    console.log(event.target.name);
  };

  const handleJustifyClick = (value) => {
    if (value === justifyActive) {
      return;
    }
    setJustifyActive(value);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log(signUpInfo.class);
    Axios.post(`${process.env.REACT_APP_API_URL}/signup`, {
      firstName: signUpInfo.firstName,
      lastName: signUpInfo.lastName,
      password: signUpInfo.password,
      email: signUpInfo.email,
      gender: signUpInfo.gender,
      phoneNumber: signUpInfo.phoneNumber,
      dob: signUpInfo.dob,
      nic: signUpInfo.nic,
    }).then((response) => {
      if (response.data != "1") {
        toast.error(response.data.sqlMessage);
      } else {
        toast.success("Successfully registered");
        evt.target.reset();
      }
      console.log(response);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <MDBContainer className="p-3 my-5 d-flex flex-column col-md-8 col-lg-6 ">
        <MDBTypography tag="div" className="display-6 text-center mb-4 text-primary">
          B Airways Reservation System
        </MDBTypography>
        <MDBTabs pills justify className="mb-3 d-flex flex-row justify-content-between">
          <MDBTabsItem>
            <MDBTabsLink onClick={() => navigate("/login")} active={justifyActive === "tab1"}>
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick("tab2")} active={justifyActive === "tab2"}>
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>

        <MDBTabsContent>
          <MDBTabsPane show={justifyActive === "tab2"}>
            <MDBRow>
              <MDBCol col="6">
                <MDBInput wrapperClass="mb-4" label="First Name" name="firstName" type="text" onChange={handleChange} required />
              </MDBCol>

              <MDBCol col="6">
                <MDBInput wrapperClass="mb-4" label="Last Name" name="lastName" type="text" onChange={handleChange} required />
              </MDBCol>
            </MDBRow>
            <MDBInput wrapperClass="mb-4" label="Email" name="email" type="email" onChange={handleChange} required />
            <MDBInput wrapperClass="mb-4" label="Password" name="password" type="password" onChange={handleChange} required />
            <MDBRow>
              <MDBCol md="6">
                <MDBInput wrapperClass="mb-4" label="Phone Number" name="phoneNumber" type="tel" onChange={handleChange} required />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput wrapperClass="mb-4" label="NIC Number" name="nic" type="tel" onChange={handleChange} required />
              </MDBCol>
            </MDBRow>

            <MDBRow>
              {/* <MDBCol md="6" className="mb-4">
                <h6 className="fw-bold">Class: </h6>
                <MDBRadio name="class" value="5" label="Gold" onChange={handleChange} inline required />
                <MDBRadio name="class" value="9" label="Platinum" onChange={handleChange} inline required />
                <MDBRadio name="class" value="0" label="None" onChange={handleChange} inline required />
              </MDBCol> */}
              <MDBCol md="6" className="mb-4">
                <MDBInput wrapperClass="mb-4 p-1" label="Birthday" size="lg" name="dob" type="date" onChange={handleChange} required />
              </MDBCol>

              <MDBCol md="6" className="mb-4">
                <h6 className="fw-bold">Gender: </h6>
                <MDBRadio name="gender" value="female" label="Female" onChange={handleChange} inline required />
                <MDBRadio name="gender" value="male" label="Male" onChange={handleChange} inline required />
                <MDBRadio name="gender" value="other" label="Other" onChange={handleChange} inline required />
              </MDBCol>
            </MDBRow>

            <div className="d-flex justify-content-center mb-4">
              <MDBCheckbox name="flexCheck" id="flexCheckDefault" label="I have read and agree to the terms!" required />
            </div>

            <MDBBtn type="submit" className="mb-4 w-100">
              Sign up
            </MDBBtn>
          </MDBTabsPane>
        </MDBTabsContent>
      </MDBContainer>
    </form>
  );
}

export default SignUp;
