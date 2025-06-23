import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "@/redux/features/authSlice";
import { authApi } from "@/redux/api/authApi";
import { collectionApi } from "@/redux/api/admin/collectionApi";
import { colorApi } from "@/redux/api/admin/colorApi";
import { partApi } from "@/redux/api/admin/partItemApi";
import { lotteryApi } from "@/redux/api/admin/lotteryApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [collectionApi.reducerPath]: collectionApi.reducer,
    [colorApi.reducerPath]: colorApi.reducer,
    [partApi.reducerPath]: partApi.reducer,
    [lotteryApi.reducerPath]: lotteryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      collectionApi.middleware,
      colorApi.middleware,
      partApi.middleware,
      lotteryApi.middleware
    ),
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
