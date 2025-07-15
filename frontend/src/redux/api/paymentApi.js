import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["Payment", "UserPurchases"],
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "/checkout-session",
        method: "POST",
        body: data,
      }),
    }),
    getPaymentSuccessDetails: builder.query({
      query: (purchaseId) => `/ticket/${purchaseId}`,
      providesTags: ["Payment"],
    }),
    getUserPurchases: builder.query({
      query: () => "/user/purchases",
      providesTags: ["UserPurchases"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPaymentSuccessDetailsQuery,
  useGetUserPurchasesQuery,
} = paymentApi;
