"use client";

import { useCallback, useEffect, useRef, useState, useTransition, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { getSellerProductsUrl } from "@/lib/utils/seller-product.utils";
import type { SellerProductStatus } from "@/types/seller-product";

type SellerFilters = {
  categoryId?: number;
  status?: SellerProductStatus;
  keyword?: string;
};

// Đồng bộ bộ lọc đang dùng để các lần chọn liên tiếp không làm mất điều kiện trước.
export function useSellerProductFilters({ categoryId, status, keyword }: SellerFilters) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Lưu nội dung tìm kiếm đang nhập trước khi URL được cập nhật.
  const [keywordInput, setKeywordInput] = useState(keyword ?? "");
  // Lưu bộ lọc mới nhất để các thao tác liên tiếp dùng đúng điều kiện.
  const latestFilters = useRef<SellerFilters>({ categoryId, status, keyword });
  // Lưu lịch tìm kiếm để chỉ điều hướng sau khi người dùng ngừng nhập.
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Hủy lịch tìm kiếm khi rời trang.
  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  // Đổi URL, trở về trang đầu và giữ vị trí cuộn.
  const navigateWithFilters = useCallback((updates: SellerFilters) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = null;
    const nextFilters = { ...latestFilters.current, ...updates };
    latestFilters.current = nextFilters;
    startTransition(() => {
      router.push(getSellerProductsUrl(nextFilters.categoryId, nextFilters.status, 1, nextFilters.keyword), { scroll: false });
    });
  }, [router]);

  // Điều hướng liên kết trong transition và giữ bộ lọc vừa nhập.
  const handleLinkClick = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = null;
    const params = new URL(href, window.location.origin).searchParams;
    latestFilters.current = {
      categoryId: params.has("categoryId") ? Number(params.get("categoryId")) : undefined,
      status: (params.get("status") || undefined) as SellerProductStatus | undefined,
      keyword: params.get("keyword") || undefined,
    };
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }, [router]);

  // Lọc ngành hàng theo giá trị chọn trong dropdown.
  const handleCategoryChange = useCallback((value: string) => {
    const parsed = Number(value);
    navigateWithFilters({ categoryId: value && Number.isInteger(parsed) && parsed > 0 ? parsed : undefined });
  }, [navigateWithFilters]);

  // Lọc trạng thái theo giá trị chọn trong dropdown.
  const handleStatusChange = useCallback((value: string) => {
    navigateWithFilters({ status: value ? value as SellerProductStatus : undefined });
  }, [navigateWithFilters]);

  // Tìm theo tên sản phẩm sau khoảng nghỉ ngắn khi nhập.
  const handleKeywordChange = useCallback((value: string) => {
    setKeywordInput(value);
    const nextKeyword = value.trim() || undefined;
    latestFilters.current = { ...latestFilters.current, keyword: nextKeyword };
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      navigateWithFilters({ keyword: nextKeyword });
    }, 400);
  }, [navigateWithFilters]);

  return { keywordInput, handleKeywordChange, handleCategoryChange, handleStatusChange, handleLinkClick, isPending };
}