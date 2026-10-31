import type { AddCartItemArgs, AddCartItemResponse, UpdateCartQuantityRequest, CartQuoteRequest, CartQuoteResponse } from "@/types/user/cart";
import { baseApi } from "./base-api";
import type { ApiResponse } from "@/types/shared/api";

type CartQuoteQuery = {
  request: CartQuoteRequest;
  // Đổi cache key khi giá sale hết hạn; không gửi giá FE lên backend.
  pricingKey: string;
};

// Giỏ hàng đầy đủ được tải từ Server Component; count và thao tác cập nhật đi qua BFF.
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Quote là thao tác đọc dùng POST; mỗi lựa chọn có kết quả riêng để tránh dùng giá cũ.
    getCartQuote: builder.query<ApiResponse<CartQuoteResponse>, CartQuoteQuery>({
      query: ({ request }) => ({ url: "/api/cart/quote", method: "POST", body: request }),
      keepUnusedDataFor: 0,
    }),
    // Trigger GET mỗi lần đồng bộ; navbar dùng slice thay vì query cache.
    getCartItemCount: builder.mutation<ApiResponse<number>, void>({
      query: () => ({ url: "/api/cart/count", method: "GET" }),
    }),
    // Thêm số lượng vào variant trong giỏ của người dùng hiện tại.
    addCartItem: builder.mutation<AddCartItemResponse, AddCartItemArgs>({
      query: ({ productVariantId, request }) => ({
        url: "/api/cart",
        method: "POST",
        params: { productVariantId },
        body: request,
      }),
      invalidatesTags: (result, error) => !error && (!result || result.success) ? ["Cart"] : [],
    }),
    updateCartQuantity: builder.mutation<void, UpdateCartQuantityRequest>({
      query: ({ productVariantId, quantity }) => ({
        url: "/api/cart",
        method: "PUT",
        params: { productVariantId, quantity },
      }),
    }),
    removeCartItem: builder.mutation<void, number>({
      query: (productVariantId) => ({
        url: "/api/cart",
        method: "DELETE",
        params: { productVariantId },
      }),
    }),
  }),
});

export const { useGetCartQuoteQuery, useAddCartItemMutation, useUpdateCartQuantityMutation, useRemoveCartItemMutation } = cartApi;
