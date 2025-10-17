import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include", // Include cookies
  }),

  tagTypes: ["User", "UserAddresses"],
  endpoints: (builder) => ({
    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    // Register user
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    // Logout user
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // Get current user profile
    getCurrentUser: builder.query({
      query: () => "/profile/me",
      providesTags: ["User"],
      // Don't retry on 401 errors as they are expected when not authenticated
      retry: (failureCount, error) => {
        if (error?.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    }),

    // Update user profile
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/me/profile/updateProfile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["User"],
    }),

    // Update password
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/me/profile/updatePassword",
        method: "PUT",
        body: passwordData,
      }),
    }),

    // Update profile picture
    updateAvatar: builder.mutation({
      query: (avatarData) => ({
        url: "/me/profile/updateAvatar",
        method: "PUT",
        body: avatarData,
      }),
      invalidatesTags: ["User"],
    }),

    // Forgot password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/password/forgot",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation({
      query: ({ token, passwordData }) => ({
        url: `/password/reset/${token}`,
        method: "PUT",
        body: passwordData,
      }),
    }),

    // Verify user
    verifyUser: builder.mutation({
      query: (token) => ({
        url: `/verify_user/${token}`,
        method: "GET",
      }),
    }),

    // Contact us
    contactUs: builder.mutation({
      query: (contactData) => ({
        url: "/contact",
        method: "POST",
        body: contactData,
      }),
    }),

    // Get reCAPTCHA site key
    getRecaptchaSiteKey: builder.query({
      query: () => "/recaptcha/site-key",
    }),

    // Get addresses
    getAddresses: builder.query({
      query: () => "/profile/addresses",
      providesTags: ["UserAddresses"],
    }),
    // Add address
    addAddress: builder.mutation({
      query: (data) => ({
        url: "/profile/addresses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserAddresses"],
    }),
    // Update address
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/profile/addresses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserAddresses"],
    }),
    // Delete address
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/profile/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["UserAddresses"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateAvatarMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyUserMutation,
  useContactUsMutation,
  useGetRecaptchaSiteKeyQuery,
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = authApi;
