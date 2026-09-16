"use client";

import type { ToasterProps } from "sonner";

export type NotificationVariant = "success" | "info" | "warning" | "error" | "loading";

export type NotificationAction = {
  label: string;
  onClick: () => void;
};

export type NotificationOptions = {
  description?: string;
  variant?: NotificationVariant;
  duration?: number;
  position?: NonNullable<ToasterProps["position"]>;
  action?: NotificationAction;
  dismissible?: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  variant: NotificationVariant;
  duration: number;
  position: NonNullable<ToasterProps["position"]>;
  action?: NotificationAction;
  dismissible?: boolean;
  isExiting?: boolean;
};

const notificationListeners = new Set<() => void>();
const notificationTimers = new Map<string, ReturnType<typeof setTimeout>>();
let notificationItems: NotificationItem[] = [];
// Giới hạn tối đa 5 thẻ thông báo trong hàng đợi
export const MAX_VISIBLE_NOTIFICATIONS = 5;
// Thời gian chạy animation khi thẻ biến mất (ms)
export const EXIT_ANIMATION_DURATION = 380;

// Phát tín hiệu để viewport cập nhật danh sách thông báo theo thời gian thực.
const emitNotificationChange = () => {
  notificationListeners.forEach((listener) => listener());
};

// Kích hoạt bộ đếm thời gian cho thẻ đầu tiên (đang hiển thị chính) của mỗi vị trí
const syncHeadNotificationTimers = () => {
  // Lấy các vị trí hiện có trong danh sách thông báo
  const positions = new Set(notificationItems.map((item) => item.position));

  positions.forEach((position) => {
    // Lấy danh sách các thẻ đang hoạt động (chưa bị đánh dấu ẩn) tại vị trí này
    const activeItems = notificationItems.filter(
      (item) => item.position === position && !item.isExiting
    );

    if (activeItems.length === 0) return;

    // Thẻ đầu tiên (đang hiển thị chính tại vị trí này)
    const headItem = activeItems[0];

    // Nếu thẻ đầu tiên chưa có timer chạy và không phải thời lượng vô hạn thì bắt đầu đếm thời gian
    if (headItem.duration !== Infinity && !notificationTimers.has(headItem.id)) {
      const timer = setTimeout(() => {
        dismissNotification(headItem.id);
      }, headItem.duration);
      notificationTimers.set(headItem.id, timer);
    }
  });
};

// Xóa hẳn thông báo sau khi hoàn tất animation thoát.
const removeNotification = (id: string) => {
  const timer = notificationTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    notificationTimers.delete(id);
  }

  const nextItems = notificationItems.filter((item) => item.id !== id);
  if (nextItems.length === notificationItems.length) return;

  notificationItems = nextItems;
  emitNotificationChange();
  syncHeadNotificationTimers();
};

// Chờ animation kết thúc rồi mới loại thông báo khỏi hàng đợi.
const scheduleNotificationRemoval = (id: string) => {
  const currentTimer = notificationTimers.get(id);
  if (currentTimer) clearTimeout(currentTimer);

  const timer = setTimeout(() => removeNotification(id), EXIT_ANIMATION_DURATION);
  notificationTimers.set(id, timer);
};

// Đánh dấu thông báo đang ẩn để chạy animation trượt lên và mờ dần trước khi xóa khỏi DOM.
export const dismissNotification = (id: string) => {
  const item = notificationItems.find((notification) => notification.id === id);
  if (!item || item.isExiting) return;

  const timer = notificationTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    notificationTimers.delete(id);
  }

  notificationItems = notificationItems.map((notification) =>
    notification.id === id
      ? { ...notification, isExiting: true }
      : notification
  );
  emitNotificationChange();
  scheduleNotificationRemoval(id);

  // Kích hoạt ngay bộ đếm thời gian cho thẻ kế tiếp vừa được nâng lên vị trí hiển thị chính
  syncHeadNotificationTimers();
};

// Thêm thông báo mới vào hàng đợi, đảm bảo tối đa 5 thẻ và chỉ đếm thời gian cho thẻ đầu tiên.
const addNotification = (item: NotificationItem) => {
  // Lấy danh sách các thẻ đang hoạt động (chưa bị đánh dấu thoát)
  const activeItems = notificationItems.filter(
    (i) => i.position === item.position && !i.isExiting
  );

  // Nếu đã đạt giới hạn 5 thẻ, lập tức cho thẻ đầu ẩn để nhường chỗ và đẩy các thẻ lên
  if (activeItems.length >= MAX_VISIBLE_NOTIFICATIONS) {
    const oldestActive = activeItems[0];
    dismissNotification(oldestActive.id);
  }

  notificationItems = [...notificationItems, item];
  emitNotificationChange();

  // Đồng bộ hẹn giờ: chỉ thẻ đang ở vị trí đầu tiên mới bắt đầu đếm ngược thời gian hiển thị
  syncHeadNotificationTimers();
};

// Mảng rỗng cố định để getServerSnapshot không tạo tham chiếu mới trong SSR
const EMPTY_ITEMS: NotificationItem[] = [];

// Cung cấp API đọc và đăng ký thay đổi cho NotificationViewport.
export const notificationStore = {
  getSnapshot: () => notificationItems,
  getServerSnapshot: () => EMPTY_ITEMS,
  subscribe: (listener: () => void) => {
    notificationListeners.add(listener);
    return () => notificationListeners.delete(listener);
  },
};

// Cung cấp các hàm hiển thị thông báo dùng chung cho giao diện.
export function useNotification() {
  // Hiển thị toast tùy biến theo loại, thời lượng và hành động được truyền vào.
  const notify = (
    message: string,
    options?: NotificationOptions
  ) => {
    const variant = options?.variant ?? "info";

    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Dùng 3 giây làm thời lượng mặc định, loading vẫn giữ đến khi được đóng thủ công.
    addNotification({
      id,
      title: message,
      description: options?.description,
      variant,
      duration: options?.duration ?? (variant === "loading" ? Infinity : 3000),
      position: options?.position ?? "top-right",
      action: options?.action,
      dismissible: options?.dismissible,
    });
  };

  // Hiển thị thông báo thành công ở góc trên bên phải.
  const notifySuccess = (message: string, options?: NotificationOptions) => {
    notify(message, { ...options, variant: "success" });
  };

  // Hiển thị thông báo thông tin trung tính ở góc trên bên phải.
  const notifyInfo = (message: string, options?: NotificationOptions) => {
    notify(message, { ...options, variant: "info" });
  };

  // Hiển thị thông báo cảnh báo ở góc trên bên phải.
  const notifyWarning = (message: string, options?: NotificationOptions) => {
    notify(message, { ...options, variant: "warning" });
  };

  // Hiển thị thông báo lỗi ở góc trên bên phải.
  const notifyError = (message: string, options?: NotificationOptions) => {
    notify(message, { ...options, variant: "error" });
  };

  // Hiển thị thông báo đang xử lý và giữ lại đến khi được đóng thủ công.
  const notifyLoading = (message: string, options?: NotificationOptions) => {
    notify(message, { ...options, variant: "loading" });
  };

  return { notify, notifyError, notifyInfo, notifyLoading, notifySuccess, notifyWarning };
}
