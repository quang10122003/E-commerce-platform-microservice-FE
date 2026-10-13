"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TIME } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import { getSaleCountdown, selectSaleItems } from "@/lib/utils/user-flash-sale.utils";
import type { FlashSaleSort, UserFlashSaleInitialData } from "@/types/user/flash-sale";

// Điều phối URL, bộ lọc frontend và polling dữ liệu qua Server Component.
export function useUserFlashSale(initialData: UserFlashSaleInitialData) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const isCheckingAuth = useAppSelector((state) => state.auth.isCheckingAuth);
  // Theo dõi điều hướng danh mục; polling nền không bật loading toàn trang.
  const [isNavigating, startNavigation] = useTransition();
  // Theo dõi refresh để tránh chồng request và khóa nút tải lại khi cần.
  const [isRefreshing, startRefresh] = useTransition();
  // Lưu thứ tự hiển thị danh sách hiện tại.
  const [sort, setSort] = useState<FlashSaleSort>("DEFAULT");
  // Giới hạn danh sách theo trạng thái còn suất mua.
  const [availableOnly, setAvailableOnly] = useState(false);
  // Điều khiển modal đăng nhập sẵn có của dự án.
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // Khởi tạo đồng hồ bằng thời gian server để lượt render đầu không nháy countdown.
  const [now, setNow] = useState(initialData.serverNow);
  const { campaign, selectedSale, categoryId, requiresLogin } = initialData;
  const endsAt = campaign?.endsAt ?? null;
  const countdown = getSaleCountdown(endsAt, now);
  // Chỉ dữ liệu không lọc thành công mới xác nhận không có sale đang diễn ra.
  const isNoActiveSale = !requiresLogin && !initialData.hasError
    && campaign?.endsAt === null && campaign.items.length === 0;
  const items = useMemo(() => selectSaleItems(
    selectedSale?.items ?? [], sort, availableOnly,
  ), [selectedSale, sort, availableOnly]);

  // Đặt vị trí cuộn trước khi vẽ trang; không lặp lại khi lọc hoặc polling dữ liệu.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), TIME.SECOND_MS);
    return () => { window.clearTimeout(initialTick); window.clearInterval(timer); };
  }, []);

  // Refresh chỉ tải lại Server Component, giữ state frontend và vị trí cuộn.
  const retry = useCallback(() => {
    startRefresh(() => router.refresh());
  }, [router]);

  // Polling mỗi 10 giây; tạm dừng khi chưa đăng nhập hoặc đang đổi danh mục/refresh.
  useEffect(() => {
    if (requiresLogin || isNavigating || isRefreshing) return;
    const timer = window.setInterval(retry, 10 * TIME.SECOND_MS);
    return () => window.clearInterval(timer);
  }, [requiresLogin, isNavigating, isRefreshing, retry]);

  // Làm mới một lần tại deadline để nhận đợt sale kế tiếp, không giữ giá đã hết hạn.
  useEffect(() => {
    if (!endsAt) return;
    const delay = Date.parse(endsAt) - Date.now();
    if (delay <= 0) return;
    const timer = window.setTimeout(retry, Math.min(delay + TIME.SECOND_MS, 2_147_483_647));
    return () => window.clearTimeout(timer);
  }, [endsAt, retry]);

  // Đồng bộ lại dữ liệu server khi trạng thái đăng nhập thay đổi ở phía client.
  useEffect(() => {
    if (!isCheckingAuth && Boolean(user) === requiresLogin) retry();
  }, [user, isCheckingAuth, requiresLogin, retry]);

  // Chỉ categoryId đi lên URL/backend; các bộ lọc còn lại giữ ở frontend.
  const setCategoryId = useCallback((nextCategoryId?: number) => {
    if (nextCategoryId === categoryId) return;
    const params = new URLSearchParams(searchParams.toString());
    if (nextCategoryId === undefined) params.delete("categoryId");
    else params.set("categoryId", String(nextCategoryId));
    const query = params.toString();
    startNavigation(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }, [categoryId, pathname, router, searchParams]);

  return {
    categories: initialData.categories,
    categoryId, setCategoryId, sort, setSort, availableOnly, setAvailableOnly,
    isLoginOpen, openLogin: () => setIsLoginOpen(true), closeLogin: () => setIsLoginOpen(false),
    isAuthenticated: !requiresLogin, endsAt, countdown, isNoActiveSale,
    items: !requiresLogin && !countdown.expired ? items : [],
    totalItems: campaign?.items.length ?? 0,
    maxDiscount: Math.max(0, ...(campaign?.items.map((item) => item.discountPercent) ?? [])),
    isLoading: isNavigating,
    isRefreshing,
    error: initialData.hasError,
    retry,
  };
}
