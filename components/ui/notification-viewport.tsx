"use client";

import { useSyncExternalStore } from "react";
import type { CSSProperties } from "react";

import { NotificationToast } from "@/components/ui/notification-toast";
import {
  dismissNotification,
  notificationStore,
  type NotificationItem,
} from "@/hooks/useNotification";

const notificationPositions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

const positionClasses: Record<(typeof notificationPositions)[number], string> = {
  "top-left": "left-4 top-4 sm:left-5 sm:top-5",
  "top-center": "left-1/2 top-4 -translate-x-1/2 sm:top-5",
  "top-right": "right-4 top-4 sm:right-5 sm:top-5",
  "bottom-left": "bottom-4 left-4 sm:bottom-5 sm:left-5",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 sm:bottom-5",
  "bottom-right": "bottom-4 right-4 sm:bottom-5 sm:right-5",
};

// Cấu hình hiển thị theo tầng cho tối đa 5 thẻ trong hàng đợi
const STACK_LEVELS = [
  { opacity: 1, scale: 1, translateY: 0, zIndex: 50, pointerEvents: "auto" as const, blur: 0 },
  { opacity: 0.65, scale: 0.96, translateY: 14, zIndex: 40, pointerEvents: "none" as const, blur: 0 },
  { opacity: 0.35, scale: 0.92, translateY: 28, zIndex: 30, pointerEvents: "none" as const, blur: 0.5 },
  { opacity: 0.18, scale: 0.88, translateY: 40, zIndex: 20, pointerEvents: "none" as const, blur: 1 },
  { opacity: 0.06, scale: 0.84, translateY: 50, zIndex: 10, pointerEvents: "none" as const, blur: 1.5 },
];

// Hiển thị các thông báo theo thứ tự: thẻ đầu tiên rõ nhất, các thẻ sau trượt từ dưới lên và rõ dần khi thẻ trước biến mất.
function NotificationStack({
  items,
  position,
}: {
  items: NotificationItem[];
  position: (typeof notificationPositions)[number];
}) {
  const activeItems = items.filter((item) => !item.isExiting);
  const exitingItems = items.filter((item) => item.isExiting);

  return (
    <div
      className={`pointer-events-none fixed z-[9999] h-28 w-[calc(100vw-32px)] max-w-[380px] sm:w-[380px] ${positionClasses[position]} [perspective:1200px]`}
      aria-live="polite"
      aria-label="Danh sách thông báo"
    >
      {/* 1. Các thẻ đang hoạt động trong hàng chờ tối đa 5 thẻ (vị trí absolute cố định để trượt từ dưới lên mượt mà) */}
      {activeItems.map((item, index) => {
        const level = STACK_LEVELS[Math.min(index, STACK_LEVELS.length - 1)];

        return (
          <div
            key={item.id}
            className="notification-stack-item origin-top"
            style={{
              zIndex: level.zIndex,
              pointerEvents: level.pointerEvents,
              opacity: level.opacity,
              filter: level.blur > 0 ? `blur(${level.blur}px)` : undefined,
              transform: `translate3d(0, ${level.translateY}px, 0) scale(${level.scale})`,
            } as CSSProperties}
          >
            <NotificationToast
              title={item.title}
              description={item.description}
              variant={item.variant}
              action={item.action}
              dismissible={item.dismissible && index === 0}
              onDismiss={() => dismissNotification(item.id)}
            />
          </div>
        );
      })}

      {/* 2. Thẻ đang thoát: trượt lên trên, mờ dần rồi biến mất */}
      {exitingItems.map((item) => (
        <div
          key={item.id}
          className="notification-stack-exit pointer-events-none absolute left-0 right-0 top-0"
          style={{
            zIndex: 60,
          }}
        >
          <NotificationToast
            title={item.title}
            description={item.description}
            variant={item.variant}
            action={item.action}
            dismissible={false}
            onDismiss={() => {}}
          />
        </div>
      ))}
    </div>
  );
}

// Theo dõi store và chia thông báo thành từng stack theo vị trí hiển thị.
export function NotificationViewport() {
  const items = useSyncExternalStore(
    notificationStore.subscribe,
    notificationStore.getSnapshot,
    notificationStore.getServerSnapshot
  );

  return (
    <>
      {notificationPositions.map((position) => {
        const positionItems = items.filter((item) => item.position === position);
        if (positionItems.length === 0) return null;

        return (
          <NotificationStack
            key={position}
            items={positionItems}
            position={position}
          />
        );
      })}
    </>
  );
}
