import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const collectionApi = createApi({
  reducerPath: "collectionApi",
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
  tagTypes: ["Collections"],
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: () => "collections",
      providesTags: ["Collections"],
    }),
    addCollection: builder.mutation({
      query: (data) => ({
        url: "collections",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Collections"],
    }),
    updateCollection: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `collections/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Collections"],
    }),
    deleteCollection: builder.mutation({
      query: ({ id }) => ({
        url: `collections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Collections"],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useAddCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionApi;
