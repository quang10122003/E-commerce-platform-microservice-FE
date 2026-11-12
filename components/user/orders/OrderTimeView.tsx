"use client";

import { useMounted } from "@/lib/hooks";
import { formatOrderDate } from "@/lib/utils/order.utils";

// Chỉ format sau hydration để dùng đúng múi giờ của trình duyệt.
export function OrderTimeView({ value }: { value: string }) {
  const mounted = useMounted();
  return <time dateTime={value}>{mounted ? formatOrderDate(value) : "—"}</time>;
}
