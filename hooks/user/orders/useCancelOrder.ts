"use client";

import { useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useNotification } from "@/hooks/shared/useNotification";
import { useCancelOrderMutation, useCancelShopOrderMutation } from "@/lib/redux/services/order-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { CancelOrderForm, OrderCancelScope } from "@/types/user/order";

// Quản lý dialog chọn lý do, gửi yêu cầu hủy của user hoặc shop qua BFF và tải lại danh sách đơn từ server.
export function useCancelOrder(orderId: number, scope: OrderCancelScope = "user") {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { notifySuccess, notifyError } = useNotification();
  const [cancelUserOrder] = useCancelOrderMutation();
  const [cancelShopOrder] = useCancelShopOrderMutation();
  const cancelOrder = scope === "shop" ? cancelShopOrder : cancelUserOrder;
  const form = useForm<CancelOrderForm>({ defaultValues: { reason: "" } });

  // Mở dialog bằng API native để có focus trap, Esc và backdrop.
  const open = () => {
    form.reset();
    dialogRef.current?.showModal();
  };

  // Không cho đóng khi đang gửi để người dùng thấy kết quả của yêu cầu.
  const close = () => {
    if (!form.formState.isSubmitting) dialogRef.current?.close();
  };

  // Gửi lý do đã chọn; hủy xong thì refresh Server Component để card chuyển sang trạng thái đã hủy.
  const submitCancel = async ({ reason }: CancelOrderForm) => {
    if (!reason) return;
    try {
      await cancelOrder({ orderId, reason }).unwrap();
      dialogRef.current?.close();
      notifySuccess(`Đã hủy đơn #${orderId}.`);
      router.refresh();
    } catch (error) {
      form.setError("root.server", { message: getApiErrorMessage(error, "Không thể hủy đơn. Vui lòng thử lại.") });
      notifyError("Hủy đơn không thành công.");
    }
  };

  // Chỉ tạo handler validation khi nhận sự kiện, không đọc ref trong render.
  const submit = (event: FormEvent<HTMLFormElement>) => form.handleSubmit(submitCancel)(event);

  return { form, dialogRef, open, close, submit };
}
