import type { ApiResponse } from "@/types/common";
import type {
  ProductCatalogPage,
  ProductCatalogQuery,
  ProductResponse,
  SellerProductListItem,
  ShopProductDetail,
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

    // Xóa sản phẩm của người bán; backend tiếp tục dọn ảnh qua outbox.
    deleteProduct: builder.mutation<ApiResponse<null>, number>({
      query: (productId) => ({
        url: `/api/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Xóa một phân loại thuộc sản phẩm của người bán qua BFF.
    deleteProductVariant: builder.mutation<ApiResponse<null>, { productId: number; variantId: number }>({
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
  useCreateProductMutation,
  useGetShopProductDetailQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteProductVariantMutation,
  useGetSellerProductsQuery,
  useLazyGetProductCatalogQuery,
} = productApi;
