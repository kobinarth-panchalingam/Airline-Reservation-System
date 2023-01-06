import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import SignIn from "./components/Pages/signin";
import SignUp from "./components/Pages/signup";
import Home from "./components/Pages/home";
import ProtectedRoutes from "./components/utils/protectedRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewFlights from "./components/Pages/viewFlights";
import Booking from "./components/Pages/booking";
import Reports from "./components/Pages/reports";
import Seats from "./components/Pages/seats";
import Aboutus from "./components/Pages/aboutUs";
import UpComingFlights from "./components/Pages/upComingFlights";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        {/* <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route> */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/viewFlights" element={<ViewFlights />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/seats" element={<Seats />} />
        <Route path="/aboutUs" element={<Aboutus />} />
        <Route path="/upComingFlights" element={<UpComingFlights />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
