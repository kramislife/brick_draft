import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "@/redux/features/authSlice";
import { authApi } from "@/redux/api/authApi";
import { collectionApi } from "@/redux/api/collectionApi";
import { colorApi } from "@/redux/api/colorApi";
import { partApi } from "@/redux/api/partItemApi";
import { lotteryApi } from "@/redux/api/lotteryApi";
import { paymentApi } from "@/redux/api/paymentApi";
import { draftResultApi } from "@/redux/api/draftResultApi";
import { liveDrawApi } from "@/redux/api/liveDrawApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [collectionApi.reducerPath]: collectionApi.reducer,
    [colorApi.reducerPath]: colorApi.reducer,
    [partApi.reducerPath]: partApi.reducer,
    [lotteryApi.reducerPath]: lotteryApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [draftResultApi.reducerPath]: draftResultApi.reducer,
    [liveDrawApi.reducerPath]: liveDrawApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      collectionApi.middleware,
      colorApi.middleware,
      partApi.middleware,
      lotteryApi.middleware,
      paymentApi.middleware,
      draftResultApi.middleware,
      liveDrawApi.middleware
    ),
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
