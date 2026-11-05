import { HTTP_STATUS } from "@/lib/constants";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { clearUser, setUser } from "@/lib/redux/slices/auth-slice";
import { isUserLocked } from "@/lib/auth/session-recovery-error";
import type { ApiResponse } from "@/types/shared/api";
import type { AccessTokenValidationResponse } from "@/types/shared/auth";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/",
});

// Đồng bộ user sau refresh và kết thúc phiên khi backend xác nhận tài khoản bị khóa.
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  let sessionError = result.error;
  let locked = isUserLocked(result.error && "data" in result.error ? result.error.data : result.data);

  // BFF đã refresh; chỉ đọc lại phiên, không retry request nghiệp vụ ở client.
  if (!locked && result.error?.status !== HTTP_STATUS.UNAUTHORIZED
    && result.meta?.response?.headers.get("X-Session-Refreshed") === "1") {
    const session = await rawBaseQuery({ url: "/api/auth/session", method: "POST" }, api, extraOptions);
    const payload = session.data as ApiResponse<AccessTokenValidationResponse> | undefined;
    if (payload?.success && payload.data) api.dispatch(setUser(payload.data));
    if (session.error) sessionError = session.error;
    locked = isUserLocked(session.error && "data" in session.error ? session.error.data : session.data);
  }

  if (locked || sessionError?.status === HTTP_STATUS.UNAUTHORIZED) {
    api.dispatch(clearUser());
    if (locked) {
      api.dispatch(baseApi.util.resetApiState());
      if (typeof window !== "undefined") window.location.replace("/403?reason=user-locked");
    }
  }

  return result;
};

// API gốc để đăng ký các endpoint RTK Query với đường dẫn đầy đủ.
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: ["Product", "Auth", "User", "Cart", "ShopFlashSaleItems"],
  endpoints: () => ({}),
});
