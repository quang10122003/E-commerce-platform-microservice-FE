import type { ApiResponse } from "@/types/common";
import type {
  ProductCatalogPage,
  ProductCatalogQuery,
  ProductResponse,
  SellerProductListItem,
} from "@/types/product";

import { baseApi } from "./base-api";

// Chuyển query catalog thành chuỗi URL, giữ nguyên nhiều tham số brandIds.
function buildProductCatalogQuery(query: ProductCatalogQuery): string {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.set(key, String(value));
  });

  return searchParams.toString();
}

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

    // Lấy từng batch catalog công khai qua BFF để phục vụ infinity scroll.
    getProductCatalog: builder.query<ProductCatalogPage, ProductCatalogQuery>({
      query: (params) => {
        const queryString = buildProductCatalogQuery(params);
        return {
        url: queryString ? `/api/products?${queryString}` : "/api/products",
        method: "GET",
        };
      },
      transformResponse: (response: ApiResponse<ProductCatalogPage>) =>
        response.data ?? {
          items: [],
          nextCursor: null,
          hasNext: false,
          brands: [],
        },
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetSellerProductsQuery,
  useLazyGetProductCatalogQuery,
} = productApi;
