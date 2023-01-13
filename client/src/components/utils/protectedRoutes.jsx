import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutesAdmin = () => {
  const loggedInAdmin = localStorage.getItem("admin");

  return loggedInAdmin ? <Outlet /> : <Navigate to="/" />;
};

const ProtectedRoutesUser = () => {
  const loggedInUser = localStorage.getItem("user");

  return loggedInUser ? <Outlet /> : <Navigate to="/" />;
};

export { ProtectedRoutesAdmin, ProtectedRoutesUser };
