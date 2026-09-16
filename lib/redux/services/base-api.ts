import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { clearUser } from "@/lib/redux/slices/auth-slice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/",
});

// Xóa user Redux khi request qua BFF xác nhận phiên không còn hợp lệ (401 Unauthorized).
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    api.dispatch(clearUser());
  }

  return result;
};

// API gốc để đăng ký các endpoint RTK Query với đường dẫn đầy đủ.
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery,
  tagTypes: ["Product", "Auth", "User"],
  endpoints: () => ({}),
});
