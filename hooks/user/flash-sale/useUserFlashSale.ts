"use client";

import { useEffect, useMemo, useState } from "react";
import { TIME } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import { useGetFlashSaleCategoriesQuery, useGetUserFlashSaleItemsQuery } from "@/lib/redux/services/user-flash-sale-api";
import { getSaleCountdown, selectSaleItems } from "@/lib/utils/user-flash-sale.utils";
import type { FlashSaleSort } from "@/types/user/flash-sale";

// Điều phối bộ lọc, dữ liệu sale và phiên đăng nhập theo flow RTK Query hiện có.
export function useUserFlashSale() {
  const user = useAppSelector((state) => state.auth.user);
  const isCheckingAuth = useAppSelector((state) => state.auth.isCheckingAuth);
  // Lưu danh mục được chọn để gửi categoryId đến backend.
  const [categoryId, setCategoryId] = useState<number>();
  // Lưu thứ tự hiển thị danh sách hiện tại.
  const [sort, setSort] = useState<FlashSaleSort>("DEFAULT");
  // Giới hạn danh sách theo trạng thái còn suất mua.
  const [availableOnly, setAvailableOnly] = useState(false);
  // Điều khiển modal đăng nhập sẵn có của dự án.
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  // Lưu thời gian hiện tại để sale hết hạn không tiếp tục hiển thị giá mua.
  const [now, setNow] = useState(0);
  const categoriesQuery = useGetFlashSaleCategoriesQuery();
  const options = { skip: !user || isCheckingAuth, pollingInterval: 30 * TIME.SECOND_MS, refetchOnMountOrArgChange: true };
  // Dữ liệu không lọc giữ deadline ngay cả khi danh mục chọn không có sản phẩm.
  const campaignQuery = useGetUserFlashSaleItemsQuery(undefined, options);
  const itemsQuery = useGetUserFlashSaleItemsQuery(categoryId, options);
  const sale = user ? campaignQuery.currentData?.data : null;
  const endsAt = sale?.endsAt ?? null;
  const countdown = getSaleCountdown(now ? endsAt : null, now);
  const items = useMemo(() => selectSaleItems(
    itemsQuery.currentData?.data?.items ?? [], sort, availableOnly,
  ), [itemsQuery.currentData, sort, availableOnly]);

  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), TIME.SECOND_MS);
    return () => { window.clearTimeout(initialTick); window.clearInterval(timer); };
  }, []);

  const { refetch: refetchCampaign } = campaignQuery;
  const { refetch: refetchItems } = itemsQuery;

  // Làm mới một lần tại deadline để nhận đợt sale kế tiếp, không giữ giá đã hết hạn.
  useEffect(() => {
    if (!endsAt) return;
    const delay = Date.parse(endsAt) - Date.now();
    if (delay <= 0) return;
    const timer = window.setTimeout(() => {
      void refetchCampaign();
      if (categoryId !== undefined) void refetchItems();
    }, Math.min(delay + TIME.SECOND_MS, 2_147_483_647));
    return () => window.clearTimeout(timer);
  }, [endsAt, categoryId, refetchCampaign, refetchItems]);

  // Tải lại từng nguồn độc lập để lỗi danh mục không che mất danh sách sale.
  const retry = () => {
    void categoriesQuery.refetch();
    if (user && !isCheckingAuth) {
      void refetchCampaign();
      if (categoryId !== undefined) void refetchItems();
    }
  };

  return {
    categories: categoriesQuery.data?.data ?? [],
    categoriesLoading: categoriesQuery.isLoading,
    categoriesError: categoriesQuery.isError || categoriesQuery.data?.success === false,
    categoryId, setCategoryId, sort, setSort, availableOnly, setAvailableOnly,
    isLoginOpen, openLogin: () => setIsLoginOpen(true), closeLogin: () => setIsLoginOpen(false),
    isAuthenticated: !!user, isCheckingAuth, endsAt, countdown,
    items: user && !countdown.expired ? items : [],
    totalItems: sale?.items.length ?? 0,
    maxDiscount: Math.max(0, ...(sale?.items.map((item) => item.discountPercent) ?? [])),
    isLoading: isCheckingAuth || (!!user && ((campaignQuery.isFetching && !campaignQuery.currentData) || (itemsQuery.isFetching && !itemsQuery.currentData))),
    error: user && (campaignQuery.isError || itemsQuery.isError
      || campaignQuery.data?.success === false || itemsQuery.data?.success === false),
    retry,
  };
}


