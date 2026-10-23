"use client";

import { useState } from "react";
import { CreditCard, Banknote, QrCode, Wallet, ShieldCheck, Check } from "lucide-react";

// Khối lựa chọn phương thức thanh toán cho đơn hàng.
export function CheckoutPaymentCard() {
  const [selectedMethod, setSelectedMethod] = useState<string>("vietqr");

  const paymentOptions = [
    {
      id: "vietqr",
      name: "Chuyển khoản Ngân hàng (VietQR / Napas247)",
      desc: "Quét mã QR tự động xác nhận trong 3 giây qua mọi ứng dụng ngân hàng",
      icon: QrCode,
      badge: "Khuyên dùng",
    },
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      desc: "Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận được kiện hàng",
      icon: Banknote,
    },
    {
      id: "momo",
      name: "Ví điện tử MoMo / ZaloPay",
      desc: "Thanh toán một chạm qua ví điện tử liên kết bảo mật",
      icon: Wallet,
    },
    {
      id: "card",
      name: "Thẻ Tín dụng / Ghi nợ quốc tế",
      desc: "Hỗ trợ thẻ Visa, Mastercard, JCB, Napas nội địa",
      icon: CreditCard,
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
        <span className="text-xs text-muted-foreground font-medium">Bảo mật chuẩn PCI-DSS</span>
      </div>

      {/* Danh sách lựa chọn hình thức thanh toán */}
      <div className="space-y-2.5">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              onClick={() => setSelectedMethod(opt.id)}
              className={`flex items-center justify-between p-3.5 rounded-lg border cursor-pointer transition-all ${
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
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              </span>
            </div>
          );
        })}
      </div>

      {/* Cam kết an toàn thông tin thanh toán */}
      <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-100">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>Mọi thông tin giao dịch của bạn đều được mã hóa đầu cuối và bảo vệ theo tiêu chuẩn ngân hàng.</span>
      </div>
    </section>
  );
}
