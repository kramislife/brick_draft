import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLazyGetCurrentUserQuery } from "@/redux/api/authApi";
import { setCredentials, logout } from "@/redux/features/authSlice";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);

  // Use lazy query to manually trigger the auth check
  const [getCurrentUser, { isLoading }] = useLazyGetCurrentUserQuery();

  useEffect(() => {
    // Always attempt to get current user on mount
    // The cookies are httpOnly, so we can't check them client-side
    // The API call will fail with 401 if not authenticated, which is expected
    console.log("AuthProvider: Checking authentication status...");

    getCurrentUser()
      .unwrap()
      .then((response) => {
        console.log("AuthProvider: Authentication successful", response);
        if (response?.user) {
          dispatch(setCredentials({ user: response.user }));
        } else {
          console.log("AuthProvider: No user data in response");
          dispatch(logout());
        }
      })
      .catch((error) => {
        // 401 is expected when not authenticated - handle silently
        if (error?.status === 401) {
          console.log("AuthProvider: User not authenticated (401)");
          dispatch(logout());
        } else {
          // Log other errors (network issues, server errors, etc.)
          console.error("AuthProvider: Auth check failed:", error);
          dispatch(logout());
        }
      })
      .finally(() => {
        setAuthChecked(true);
      });
  }, [getCurrentUser, dispatch]);

  // Show loading until auth check is complete
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
