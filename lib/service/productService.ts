import { HTTP_STATUS } from "@/lib/constants";
import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import { resolveProductCatalogField } from "@/lib/utils";
import type { ResolvedFetchField } from "@/types/shared/api";
import type { ProductBrandOption } from "@/types/shared/product";
import type { ProductCatalogPage, ProductCatalogQuery, ProductRecommendationsPage, ProductRecommendationsPageQuery } from "@/types/user/product";
import type { ProductCategoryOption, SellerProductOverview, SellerProductPage, SellerProductQuery } from "@/types/shop/product";

type GetDataForCreateProductResult = {
  category: ResolvedFetchField<ProductCategoryOption[]>;
  brand: ResolvedFetchField<ProductBrandOption[]>;
};

// Chỉ đưa thông báo lỗi API sản phẩm ra giao diện, giữ lỗi kỹ thuật ở fallback chung.
export class SellerProductsApiError extends Error { }

export async function getProductRecommendations(query: ProductRecommendationsPageQuery): Promise<ProductRecommendationsPage> {
  const params = new URLSearchParams({ page: String(query.page), size: String(query.size) });
  const result = await serverFetch<ProductRecommendationsPage>(`api/products/recommendations?${params}`, {
    method: "GET",
    cache: "no-store",
  });
  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
    || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải sản phẩm gợi ý.");
  }
  return result.payload.data;
}

// Lấy dữ liệu category và brand song song cho form tạo sản phẩm trên Server Component.
export async function GetDataForCareteProduct(): Promise<GetDataForCreateProductResult> {
  const [categoriesResult, brandsResult] = await Promise.allSettled([
    serverFetch<ProductCategoryOption[]>("api/categories", {
      method: "GET",
      cache: "no-store",
    }),
    serverFetch<ProductBrandOption[]>("api/brands", {
      method: "GET",
      cache: "no-store",
    }),
  ]);

  return {
    category: resolveProductCatalogField(categoriesResult),
    brand: resolveProductCatalogField(brandsResult),
  };
}

// Lấy danh mục ngành hàng để người bán lọc danh sách sản phẩm.
export async function getSellerProductCategories(): Promise<ProductCategoryOption[]> {
  const result = await serverFetch<ProductCategoryOption[]>("api/categories", {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải danh mục ngành hàng.");
  }

  return result.payload.data;
}

// Lấy một trang sản phẩm của người bán theo bộ lọc trên URL.
export async function getSellerProducts(query: SellerProductQuery): Promise<SellerProductPage> {
  const params = new URLSearchParams({ page: String(query.page), size: String(query.size) });
  if (query.categoryId) params.set("categoryId", String(query.categoryId));
  if (query.status) params.set("status", query.status);
  if (query.keyword) params.set("keyword", query.keyword);

  const result = await serverFetch<SellerProductPage>(`api/products/shop?${params}`, {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new SellerProductsApiError(result.payload.error?.message || result.payload.message || "Không thể tải danh sách sản phẩm.");
  }

  return result.payload.data;
}

// Lấy số lượng sản phẩm của người bán theo từng trạng thái.
export async function getSellerProductOverview(): Promise<SellerProductOverview> {
  const result = await serverFetch<SellerProductOverview>("api/products/shop/overview", {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
    || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải tổng quan sản phẩm.");
  }

  return result.payload.data;
}

// Lấy batch đầu của trang tìm kiếm từ Server Component.
export async function getProductCatalog(
  query: ProductCatalogQuery,
): Promise<ProductCatalogPage> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, String(item)));
      } else {
        params.set(key, String(value));
      }
    }
  });

  const result = await serverFetch<ProductCatalogPage>(
    `api/products?${params.toString()}`,
    { method: "GET", cache: "no-store" },
  );

  if (
    result.status < HTTP_STATUS.SUCCESS_MIN ||
    result.status >= HTTP_STATUS.SUCCESS_LIMIT ||
    !result.payload.success ||
    !result.payload.data
  ) {
    throw new Error("Không thể tải kết quả tìm kiếm.");
  }

  return result.payload.data;
}
