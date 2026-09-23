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

type GetDataForCreateProductResult =
  | {
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
