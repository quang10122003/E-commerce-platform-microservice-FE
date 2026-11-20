import type { RefObject } from "react";
import { CircleX } from "lucide-react";
import { Loading } from "@/components/ui/loading";

interface CheckoutSuccessModalProps {
  submitting: boolean;
  failureReason: string | null;
  dialogRef: RefObject<HTMLDialogElement | null>;
  streamError: boolean;
  onReconnect: () => void;
  onConfirmFailure: () => void;
}

// Phủ kính trắng mờ lên checkout, giữ focus trong trạng thái chờ hoặc kết quả nghiệp vụ.
export function CheckoutSuccessModal({ submitting, failureReason, dialogRef, streamError, onReconnect, onConfirmFailure }: CheckoutSuccessModalProps) {
  return (
    <dialog ref={dialogRef} onCancel={(event) => event.preventDefault()} aria-labelledby="checkout-status-title"
      className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-transparent p-4 text-main backdrop:bg-white/60 backdrop:backdrop-blur-md open:flex open:items-center open:justify-center">
      {failureReason ? (
        <section role="alert" className="w-full max-w-lg space-y-4 rounded-xl border border-surface-border bg-surface-card p-6 text-center sm:p-8">
          <CircleX className="mx-auto h-12 w-12 text-danger" aria-hidden="true" />
          <h2 id="checkout-status-title" className="text-xl font-bold">Không thể hoàn tất đơn hàng</h2>
          <p className="text-sm leading-6 text-muted-foreground">{failureReason}</p>
          <button type="button" onClick={onConfirmFailure} autoFocus className="h-11 cursor-pointer rounded-lg bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Xác nhận</button>
        </section>
      ) : (
        <section className="flex w-full max-w-lg flex-col items-center gap-5 px-6 py-8 text-center text-main sm:px-8" aria-live="polite" aria-busy="true">
          <Loading dotsOnly label={submitting ? "Đang gửi yêu cầu đặt hàng" : "Đang xử lý đơn hàng"} className="[&_span]:motion-reduce:animate-none" />
          <h2 id="checkout-status-title" className={submitting ? "sr-only" : "text-base font-semibold text-slate-700"}>
            {submitting ? "Đang gửi yêu cầu đặt hàng" : "Đang xử lý đơn hàng, vui lòng chờ"}
          </h2>
          {streamError && <div className="space-y-3 text-sm">
            <p>Kết nối nhận kết quả bị gián đoạn. Checkout vẫn đang được xử lý.</p>
            <button type="button" onClick={onReconnect} className="h-11 cursor-pointer rounded-lg border border-surface-border bg-surface-card px-5 font-semibold text-primary hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Kết nối lại</button>
          </div>}
        </section>
      )}
    </dialog>
  );
}
