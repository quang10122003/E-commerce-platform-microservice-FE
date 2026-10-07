import { API_ENDPOINTS } from "@/lib/constants";
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
        url: `/${API_ENDPOINTS.LOGIN}`,
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<ApiResponse<AuthenticatedUser>, RegisterRequest>({
      query: (credentials) => ({
        url: `/${API_ENDPOINTS.REGISTER}`,
        method: "POST",
        body: credentials,
      }),
    }),
    checkToken: builder.query<ApiResponse<AccessTokenValidationResponse>, void>({
      query: () => ({
        url: `/${API_ENDPOINTS.CHECK_TOKEN}`,
        method: "GET",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/${API_ENDPOINTS.LOGOUT}`,
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