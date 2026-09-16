import type { ApiResponse } from "@/types/common";
import type { ProductResponse, SellerProductListItem } from "@/types/product";

import { baseApi } from "./base-api";

// Quản lý các endpoint API sản phẩm cho Kênh Người Bán và Người Mua.
export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Tạo sản phẩm mới gửi dữ liệu multipart/form-data đến backend qua BFF.
    createProduct: builder.mutation<ApiResponse<ProductResponse>, FormData>({
      query: (formData) => ({
        url: "/api/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // Lấy danh sách sản phẩm thuộc quản lý của gian hàng người bán.
    getSellerProducts: builder.query<ApiResponse<SellerProductListItem[]>, void>({
      query: () => ({
        url: "/api/products/seller",
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetSellerProductsQuery,
} = productApi;

