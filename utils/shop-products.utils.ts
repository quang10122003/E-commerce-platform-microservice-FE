import { FIRST_PAGE, PAGE_SIZE } from "@/lib/constants";
import type { ShopProductQuery, ShopStorefrontTab } from "@/types/user/shop";

// Tab hợp lệ trên URL luôn được ưu tiên; URL lọc cũ chưa có tab thì mở danh sách sản phẩm.
export function getShopStorefrontTab(value: unknown, hasProductFilters = false): ShopStorefrontTab {
  if (value === "home" || value === "products" || value === "about") return value;
  return hasProductFilters ? "products" : "home";
}

// Chỉ đọc một giá trị nguyên dương hợp lệ từ query string.
function positiveQueryNumber(value: string | string[] | undefined): number | undefined {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return undefined;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : undefined;
}

// Chuẩn hóa bộ lọc theo contract BE và giới hạn result window 10.000 của Elasticsearch.
export function parseShopProductQuery(params: Record<string, string | string[] | undefined>): ShopProductQuery {
  const size = Math.min(positiveQueryNumber(params.size) ?? PAGE_SIZE.PRODUCT_SEARCH, 50);
  return {
    page: Math.min(positiveQueryNumber(params.page) ?? FIRST_PAGE, Math.floor(10_000 / size)),
    size,
    keyword: typeof params.keyword === "string" ? params.keyword.trim() || undefined : undefined,
    categoryId: positiveQueryNumber(params.categoryId),
    sort: params.sort === "NEWEST" || params.sort === "MOST_SOLD" ? params.sort : "RELEVANCE",
  };
}

// Giữ bộ lọc khi điều hướng, đồng thời mở đúng tab sản phẩm khi vào URL trực tiếp.
export function getShopProductsUrl(shopId: number, query: ShopProductQuery): string {
  const params = new URLSearchParams({ tab: "products" });
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.categoryId) params.set("categoryId", String(query.categoryId));
  if (query.sort !== "RELEVANCE") params.set("sort", query.sort);
  if (query.page > FIRST_PAGE) params.set("page", String(query.page));
  if (query.size !== PAGE_SIZE.PRODUCT_SEARCH) params.set("size", String(query.size));
  return `/shops/${shopId}?${params}`;
}
