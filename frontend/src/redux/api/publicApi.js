import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const publicApi = createApi({
  reducerPath: "publicApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Public"],
  endpoints: (builder) => ({
    getPublicLotteries: builder.query({
      query: () => "lotteries",
      providesTags: ["PublicLotteries"],
    }),
    getPublicLotteryById: builder.query({
      query: (id) => `lotteries/${id}`,
      providesTags: ["PublicLotteries"],
    }),
    getPublicCollections: builder.query({
      query: () => "collections",
      providesTags: ["PublicCollections"],
    }),
    getLotteryPartsById: builder.query({
      query: ({ id, params }) => ({
        url: `lotteries/${id}/parts`,
        params,
      }),
      providesTags: ["PublicLotteries"],
    }),
  }),
});

export const {
  useGetPublicLotteriesQuery,
  useGetPublicLotteryByIdQuery,
  useGetPublicCollectionsQuery,
  useGetLotteryPartsByIdQuery,
} = publicApi;
