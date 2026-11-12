"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { useMounted } from "@/lib/hooks";
import { countShopOrdersByTab, getShopOrdersUrl } from "@/lib/utils/shop-order.utils";
import { toLocalDateTimeInput, toOffsetDateTime } from "@/utils/date-time.utils";
import type { ShopOrder, ShopOrderQuery, ShopOrderTab } from "@/types/shop/order";
import type { CheckoutPaymentMethod } from "@/types/user/checkout";

// Bộ lọc thanh toán, từ khóa, khoảng thời gian đi qua URL để Server Component gọi lại BE; tab lọc tại chỗ.
export function useShopOrders(orders: ShopOrder[] | null, query: ShopOrderQuery) {
  const router = useRouter();
  const mounted = useMounted();
  const [isPending, startTransition] = useTransition();
  // Tab trạng thái đang chọn.
  const [tab, setTab] = useState<ShopOrderTab>("ALL");
  // Đơn đang mở trong modal chi tiết.
  const [detailOrder, setDetailOrder] = useState<ShopOrder | null>(null);
  // Từ khóa đang gõ, chờ debounce rồi mới gọi BE.
  const [keyword, setKeyword] = useState(query.keyword ?? "");
  // Hai mốc khoảng thời gian theo định dạng datetime-local của trình duyệt.
  const [fromDate, setFromDate] = useState(() => toLocalDateTimeInput(query.from));
  const [toDate, setToDate] = useState(() => toLocalDateTimeInput(query.to));
  // Lỗi khoảng thời gian hiển thị ngay dưới hai ô chọn.
  const [dateError, setDateError] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
  }, []);

  // Điều hướng với bộ lọc mới; giữ các bộ lọc khác đang áp dụng.
  const navigate = (updates: Partial<ShopOrderQuery>) => {
    startTransition(() => router.push(getShopOrdersUrl({ ...query, ...updates }), { scroll: false }));
  };

  const changeKeyword = (value: string) => {
    setKeyword(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => navigate({ keyword: value.trim() || undefined }), SEARCH_DEBOUNCE_MS);
  };

  const changePayment = (value: CheckoutPaymentMethod | "") => navigate({ paymentMethod: value || undefined });

  // Gửi khoảng thời gian kèm offset trình duyệt; BE tự đổi sang múi giờ của DB khi truy vấn.
  const applyDateRange = () => {
    const from = toOffsetDateTime(fromDate);
    const to = toOffsetDateTime(toDate);
    if (from && to && Date.parse(from) > Date.parse(to)) {
      setDateError("Thời điểm kết thúc phải lớn hơn hoặc bằng thời điểm bắt đầu.");
      return;
    }
    setDateError("");
    navigate({ from, to });
  };

  const resetFilters = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    setKeyword("");
    setFromDate("");
    setToDate("");
    setDateError("");
    setTab("ALL");
    startTransition(() => router.push(getShopOrdersUrl({}), { scroll: false }));
  };

  const paymentMethod: CheckoutPaymentMethod | "" = query.paymentMethod ?? "";
  const counts = useMemo(() => countShopOrdersByTab(orders ?? []), [orders]);
  const visibleOrders = useMemo(
    () => (orders ?? []).filter((order) => tab === "ALL" || order.status === tab), [orders, tab]);

  return {
    tab, setTab, counts, visibleOrders, detailOrder, setDetailOrder, isPending,
    keyword, changeKeyword, paymentMethod, changePayment,
    fromDate: mounted ? fromDate : "", toDate: mounted ? toDate : "", setFromDate, setToDate, dateError, applyDateRange,
    resetFilters, isFiltered: Boolean(query.paymentMethod || query.keyword || query.from || query.to || tab !== "ALL"),
  };
}
