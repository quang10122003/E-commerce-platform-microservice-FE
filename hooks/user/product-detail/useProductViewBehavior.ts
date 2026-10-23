"use client";

import { useEffect, useRef } from "react";
import { TIME } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRecordProductViewMutation } from "@/lib/redux/services/product-api";

// Ghi nhận một lần mỗi lượt vào trang, sau khi tải xong và ở lại đủ ba giây.
export function useProductViewBehavior(productId: number, hasSettled: boolean) {
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const isCheckingAuth = useAppSelector((state) => state.auth.isCheckingAuth);
  const [recordProductView] = useRecordProductViewMutation();
  // Khóa lượt ghi nhận trước khi gửi, kể cả khi request thất bại.
  const hasRecorded = useRef(false);

  useEffect(() => {
    if (!userId || isCheckingAuth || !hasSettled || hasRecorded.current) return;

    // Không theo dõi visibility để chuyển tab không tạm dừng bộ đếm.
    const timer = window.setTimeout(() => {
      hasRecorded.current = true;
      void recordProductView({ productId, eventId: crypto.randomUUID() });
    }, 3 * TIME.SECOND_MS);

    // Rời trang hoặc mất phiên trước hạn thì hủy lượt ghi nhận đang chờ.
    return () => window.clearTimeout(timer);
  }, [productId, hasSettled, userId, isCheckingAuth, recordProductView]);
}
