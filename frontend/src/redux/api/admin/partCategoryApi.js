import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const partCategoryApi = createApi({
  reducerPath: "partCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "api/v1/",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["PartCategories"],
  endpoints: (builder) => ({
    getPartCategories: builder.query({
      query: () => "part-categories",
      providesTags: ["PartCategories"],
    }),
    addPartCategory: builder.mutation({
      query: (data) => ({
        url: "part-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PartCategories"],
    }),
    updatePartCategory: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `part-categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PartCategories"],
    }),
    deletePartCategory: builder.mutation({
      query: ({ id }) => ({
        url: `part-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PartCategories"],
    }),
  }),
});

export const {
  useGetPartCategoriesQuery,
  useAddPartCategoryMutation,
  useUpdatePartCategoryMutation,
  useDeletePartCategoryMutation,
} = partCategoryApi;
