import type { ApiResponse } from "@/types/shared/api";
import type { ShopOverviewResponse } from "@/types/user/shop";
import type {
  ProductCatalogPage,
  ProductCatalogQuery,
  UserProductDetailParams,
  UserProductDetailResponse,
  ProductPriceRangeResponse,
  VariantSaleParams,
  VariantSaleResponse,
} from "@/types/user/product";
import type { ProductResponse, SellerProductListItem, ShopProductDetail } from "@/types/shop/product";

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
    // Lấy thông tin và số sản phẩm ACTIVE của shop qua BFF công khai.
    getShopOverview: builder.query<ApiResponse<ShopOverviewResponse>, number>({
      query: (shopId) => ({ url: `/api/products/shops/${shopId}/overview`, method: "GET" }),
      providesTags: ["Product"],
    }),

    // Đọc chi tiết công khai qua BFF, giữ wrapper ApiResponse từ gateway.
    getUserProductDetail: builder.query<ApiResponse<UserProductDetailResponse>, UserProductDetailParams>({
      query: ({ productId }) => ({ url: `/api/products/${productId}`, method: "GET" }),
      providesTags: ["Product"],
    }),

    // Lấy khoảng giá thật qua BFF, dùng chung cache theo sản phẩm.
    getProductPriceRange: builder.query<ApiResponse<ProductPriceRangeResponse>, UserProductDetailParams>({
      query: ({ productId }) => ({ url: `/api/products/${productId}/price-range`, method: "GET" }),
      providesTags: ["Product"],
    }),

    // Đọc giá gốc và sale của variant; không giữ cache sau khi ngừng theo dõi.
    getVariantSale: builder.query<ApiResponse<VariantSaleResponse>, VariantSaleParams>({
      query: ({ productId, variantId }) => ({
        url: `/api/products/${productId}/variants/${variantId}/sale`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["Product"],
    }),

    // Tạo sản phẩm mới gửi dữ liệu multipart/form-data đến backend qua BFF.
    createProduct: builder.mutation<ApiResponse<ProductResponse>, FormData>({
      query: (formData) => ({
        url: "/api/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // Đọc đủ ID thuộc tính, phân loại và ảnh để điền form chỉnh sửa.
    getShopProductDetail: builder.query<ApiResponse<ShopProductDetail>, number>({
      query: (productId) => ({ url: `/api/products/shop/${productId}`, method: "GET" }),
      providesTags: ["Product"],
    }),

    // Gửi JSON và ảnh mới qua BFF; không tự đặt Content-Type cho multipart.
    updateProduct: builder.mutation<ApiResponse<ShopProductDetail>, { productId: number; formData: FormData }>({
      query: ({ productId, formData }) => ({
        url: `/api/products/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    // Xóa sản phẩm; chấp nhận body rỗng khi backend trả 204 và dọn ảnh qua outbox.
    deleteProduct: builder.mutation<ApiResponse<null> | null, number>({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Xóa phân loại qua BFF; backend có thể xác nhận thành công bằng 204 không có body.
    deleteProductVariant: builder.mutation<ApiResponse<null> | null, { productId: number; variantId: number }>({
      query: ({ productId, variantId }) => ({
        url: `/api/products/${productId}/variants/${variantId}`,
        method: "DELETE",
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
  useGetShopOverviewQuery,
  useGetUserProductDetailQuery,
  useGetProductPriceRangeQuery,
  useGetVariantSaleQuery,
  useLazyGetVariantSaleQuery,
  useCreateProductMutation,
  useGetShopProductDetailQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductVariantMutation,
  useGetSellerProductsQuery,
  useLazyGetProductCatalogQuery,
} = productApi;
