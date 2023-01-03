import { Navigate, Outlet } from "react-router-dom";
import auth from "./auth";
const ProtectedRoutes = () => {
  return auth.isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
