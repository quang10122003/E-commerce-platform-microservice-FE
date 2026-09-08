export type SuggestionTab = "all" | "sale" | "bestseller";

type FilterableProduct = {
  discount: number;
  isFlashSale?: boolean;
  sold: number;
};

// Lọc sản phẩm gợi ý theo tab đang được chọn.
export function filterSuggestedProducts<T extends FilterableProduct>(
  products: T[],
  activeTab: SuggestionTab
) {
  return products.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "sale") return product.discount >= 35 || product.isFlashSale === true;
    return product.sold >= 2000;
  });
}
