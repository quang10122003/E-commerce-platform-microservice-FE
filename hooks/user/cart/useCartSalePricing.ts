"use client";

import { useEffect, useRef, useState } from "react";
import { TIME } from "@/lib/constants";
import type { CartItem } from "@/types/user/cart";
import { applyCartItemPricing, getNextCartSaleExpiry } from "@/utils/cart.utils";

const EMPTY_ITEMS: CartItem[] = [];

// Cập nhật giá âm thầm khi sale hết hạn, không tạo request hoặc đồng hồ hiển thị.
export function useCartSalePricing(items: CartItem[] = EMPTY_ITEMS) {
  // Lưu thời điểm trình duyệt dùng chung cho giá từng dòng và tổng tiền.
  const [now, setNow] = useState(() => Date.now());
  // Đổi khóa báo giá khi một ưu đãi đang hiệu lực vừa hết hạn.
  const [saleExpiryVersion, setSaleExpiryVersion] = useState(0);
  const lastCheckedAtRef = useRef(now);

  useEffect(() => {
    let timer: number;
    // Đặt lại timer theo deadline gần nhất; giới hạn thời gian chờ để tránh tràn setTimeout.
    const syncPricing = () => {
      window.clearTimeout(timer);
      const current = Date.now();
      const previousDeadline = getNextCartSaleExpiry(items, lastCheckedAtRef.current);
      if (previousDeadline !== null && previousDeadline <= current) {
        setSaleExpiryVersion((version) => version + 1);
      }
      lastCheckedAtRef.current = current;
      setNow(current);
      const deadline = getNextCartSaleExpiry(items, current);
      if (deadline !== null) timer = window.setTimeout(syncPricing, Math.min(deadline - current, TIME.HOUR_MS));
    };
    // Đồng bộ lại khi tab hoạt động vì trình duyệt có thể trì hoãn timer chạy nền.
    const handleVisibility = () => {
      if (!document.hidden) syncPricing();
    };
    timer = window.setTimeout(syncPricing, 0);
    window.addEventListener("focus", syncPricing);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", syncPricing);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [items]);

  return { items: applyCartItemPricing(items, now), saleExpiryVersion };
}
