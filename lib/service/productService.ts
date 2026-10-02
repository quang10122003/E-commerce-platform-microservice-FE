import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import {
  resolveProductCatalogField,
  type ResolvedFetchField,
} from "@/lib/utils";
import type {
  ProductBrandOption,
  ProductCatalogPage,
  ProductCatalogQuery,
  ProductCategoryOption,
} from "@/types/product";
import type { SellerProductPage, SellerProductQuery } from "@/types/shop-product";

type GetDataForCreateProductResult = {
  category: ResolvedFetchField<ProductCategoryOption[]>;
  brand: ResolvedFetchField<ProductBrandOption[]>;
};

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

  if (result.status < 200 || result.status >= 300 || !result.payload.success || !result.payload.data) {
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

  if (result.status < 200 || result.status >= 300 || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải danh sách sản phẩm.");
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
    result.status < 200 ||
    result.status >= 300 ||
    !result.payload.success ||
    !result.payload.data
  ) {
    throw new Error("Không thể tải kết quả tìm kiếm.");
  }

  return result.payload.data;
}
