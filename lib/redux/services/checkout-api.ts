import type { ApiResponse } from "@/types/shared/api";
import type { CheckoutItemsRequest, CheckoutItemsResponse, CheckoutQuoteResponse, CreateCheckoutRequest, CreateCheckoutResponse } from "@/types/user/checkout";
import { baseApi } from "./base-api";

// Hai thao tác đọc dùng POST qua BFF; serverFetch quản lý phiên đăng nhập.
export const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Không invalidate dữ liệu sản phẩm/báo giá khi gửi checkout đã được người mua xác nhận.
    createCheckout: builder.mutation<ApiResponse<CreateCheckoutResponse>, { body: CreateCheckoutRequest; idempotencyKey: string }>({
      query: ({ body, idempotencyKey }) => ({
        url: "/api/checkouts", method: "POST", body,
        headers: { "Idempotency-Key": idempotencyKey },
      }),
    }),
    getCheckout: builder.query<ApiResponse<CreateCheckoutResponse>, number>({
      query: (checkoutId) => ({ url: `/api/checkouts/${checkoutId}` }),
      keepUnusedDataFor: 0,
    }),
    getCheckoutItems: builder.query<ApiResponse<CheckoutItemsResponse>, CheckoutItemsRequest>({
      query: (body) => ({ url: "/api/checkouts/items", method: "POST", body }),
      keepUnusedDataFor: 0,
    }),
    getCheckoutQuote: builder.query<ApiResponse<CheckoutQuoteResponse>, CheckoutItemsRequest>({
      query: (body) => ({ url: "/api/checkouts/quote", method: "POST", body }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetCheckoutItemsQuery, useGetCheckoutQuoteQuery, useCreateCheckoutMutation, useLazyGetCheckoutQuery } = checkoutApi;
