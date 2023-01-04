import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import SignIn from "./components/Pages/signin";
import SignUp from "./components/Pages/signup";
import Home from "./components/Pages/home";
import ProtectedRoutes from "./components/utils/protectedRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ViewFlights from "./components/Pages/viewFlights";
import Booking from "./components/Pages/booking";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
