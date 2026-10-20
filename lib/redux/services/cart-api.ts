import type { AddCartItemArgs, AddCartItemResponse, UpdateCartQuantityRequest } from "@/types/user/cart";
import { baseApi } from "./base-api";
import type { ApiResponse } from "@/types/shared/api";

// Giỏ hàng đầy đủ được tải từ Server Component; count và thao tác cập nhật đi qua BFF.
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useAddCartItemMutation, useUpdateCartQuantityMutation, useRemoveCartItemMutation } = cartApi;