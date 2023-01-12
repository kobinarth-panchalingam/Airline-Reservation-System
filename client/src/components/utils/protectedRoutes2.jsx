import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes2 = () => {
  const loggedInUser = localStorage.getItem("user");
  return loggedInUser ? <Outlet /> : <Navigate to="/" />;
};
export { ProtectedRoutes2 };
