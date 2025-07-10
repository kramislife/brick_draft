import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const collectionApi = createApi({
  reducerPath: "collectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1/",
    credentials: "include",
  }),
  tagTypes: ["Collections"],
  endpoints: (builder) => ({
    getCollections: builder.query({
      query: () => "collections",
      providesTags: ["Collections"],
    }),
    addCollection: builder.mutation({
      query: (data) => ({
        url: "admin/newCollection",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Collections"],
    }),
    updateCollection: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `admin/collections/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Collections"],
    }),
    deleteCollection: builder.mutation({
      query: ({ id }) => ({
        url: `admin/collection/${id}`,
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
