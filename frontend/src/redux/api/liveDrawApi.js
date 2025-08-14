import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const liveDrawApi = createApi({
  reducerPath: "liveDrawApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["LiveDraw"],
  endpoints: (builder) => ({
    // Get performance metrics for live draw
    getPerformanceMetrics: builder.query({
      query: () => "admin/live-draw/metrics",
      providesTags: ["LiveDraw"],
    }),

    // Cleanup live draw data
    cleanupLiveDraw: builder.mutation({
      query: () => ({
        url: "admin/live-draw/cleanup",
        method: "POST",
      }),
      invalidatesTags: ["LiveDraw"],
    }),
  }),
});

export const { useGetPerformanceMetricsQuery, useCleanupLiveDrawMutation } =
  liveDrawApi;
