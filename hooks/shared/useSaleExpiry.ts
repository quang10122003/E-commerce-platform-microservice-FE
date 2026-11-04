"use client";

import { useEffect, useRef, useState } from "react";
import { TIME } from "@/lib/constants";
import { getNextSaleExpiry, getSaleCountdown } from "@/lib/utils/user-flash-sale.utils";

// Chỉ chạy đến hạn sale tiếp theo, không hiển thị countdown hoặc cập nhật mỗi giây.
export function useSaleExpiry(items: readonly { sale: { endsAt: string } | null }[], onExpire?: () => void, enabled = true) {
  // Lưu thời điểm trình duyệt để loại giá sale đã hết hạn khỏi phần hiển thị.
  const [now, setNow] = useState(() => Date.now());
  // Đổi phiên báo giá ngay khi một hoặc nhiều sale cùng hết hạn.
  const [saleExpiryVersion, setSaleExpiryVersion] = useState(0);
  const handledDeadlinesRef = useRef(new Set<number>());
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!enabled) return;
    let timer: number;
    // Gộp các hạn vừa kết thúc thành một lần tải lại, kể cả khi tab vừa hoạt động lại.
    const sync = () => {
      window.clearTimeout(timer);
      const current = Date.now();
      let expired = false;
      for (const item of items) {
        if (!item.sale || !getSaleCountdown(item.sale.endsAt, current).expired) continue;
        const deadline = Date.parse(item.sale.endsAt);
        if (handledDeadlinesRef.current.has(deadline)) continue;
        handledDeadlinesRef.current.add(deadline);
        expired = true;
      }
      setNow(current);
      if (expired) {
        setSaleExpiryVersion((version) => version + 1);
        onExpireRef.current?.();
      }
      const deadline = getNextSaleExpiry(items, current);
      if (deadline !== null) timer = window.setTimeout(sync, Math.min(deadline - current, TIME.HOUR_MS));
    };
    // Trình duyệt có thể trì hoãn timer nền nên cần kiểm tra lại khi quay về tab.
    const handleVisibility = () => { if (!document.hidden) sync(); };
    timer = window.setTimeout(sync, 0);
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [items, enabled]);

  return { now, saleExpiryVersion };
}
