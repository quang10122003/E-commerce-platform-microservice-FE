import type { UpdateCartQuantityRequest } from "@/types/cart";
import { baseApi } from "./base-api";

// Các thao tác cập nhật giỏ hàng qua BFF; GET được tải từ Server Component.
export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useUpdateCartQuantityMutation, useRemoveCartItemMutation } = cartApi;
