import React from "react";
import { Navigate } from "react-router-dom";

const ClientProtectedRoute = ({ children }) => {
  const clientToken = localStorage.getItem("clientToken");
  if (!clientToken) {
    return <Navigate to="/client/login" replace />;
  }
  return children;
};

export default ClientProtectedRoute;