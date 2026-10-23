"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { getShopProductsUrl, parseShopProductQuery } from "@/utils/shop-products.utils";
import type { ShopProductQuery } from "@/types/user/shop";

// Tìm tức thời theo flow debounce hiện có, không cần form submit hoặc validation.
export function useShopProductSearch(shopId: number, query: ShopProductQuery) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Giữ bản nhập mới nhất, không để response của lượt tìm trước ghi đè khi đang gõ tiếp.
  const [keywordInput, setKeywordInput] = useState(query.keyword ?? "");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hủy lịch cũ và đồng bộ ô nhập khi người dùng quay lại URL bằng Back/Forward.
  useEffect(() => {
    const restoreKeyword = () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      setKeywordInput(new URL(window.location.href).searchParams.get("keyword") ?? "");
    };
    window.addEventListener("popstate", restoreKeyword);
    return () => {
      window.removeEventListener("popstate", restoreKeyword);
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [shopId]);

  // Chỉ điều hướng sau khi ngừng nhập; lấy bộ lọc từ URL mới nhất để không ghi đè thao tác khác.
  const handleKeywordChange = useCallback((value: string) => {
    setKeywordInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      searchTimer.current = null;
      const currentQuery = parseShopProductQuery(Object.fromEntries(new URL(window.location.href).searchParams));
      const keyword = value.trim() || undefined;
      if (keyword === currentQuery.keyword) return;
      startTransition(() => router.replace(getShopProductsUrl(shopId, { ...currentQuery, keyword, page: 1 }), { scroll: false }));
    }, SEARCH_DEBOUNCE_MS);
  }, [router, shopId]);

  return { keywordInput, handleKeywordChange, isPending };
}
