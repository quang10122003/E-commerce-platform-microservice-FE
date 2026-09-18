import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import {
  resolveProductCatalogField,
  type ResolvedFetchField,
} from "@/lib/utils";
import type {
  ProductBrandOption,
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
