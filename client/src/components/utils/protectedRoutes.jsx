import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const loggedInAdmin = localStorage.getItem("admin");

  return loggedInAdmin ? <Outlet /> : <Navigate to="/" />;
};

const ProtectedRoutes2 = () => {
  const loggedInUser = localStorage.getItem("user");

  return loggedInUser ? <Outlet /> : <Navigate to="/" />;
};

export { ProtectedRoutes, ProtectedRoutes2 };
