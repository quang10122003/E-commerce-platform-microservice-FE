"use client";

import { AlertTriangle, Loader2, X } from "lucide-react";
import { useCancelOrder } from "@/hooks/user/orders/useCancelOrder";
import { CANCEL_REASON_LABELS, CANCEL_REASONS_BY_SCOPE } from "@/lib/utils/order.utils";
import type { OrderCancelScope } from "@/types/user/order";

// Nút hủy đơn và dialog chọn lý do cho user hoặc shop; logic gửi và refresh nằm trong useCancelOrder.
export function OrderCancelAction({ orderId, scope = "user" }: { orderId: number; scope?: OrderCancelScope }) {
  const { form, dialogRef, open, close, submit } = useCancelOrder(orderId, scope);
  const { register, formState: { errors, isSubmitting } } = form;
  const titleId = `cancel-order-${orderId}-title`;

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:border-danger/40 hover:bg-rose-50/50 hover:text-danger-hover active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
      >
        Hủy đơn hàng
      </button>

      {/* Dialog native: Esc và click nền đều gọi close để giữ khóa khi đang gửi. */}
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-xs"
      >
        <form onSubmit={submit} noValidate>
          {/* Header */}
          <header className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle className="size-4.5" />
              </div>
              <div>
                <h2 id={titleId} className="text-sm sm:text-base font-bold text-slate-900">
                  Hủy đơn hàng #{orderId}
                </h2>
                <p className="text-xs text-slate-500">
                  {scope === "shop" ? "Người mua sẽ nhận email thông báo đơn bị hủy" : "Sau khi hủy, đơn hàng sẽ không thể phục hồi"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              disabled={isSubmitting}
              aria-label="Đóng"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 transition-colors"
            >
              <X className="size-4.5" />
            </button>
          </header>

          {/* Danh sách lý do hủy */}
          <fieldset className="space-y-2 p-5" aria-describedby={errors.reason ? `${titleId}-error` : undefined}>
            <legend className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              Vui lòng chọn lý do hủy đơn:
            </legend>
            {CANCEL_REASONS_BY_SCOPE[scope].map((value) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/90 p-3 text-xs sm:text-sm font-medium text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 has-[:checked]:border-primary has-[:checked]:bg-primary-light/50 has-[:checked]:text-primary"
              >
                <input
                  type="radio"
                  value={value}
                  className="size-4 accent-primary"
                  {...register("reason", { required: "Vui lòng chọn lý do hủy đơn." })}
                />
                <span>{CANCEL_REASON_LABELS[value]}</span>
              </label>
            ))}
            {errors.reason && (
              <p id={`${titleId}-error`} role="alert" className="text-xs font-medium text-danger mt-1">
                {errors.reason.message}
              </p>
            )}
          </fieldset>

          {/* Lỗi phản hồi từ server */}
          {errors.root?.server && (
            <p role="alert" className="mx-5 mb-3 rounded-lg border border-danger/20 bg-danger-light p-3 text-xs text-danger-hover">
              {errors.root.server.message}
            </p>
          )}

          {/* Footer nút hành động */}
          <footer className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/80 px-5 py-3.5">
            <button
              type="button"
              onClick={close}
              disabled={isSubmitting}
              className="h-9.5 rounded-lg border border-slate-200 bg-white px-4 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              Không hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-9.5 items-center gap-2 rounded-lg bg-danger px-4 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-danger-hover active:scale-95 disabled:opacity-60 shadow-xs"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Xác nhận hủy đơn
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
