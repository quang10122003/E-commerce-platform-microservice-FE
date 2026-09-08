import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API gốc để đăng ký các endpoint RTK Query ở những bước tiếp theo.
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: () => ({}),
});
