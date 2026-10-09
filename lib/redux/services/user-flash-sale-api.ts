import { API_ENDPOINTS } from "@/lib/constants";
import type { ApiResponse } from "@/types/shared/api";
import type { FlashSaleCategory, UserFlashSaleResponse } from "@/types/user/flash-sale";
import { baseApi } from "./base-api";

// Đọc dữ liệu qua BFF; serverFetch giữ toàn bộ trách nhiệm xác thực.
export const userFlashSaleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserFlashSaleItems: builder.query<ApiResponse<UserFlashSaleResponse>, number | undefined>({
      query: (categoryId) => ({
        url: `/${API_ENDPOINTS.USER_FLASH_SALE_ITEMS}`,
        params: categoryId ? { categoryId } : undefined,
      }),
      keepUnusedDataFor: 0,
    }),
    getFlashSaleCategories: builder.query<ApiResponse<FlashSaleCategory[]>, void>({
      query: () => `/${API_ENDPOINTS.CATEGORIES}`,
    }),
  }),
});

export const { useGetUserFlashSaleItemsQuery, useGetFlashSaleCategoriesQuery } = userFlashSaleApi;
