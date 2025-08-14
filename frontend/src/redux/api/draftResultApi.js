import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const draftResultApi = createApi({
  reducerPath: "draftResultApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["DraftResults"],
  endpoints: (builder) => ({
    getAllCompletedDraftResults: builder.query({
      query: (params) => ({
        url: "draft-results",
        params,
      }),
      providesTags: ["DraftResults"],
    }),
    getDraftResultById: builder.query({
      query: (id) => `draft-results/${id}`,
      providesTags: ["DraftResults"],
    }),
    getUserDraftResults: builder.query({
      query: (params) => ({
        url: "user/draft-results",
        params,
      }),
      providesTags: ["DraftResults"],
    }),
  }),
});

export const {
  useGetAllCompletedDraftResultsQuery,
  useGetDraftResultByIdQuery,
  useGetUserDraftResultsQuery,
} = draftResultApi;
