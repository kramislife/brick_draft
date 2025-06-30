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
    let isMounted = true;

    // Always attempt to get current user on mount
    // The cookies are httpOnly, so we can't check them client-side
    // The API call will fail with 401 if not authenticated, which is expected
    console.log("AuthProvider: Checking authentication status...");

    // Add a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log(
          "AuthProvider: Timeout reached, proceeding without auth check"
        );
        dispatch(logout());
        setAuthChecked(true);
      }
    }, 3000); // 3 second timeout

    const checkAuth = async () => {
      try {
        const response = await getCurrentUser().unwrap();
        if (isMounted) {
          clearTimeout(timeoutId);
          console.log("AuthProvider: Authentication successful", response);
          if (response?.user) {
            dispatch(setCredentials({ user: response.user }));
          } else {
            console.log("AuthProvider: No user data in response");
            dispatch(logout());
          }
          setAuthChecked(true);
        }
      } catch (error) {
        if (isMounted) {
          clearTimeout(timeoutId);
          // 401 is expected when not authenticated - handle silently
          if (error?.status === 401) {
            console.log("AuthProvider: User not authenticated (401)");
            dispatch(logout());
          } else {
            // Log other errors (network issues, server errors, etc.)
            console.error("AuthProvider: Auth check failed:", error);
            dispatch(logout());
          }
          setAuthChecked(true);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
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
