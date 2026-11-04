import type { RefObject } from "react";
import { Check, Clock, CircleX } from "lucide-react";
import type { CreateCheckoutResponse } from "@/types/user/checkout";

interface CheckoutSuccessModalProps {
  result: CreateCheckoutResponse;
  dialogRef: RefObject<HTMLDialogElement | null>;
  onClose: () => void;
}

// Phản ánh trạng thái checkout thực tế, không báo hoàn tất khi BE mới tiếp nhận.
export function CheckoutSuccessModal({ result, dialogRef, onClose }: CheckoutSuccessModalProps) {
  const status = {
    PROCESSING: { title: "Đã tiếp nhận yêu cầu đặt hàng", description: "Checkout của bạn đang được xử lý.", icon: Clock },
    DONE: { title: "Đặt hàng thành công", description: "Checkout của bạn đã hoàn tất.", icon: Check },
    CANCEL: { title: "Checkout đã bị hủy", description: "Yêu cầu đặt hàng này đã bị hủy.", icon: CircleX },
  }[result.status];
  const Icon = status.icon;

  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="checkout-result-title"
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-surface-border bg-surface-card p-6 text-center text-main shadow-xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm">
      {/* Kết quả trả về từ API tạo checkout. */}
      <Icon className="mx-auto mb-4 h-10 w-10 text-primary" aria-hidden="true" />
      <h2 id="checkout-result-title" className="text-xl font-bold">{status.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{status.description}</p>
      <p className="mt-4 text-sm">Mã checkout: <strong className="text-primary">#{result.checkoutId}</strong></p>
      <button type="button" onClick={onClose} className="mt-6 h-11 cursor-pointer rounded-lg bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Đóng</button>
    </dialog>
  );
}
