import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute = ({ element: Component }) => {
  const { user } = useAuth();

  // If user is logged in, redirect to profile
  if (user) return <Navigate to="/profile" />;

  return <Component />;
};

export default PublicRoute;
