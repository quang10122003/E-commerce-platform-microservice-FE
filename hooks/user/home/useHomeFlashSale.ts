"use client";

import { useEffect, useState } from "react";
import { TIME } from "@/lib/constants";
import { getSaleCountdown } from "@/lib/utils/user-flash-sale.utils";

// Cập nhật countdown bằng đồng hồ trình duyệt, giữ lượt render đầu khớp server.
export function useHomeFlashSale(endsAt: string | null, serverNow: number) {
  // Lưu thời điểm hiện tại để tính deadline ISO có offset bằng helper chung.
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), TIME.SECOND_MS);
    return () => { window.clearTimeout(initialTick); window.clearInterval(timer); };
  }, []);
  return getSaleCountdown(endsAt, now);
}
