import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const colorApi = createApi({
  reducerPath: "colorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Colors"],
  endpoints: (builder) => ({
    getColors: builder.query({
      query: () => "colors",
      providesTags: ["Colors"],
    }),
    addColor: builder.mutation({
      query: (data) => ({
        url: "admin/color",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Colors"],
    }),
    updateColor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/color/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Colors"],
    }),
    deleteColor: builder.mutation({
      query: ({ id }) => ({
        url: `admin/color/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Colors"],
    }),
  }),
});

export const {
  useGetColorsQuery,
  useAddColorMutation,
  useUpdateColorMutation,
  useDeleteColorMutation,
} = colorApi; 