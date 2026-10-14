"use client";

import { useEffect, useRef } from "react";

// Giữ thông báo phía trên dialog native mà không thay đổi flow hay hàng đợi.
export function useNotificationLayer(latestNotificationId: string | undefined) {
  // Phần tử stack được đưa lên top layer khi xuất hiện.
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (layer && typeof layer.showPopover !== "function") layer.removeAttribute("popover");
    layer?.showPopover?.();
    return () => {
      if (typeof layer?.hidePopover === "function" && layer.matches(":popover-open")) layer.hidePopover();
    };
  }, [latestNotificationId]);

  return layerRef;
}
