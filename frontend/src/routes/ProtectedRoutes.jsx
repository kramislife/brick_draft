import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/redux/features/authSlice";

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save intended route for post-login redirect
    const intended = `${location.pathname}${location.search || ""}`;
    try {
      sessionStorage.setItem("postLoginRedirect", intended);
    } catch (_) {}
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
