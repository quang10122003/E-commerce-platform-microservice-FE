"use client";

import { useEffect, useState } from "react";

// Chỉ cập nhật giá trị sau khi đầu vào ổn định trong khoảng thời gian chờ.
export function useDebouncedValue<T>(value: T, delay: number): T {
  // Lưu giá trị ổn định gần nhất để giảm số lần xử lý khi nhập liên tục.
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
