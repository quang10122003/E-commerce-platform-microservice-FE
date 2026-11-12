// Nhãn và màu badge theo trạng thái đơn trong Kênh Người Bán.
export const ORDER_STATUS_CONFIG = {
  PENDING_CONFIRMATION: {
    label: "Chờ xác nhận",
    badgeVariant: "star" as const,
    color: "text-amber-700 bg-amber-50 border-amber-200",
  },
  PENDING_PICKUP: {
    label: "Chờ lấy hàng",
    badgeVariant: "primary-soft" as const,
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
  },
  SHIPPING: {
    label: "Đang giao",
    badgeVariant: "primary" as const,
    color: "text-blue-700 bg-blue-50 border-blue-200",
  },
  DONE: {
    label: "Hoàn thành",
    badgeVariant: "perk-soft" as const,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  CANCEL: {
    label: "Đã hủy",
    badgeVariant: "danger-soft" as const,
    color: "text-rose-700 bg-rose-50 border-rose-200",
  },
};
