import type { ApiResponse } from "@/types/shared/api";
import type {
  AccessTokenValidationResponse,
  AuthenticatedUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/shared/auth";

import { baseApi } from "./base-api";

// API đăng nhập đi qua BFF để token được lưu ở cookie httpOnly.
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthenticatedUser>, LoginRequest>({
      query: (credentials) => ({
        url: "/api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<ApiResponse<AuthenticatedUser>, RegisterRequest>({
      query: (credentials) => ({
        url: "/api/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    checkToken: builder.query<ApiResponse<AccessTokenValidationResponse>, void>({
      query: () => ({
        url: "/api/auth/check_token",
        method: "GET",
      }),
    }),
    recoverSession: builder.mutation<ApiResponse<AccessTokenValidationResponse>, void>({
      query: () => ({ url: "/api/auth/session", method: "POST" }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCheckTokenQuery,
  useRecoverSessionMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = authApi;