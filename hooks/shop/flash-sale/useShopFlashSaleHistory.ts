"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { getShopCompletedFlashSalesUrl, toDateTimeIsoValue } from "@/lib/utils/flash-sale.utils";
import { useMounted } from "@/lib/hooks";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";
import type { ShopCompletedFlashSaleQuery } from "@/types/shop/flash-sale";

// Quản lý bộ lọc lịch sử Flash Sale qua query URL để Server Component tải lại dữ liệu.
export function useShopFlashSaleHistory(query: ShopCompletedFlashSaleQuery, immediate = true) {
  const router = useRouter();
  const mounted = useMounted();
  const [isPending, startTransition] = useTransition();
  // Lưu lỗi khoảng thời gian trước khi áp dụng bộ lọc.
  const [error, setError] = useState("");
  // Giữ từ khóa đang nhập trong khi chờ điều hướng tìm kiếm.
  const [keyword, setKeyword] = useState(query.keyword ?? "");
  // Giữ nội dung đang nhập nếu kết quả của request trước trả về chậm.
  const [previousKeyword, setPreviousKeyword] = useState(query.keyword);
  if (previousKeyword !== query.keyword) {
    setPreviousKeyword(query.keyword);
    if (keyword.trim() === (previousKeyword ?? "")) setKeyword(query.keyword ?? "");
  }
  // Lưu hai mốc ngày theo định dạng input datetime-local.
  const [fromDate, setFromDate] = useState(toLocalDateTimeInput(query.from));
  const [toDate, setToDate] = useState(toLocalDateTimeInput(query.to));
  // Đánh dấu bộ lọc nhanh hoặc khoảng ngày tùy chỉnh hiện tại.
  const [quickFilter, setQuickFilter] = useState(query.quickFilter ?? (query.from || query.to ? "custom" : "all"));
  const latestQuery = useRef<ShopCompletedFlashSaleQuery>(query);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Đồng bộ từ khóa khi Back/Forward, không ghi đè từ khóa đang chờ debounce.
  useEffect(() => {
    if (keyword.trim() === (query.keyword ?? "")) {
      latestQuery.current = { ...latestQuery.current, keyword: query.keyword };
    }
  }, [query.keyword, keyword]);

  // Giữ trang hiện tại đúng với URL khi View không còn remount theo phân trang.
  useEffect(() => {
    latestQuery.current = { ...latestQuery.current, page: query.page };
  }, [query.page]);

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  const navigateWithFilters = useCallback((updates: Partial<ShopCompletedFlashSaleQuery>, shouldNavigate = immediate) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = null;
    const nextQuery = { ...latestQuery.current, ...updates };
    latestQuery.current = nextQuery;
    setError("");
    if (!shouldNavigate) return;
    startTransition(() => router.push(getShopCompletedFlashSalesUrl(nextQuery), { scroll: false }));
  }, [router, immediate]);

  // Áp dụng khoảng ngày hoặc bộ lọc nhanh khi người dùng xác nhận.
  const applyFilters = useCallback((onApplied?: () => void) => {
    const from = fromDate ? toDateTimeIsoValue(fromDate) : undefined;
    const to = toDate ? toDateTimeIsoValue(toDate) : undefined;
    if ((fromDate && !from) || (toDate && !to)) {
      setError("Thời gian không hợp lệ.");
      return;
    }
    if (from && to && Date.parse(from) > Date.parse(to)) {
      setError("Thời điểm kết thúc phải lớn hơn hoặc bằng thời điểm bắt đầu.");
      return;
    }
    navigateWithFilters({ from, to, quickFilter, page: 1 }, true);
    onApplied?.();
  }, [fromDate, toDate, quickFilter, navigateWithFilters]);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
    const nextKeyword = value.trim() || undefined;
    latestQuery.current = { ...latestQuery.current, keyword: nextKeyword, page: 1 };
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (immediate) searchTimer.current = setTimeout(() => navigateWithFilters({ keyword: nextKeyword, page: 1 }), SEARCH_DEBOUNCE_MS);
  }, [navigateWithFilters, immediate]);

  const handleFromDateChange = useCallback((value: string) => {
    setFromDate(value);
    setQuickFilter("custom");
    setError("");
  }, []);

  const handleToDateChange = useCallback((value: string) => {
    setToDate(value);
    setQuickFilter("custom");
    setError("");
  }, []);

  const handleQuickFilterSelect = useCallback((preset: string) => {
    setQuickFilter(preset);
    if (preset === "all") {
      setFromDate("");
      setToDate("");
      setError("");
      return;
    }

    const now = new Date();
    const from = new Date(now);
    if (preset === "7d") from.setDate(now.getDate() - 7);
    else if (preset === "30d") from.setDate(now.getDate() - 30);
    else if (preset === "this_month") {
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
    }
    else return;

    setFromDate(toLocalDateTimeInput(from.toISOString()));
    setToDate(toLocalDateTimeInput(now.toISOString()));
    setError("");
  }, []);

  const handlePageChange = useCallback((page: number) => {
    navigateWithFilters({ page });
  }, [navigateWithFilters]);

  return {
    keyword,
    fromDate: mounted ? fromDate : "",
    toDate: mounted ? toDate : "",
    quickFilter,
    isPending,
    error,
    applyFilters,
    handleKeywordChange,
    handleFromDateChange,
    handleToDateChange,
    handleQuickFilterSelect,
    handlePageChange,
  };
}
