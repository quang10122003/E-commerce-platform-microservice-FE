"use client";

import { useMounted } from "@/lib/hooks";
import { formatShopMembershipDuration } from "@/utils/shop.utils";

// Chỉ tính thời gian tham gia sau hydration để dùng đúng đồng hồ và múi giờ của trình duyệt.
export function ShopMembershipDuration({ createdAt }: { createdAt: string | null }) {
  const mounted = useMounted();
  return <>{mounted ? formatShopMembershipDuration(createdAt) : "—"}</>;
}
