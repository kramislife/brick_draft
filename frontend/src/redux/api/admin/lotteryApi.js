import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lotteryApi = createApi({
  reducerPath: "lotteryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Lotteries"],
  endpoints: (builder) => ({
    getLotteries: builder.query({
      query: () => "lotteries",
      providesTags: ["Lotteries"],
    }),
    addLottery: builder.mutation({
      query: (data) => ({
        url: "admin/lotteries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Lotteries"],
    }),
    updateLottery: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/lotteries/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Lotteries"],
    }),
    deleteLottery: builder.mutation({
      query: ({ id }) => ({
        url: `admin/lotteries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Lotteries"],
    }),
  }),
});

export const {
  useGetLotteriesQuery,
  useAddLotteryMutation,
  useUpdateLotteryMutation,
  useDeleteLotteryMutation,
} = lotteryApi;
