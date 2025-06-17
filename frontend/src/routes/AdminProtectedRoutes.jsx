import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// This will be replaced with actual auth logic once you integrate with backend
const AdminProtectedRoutes = () => {
  // Mock authentication status - replace with real auth check
  const isAuthenticated = true;
  const isAdmin = true;

  // If user is not authenticated or not an admin, redirect to home
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If they are authenticated and an admin, render the children routes
  return <Outlet />;
};

export default AdminProtectedRoutes;
