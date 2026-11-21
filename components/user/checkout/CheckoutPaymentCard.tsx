"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import type { CheckoutPaymentMethod } from "@/types/user/checkout";
import { CreditCard, Banknote, QrCode } from "lucide-react";

// Khối lựa chọn phương thức thanh toán cho đơn hàng.
export function CheckoutPaymentCard({ selectedMethod, paymentField, error }: { selectedMethod: CheckoutPaymentMethod; paymentField: UseFormRegisterReturn<"paymentMethod">; error?: string }) {

  const paymentOptions = [
    {
      id: "VNPAY",
      name: "Thanh toán qua VNPAY",
      desc: "Thanh toán trực tuyến qua cổng VNPAY",
      icon: QrCode,
      badge: "Khuyên dùng",
    },
    {
      id: "COD",
      name: "Thanh toán khi nhận hàng (COD)",
      desc: "Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận được kiện hàng",
      icon: Banknote,
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-xs space-y-4" aria-label="Phương thức thanh toán">
      {/* Tiêu đề mục thanh toán */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-main font-bold text-sm sm:text-base">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-primary">
            <CreditCard className="h-4 w-4" />
          </span>
          <span>Phương Thức Thanh Toán</span>
        </div>
      </div>

      {/* Danh sách lựa chọn hình thức thanh toán */}
      <div className="space-y-2.5">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          const Icon = opt.icon;
          return (
            <label
              key={opt.id}
              className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all focus-within:ring-2 focus-within:ring-primary ${
                isSelected
                  ? "border-primary bg-primary-light/40 shadow-xs"
                  : "border-surface-border bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                    isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-main">{opt.name}</span>
                    {opt.badge && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-xs border border-emerald-200">
                        {opt.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                </div>
              </div>
              <input {...paymentField} type="radio" value={opt.id} checked={isSelected}
                className="h-4 w-4 shrink-0 cursor-pointer accent-primary" aria-describedby={error ? "checkout-payment-error" : undefined} />
            </label>
          );
        })}
      </div>

      {error && <p id="checkout-payment-error" role="alert" className="text-xs text-danger">{error}</p>}

    </section>
  );
}
