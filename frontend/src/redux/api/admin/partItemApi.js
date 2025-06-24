import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const partApi = createApi({
  reducerPath: "partApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Parts"],
  endpoints: (builder) => ({
    getParts: builder.query({
      query: () => "parts",
      providesTags: ["Parts"],
    }),
    addPart: builder.mutation({
      query: (data) => ({
        url: "admin/newPart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Parts"],
    }),
    updatePart: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/parts/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Parts"],
    }),
    deletePart: builder.mutation({
      query: ({ id }) => ({
        url: `admin/parts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Parts"],
    }),
  }),
});

export const {
  useGetPartsQuery,
  useAddPartMutation,
  useUpdatePartMutation,
  useDeletePartMutation,
} = partApi;
