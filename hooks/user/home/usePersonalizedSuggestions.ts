import { SUGGESTIONS_INITIAL_COUNT, SUGGESTIONS_LOAD_MORE_COUNT, SUGGESTIONS_LOAD_MORE_DELAY_MS } from "@/lib/constants";
import { useMemo, useState } from "react";
import { filterSuggestedProducts, type SuggestionTab } from "@/utils/suggestions.utils";
import type { ProductCatalogItem } from "@/types/user/product";

// Quản lý tab, phân trang và trạng thái tải thêm của danh sách gợi ý.
export function usePersonalizedSuggestions(products: ProductCatalogItem[]) {
  const [activeTab, setActiveTab] = useState<SuggestionTab>("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(SUGGESTIONS_INITIAL_COUNT);

  const filteredProducts = useMemo(() => {
    return filterSuggestedProducts(products, activeTab);
  }, [activeTab, products]);

  // Tăng số sản phẩm hiển thị sau khi hoàn tất trạng thái tải giả lập.
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((previous) => previous + SUGGESTIONS_LOAD_MORE_COUNT);
      setIsLoadingMore(false);
    }, SUGGESTIONS_LOAD_MORE_DELAY_MS);
  };

  return {
    activeTab,
    filteredProducts,
    handleLoadMore,
    isLoadingMore,
    setActiveTab,
    visibleCount,
  };
}
