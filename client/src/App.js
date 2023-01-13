import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import SignIn from "./components/Pages/signin";
import SignUp from "./components/Pages/signup";
import Home from "./components/Pages/home";
import { ProtectedRoutesAdmin, ProtectedRoutesUser } from "./components/utils/protectedRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewFlights from "./components/Pages/editFlights";
import Booking from "./components/Pages/booking";
import Reports from "./components/Pages/reports";
import Aboutus from "./components/Pages/aboutUs";
import UpComingFlights from "./components/Pages/upComingFlights";
import AircraftDetails from "./components/Pages/aircraftDetails";
import CheckOut from "./components/Pages/checkOut";
import { useEffect, useState } from "react";
import { SearchFlights } from "./components/Pages/searchFlights";
function App() {
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const loggedInAdmin = localStorage.getItem("admin");

    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    } else if (loggedInAdmin) {
      const foundAdmin = JSON.parse(loggedInAdmin);
      setAdmin(foundAdmin);
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route exact path="/login" element={<SignIn />} />
        <Route element={<ProtectedRoutesAdmin />}>
          <Route path="/reports" element={<Reports />} />
          <Route path="/viewFlights" element={<ViewFlights />} />
        </Route>
        <Route element={<ProtectedRoutesUser />}>
          <Route path="/checkOut/:booking_id" element={<CheckOut />} />
          <Route path="/booking/:userid/:id" element={<Booking />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/aboutUs" element={<Aboutus />} />
        <Route path="/serachFlights/:id" element={<SearchFlights />} />
        <Route path="/aircraftDetails" element={<AircraftDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
