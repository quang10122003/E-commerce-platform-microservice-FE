import type { ProductCatalogItem } from "@/types/product";

export type SuggestionTab = "all" | "sale" | "bestseller";

// Danh sách ưu đãi cố định cho mock Home vì catalog chưa trả thông tin giảm giá.
const DEMO_SALE_PRODUCT_IDS = new Set([1, 3, 4, 5, 6, 8, 10]);

// Lọc sản phẩm gợi ý theo tab đang được chọn.
export function filterSuggestedProducts(
  products: ProductCatalogItem[],
  activeTab: SuggestionTab
) {
  return products.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "sale") return DEMO_SALE_PRODUCT_IDS.has(product.id);
    return product.totalSold >= 2000;
  });
}
