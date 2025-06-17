import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/redux/api/authApi";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login success
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          localStorage.setItem("token", payload.token);
        }
      )
      // Handle register success
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          localStorage.setItem("token", payload.token);
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
