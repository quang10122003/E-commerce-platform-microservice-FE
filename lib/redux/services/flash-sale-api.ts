import type { ApiResponse } from "@/types/shared/api";
import type { FlashSalePriceResponse, PreviewFlashSalePriceParams, RegisterFlashSaleItemParams, RemoveShopFlashSaleItemParams, UpdateShopFlashSaleItemParams, ShopFlashSaleItem, ShopFlashSaleItemsQuery } from "@/types/shop/flash-sale";
import { baseApi } from "./base-api";

// Preview là thao tác đọc dùng POST; RTK Query quản lý kết quả theo variant và mức giảm.
export const flashSaleApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Tìm phân loại đã đăng ký của shop qua BFF, không gọi backend trực tiếp.
    getShopFlashSaleItems: builder.query<ApiResponse<ShopFlashSaleItem[]>, ShopFlashSaleItemsQuery>({
      query: ({ campaignId, keyword }) => ({
        url: `/api/shop/flash-sales/drafts/${campaignId}/items`,
        params: keyword ? { keyword } : undefined,
      }),
      keepUnusedDataFor: 0,
      providesTags: (_result, _error, { campaignId }) => [{ type: "ShopFlashSaleItems", id: campaignId }],
    }),
    // Backend trả 204; chỉ tải lại danh sách của chương trình khi xóa thành công.
    removeShopFlashSaleItem: builder.mutation<void, RemoveShopFlashSaleItemParams>({
      query: ({ campaignId, itemId }) => ({
        url: `/api/shop/flash-sales/drafts/${campaignId}/items/${itemId}`,
        method: "DELETE",
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, error, { campaignId }) => error ? [] : [{ type: "ShopFlashSaleItems", id: campaignId }],
    }),
    // Cập nhật qua BFF; null ở discountPercent được giữ nguyên trong JSON gửi backend.
    updateShopFlashSaleItem: builder.mutation<void, UpdateShopFlashSaleItemParams>({
      query: ({ campaignId, itemId, request }) => ({
        url: `/api/shop/flash-sales/drafts/${campaignId}/items/${itemId}`,
        method: "PUT",
        body: request,
      }),
      transformResponse: () => undefined,
      invalidatesTags: (_result, error, { campaignId }) => error ? [] : [{ type: "ShopFlashSaleItems", id: campaignId }],
    }),
    // Đăng ký qua BFF; response 204 không có body để parse thành ApiResponse.
    registerFlashSaleItem: builder.mutation<void, RegisterFlashSaleItemParams>({
      query: ({ campaignId, request }) => ({
        url: `/api/shop/flash-sales/${campaignId}/items`,
        method: "POST",
        body: request,
      }),
      transformResponse: () => undefined,
    }),
    previewFlashSalePrice: builder.query<ApiResponse<FlashSalePriceResponse>, PreviewFlashSalePriceParams>({
      query: ({ variantId, discountPercent }) => ({
        url: `/api/shop/flash-sales/variants/${variantId}/preview-price`,
        method: "POST",
        body: { discountPercent },
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { usePreviewFlashSalePriceQuery, useRegisterFlashSaleItemMutation, useGetShopFlashSaleItemsQuery, useRemoveShopFlashSaleItemMutation, useUpdateShopFlashSaleItemMutation } = flashSaleApi;

