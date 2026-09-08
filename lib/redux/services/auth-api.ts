import type { ApiResponse } from "@/types/common";
import type {
  AccessTokenValidationResponse,
  AuthenticatedUser,
  LoginRequest,
} from "@/types/auth";

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
    checkToken: builder.query<ApiResponse<AccessTokenValidationResponse>, void>({
      query: () => ({
        url: "/api/auth/check_token",
        method: "GET",
      }),
    }),
  }),
});

export const { useCheckTokenQuery, useLoginMutation } = authApi;
