import type { ApiResponse } from "@/types/common";
import type {
  AccessTokenValidationResponse,
  AuthenticatedUser,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";
import { AUTH_ENDPOINTS } from "@/lib/api/constants";

import { baseApi } from "./base-api";

// API đăng nhập đi qua BFF để token được lưu ở cookie httpOnly.
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthenticatedUser>, LoginRequest>({
      query: (credentials) => ({
        url: `/${AUTH_ENDPOINTS.LOGIN}`,
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<ApiResponse<AuthenticatedUser>, RegisterRequest>({
      query: (credentials) => ({
        url: `/${AUTH_ENDPOINTS.REGISTER}`,
        method: "POST",
        body: credentials,
      }),
    }),
    checkToken: builder.query<ApiResponse<AccessTokenValidationResponse>, void>({
      query: () => ({
        url: `/${AUTH_ENDPOINTS.CHECK_TOKEN}`,
        method: "GET",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/${AUTH_ENDPOINTS.LOGOUT}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCheckTokenQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = authApi;
