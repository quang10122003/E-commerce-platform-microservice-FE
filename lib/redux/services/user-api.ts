import type { ApiResponse } from "@/types/shared/api";
import type { ChangePasswordForm, UpdateProfileForm, UserProfile } from "@/types/user/profile";

import type { SellerShopProfile, UpdateShopProfileForm } from "@/types/shop/profile";

import { baseApi } from "./base-api";

// API hồ sơ của tài khoản đang đăng nhập, đi qua BFF.
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Body là FormData có part "image".
    uploadAvatar: builder.mutation<ApiResponse<{ avatarUrl: string }>, FormData>({
      query: (formData) => ({ url: "/api/users/me/avatar", method: "PUT", body: formData }),
    }),
    // Chỉ tài khoản shop; body là FormData có part "image".
    uploadShopLogo: builder.mutation<ApiResponse<{ shopLogoUrl: string }>, FormData>({
      query: (formData) => ({ url: "/api/users/me/shop-logo", method: "PUT", body: formData }),
    }),
    // Chỉ tài khoản shop; gửi toàn bộ các trường hồ sơ shop được phép sửa.
    updateShopProfile: builder.mutation<ApiResponse<SellerShopProfile>, UpdateShopProfileForm>({
      query: (body) => ({ url: "/api/users/me/shop", method: "PUT", body }),
    }),
    // Gửi toàn bộ các trường được phép sửa trong một request.
    updateProfile: builder.mutation<ApiResponse<UserProfile>, UpdateProfileForm>({
      query: (body) => ({ url: "/api/users/me", method: "PUT", body }),
    }),
    // Thành công BE trả 204 không có body.
    changePassword: builder.mutation<void, ChangePasswordForm>({
      query: (body) => ({ url: "/api/users/me/password", method: "PUT", body }),
    }),
  }),
});

export const {
  useUploadAvatarMutation, useUploadShopLogoMutation, useUpdateShopProfileMutation, useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;
