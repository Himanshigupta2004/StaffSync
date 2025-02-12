import React from "react";
import { Route, Navigate } from "react-router-dom";


const ProtectedRoute = ({ element, requiredRole, ...rest }) => {
  const userRole = localStorage.getItem("userRole"); 
  const authToken = localStorage.getItem("authToken"); 
  if (!authToken || userRole !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
