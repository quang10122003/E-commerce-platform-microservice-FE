"use client";

import { useMemo, useState } from "react";
import { filterSuggestedProducts, type SuggestionTab } from "@/utils/suggestions.utils";

// Quản lý tab, phân trang và trạng thái tải thêm của danh sách gợi ý.
export function usePersonalizedSuggestions<T extends { discount: number; isFlashSale?: boolean; sold: number }>(products: T[]) {
  const [activeTab, setActiveTab] = useState<SuggestionTab>("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredProducts = useMemo(() => {
    return filterSuggestedProducts(products, activeTab);
  }, [activeTab, products]);

  // Tăng số sản phẩm hiển thị sau khi hoàn tất trạng thái tải giả lập.
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((previous) => previous + 5);
      setIsLoadingMore(false);
    }, 600);
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
