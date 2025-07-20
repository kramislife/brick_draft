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
    getAllTickets: builder.query({
      query: () => "/admin/tickets",
      providesTags: ["Payment"],
    }),
    // Priority List
    getPriorityList: builder.query({
      query: ({ purchaseId, params }) => ({
        url: `/priority-list/${purchaseId}`,
        params,
      }),
      providesTags: ["Payment"],
    }),
    createPriorityList: builder.mutation({
      query: ({ purchaseId, priorityItems }) => ({
        url: `/priority-list/${purchaseId}`,
        method: "POST",
        body: { priorityItems },
      }),
      invalidatesTags: ["Payment"],
    }),
    updatePriorityList: builder.mutation({
      query: ({ purchaseId, priorityItems }) => ({
        url: `/priority-list/${purchaseId}`,
        method: "PUT",
        body: { priorityItems },
      }),
      invalidatesTags: ["Payment"],
    }),
    deletePriorityList: builder.mutation({
      query: ({ purchaseId }) => ({
        url: `/priority-list/${purchaseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetPaymentSuccessDetailsQuery,
  useGetUserPurchasesQuery,
  useGetAllTicketsQuery,
  useGetPriorityListQuery,
  useCreatePriorityListMutation,
  useUpdatePriorityListMutation,
  useDeletePriorityListMutation,
} = paymentApi;
