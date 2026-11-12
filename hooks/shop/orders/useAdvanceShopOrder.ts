"use client";

import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/shared/useNotification";
import { useAdvanceShopOrderMutation } from "@/lib/redux/services/order-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { ShopOrder } from "@/types/shop/order";

// Gửi trạng thái đơn đang hiển thị để BE chuyển sang bước kế tiếp, rồi tải lại danh sách giữ nguyên bộ lọc.
export function useAdvanceShopOrder(order: Pick<ShopOrder, "orderId" | "status">) {
  const router = useRouter();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const [advanceOrder, { isLoading }] = useAdvanceShopOrderMutation();

  const advance = async () => {
    try {
      await advanceOrder({ orderId: order.orderId, currentStatus: order.status }).unwrap();
      notifySuccess(order.status === "PENDING_CONFIRMATION"
        ? `Đã xác nhận đơn #${order.orderId}.` : `Đơn #${order.orderId} đã chuyển sang đang giao.`);
      router.refresh();
    } catch (error) {
      // Đơn đã đổi ở nơi khác (user hủy, tab khác đã chuyển): tải lại để thấy trạng thái mới.
      const code = (error as { data?: { error?: { code?: string } } })?.data?.error?.code;
      if (code === "ORDER_STATUS_CHANGED") {
        notifyInfo("Đơn hàng đã được cập nhật, danh sách đã tải lại.");
        router.refresh();
        return;
      }
      notifyError(getApiErrorMessage(error, "Không thể cập nhật trạng thái đơn. Vui lòng thử lại."));
    }
  };

  return { advance, isLoading };
}
