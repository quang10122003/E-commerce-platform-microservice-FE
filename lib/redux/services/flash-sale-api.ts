import type { ApiResponse } from "@/types/shared/api";
import type { FlashSalePriceResponse, PreviewFlashSalePriceParams, RegisterFlashSaleItemParams } from "@/types/shop/flash-sale";
import { baseApi } from "./base-api";

// Preview là thao tác đọc dùng POST; RTK Query quản lý kết quả theo variant và mức giảm.
export const flashSaleApi = baseApi.injectEndpoints({
  endpoints: builder => ({
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

export const { usePreviewFlashSalePriceQuery, useRegisterFlashSaleItemMutation } = flashSaleApi;

