"use client";

import { useSearchParams } from "next/navigation";
import type { ShopStorefrontTab } from "@/types/user/shop";
import { getShopStorefrontTab } from "@/utils/shop-products.utils";

// Lưu tab vào URL bằng native history để refresh giữ đúng tab mà không tải lại các API của trang.
export function useShopStorefrontTabs(initialTab: ShopStorefrontTab) {
  const searchParams = useSearchParams();
  const activeTab = getShopStorefrontTab(searchParams?.get("tab") ?? initialTab);

  // Chỉ thay tab, giữ nguyên bộ lọc, phân trang và vị trí cuộn hiện tại.
  function selectTab(tab: ShopStorefrontTab) {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return { activeTab, selectTab };
}
