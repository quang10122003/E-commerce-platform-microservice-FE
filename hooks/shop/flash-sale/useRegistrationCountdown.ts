"use client";

import { TIME } from "@/lib/constants";

import { useEffect, useState } from "react";

// Cập nhật mốc thời gian định kỳ để đồng hồ hạn đăng ký tự chạy trên giao diện.
export function useRegistrationCountdown(initialNow: number) {
  // Lưu thời điểm hiện tại để cập nhật thời gian còn lại trên giao diện.
  const [now, setNow] = useState(initialNow);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), TIME.SECOND_MS);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}
