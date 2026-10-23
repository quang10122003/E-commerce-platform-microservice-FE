"use client";

import { useState } from "react";
import { Ticket, Check, Sparkles } from "lucide-react";

// Khối voucher và mã giảm giá cho đơn hàng thanh toán.
export function CheckoutVoucherCard() {
  const [selectedVouchers, setSelectedVouchers] = useState<string[]>(["FREESHIP50K", "MODERN50K"]);
  const [inputCode, setInputCode] = useState("");

  const toggleVoucher = (code: string) => {
    setSelectedVouchers((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-xs space-y-4" aria-label="Mã giảm giá">
      {/* Tiêu đề mục voucher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-main font-bold text-sm sm:text-base">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cta-light text-cta">
            <Ticket className="h-4 w-4" />
          </span>
          <span>ModernShop Voucher</span>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-cta">
          <Sparkles className="h-3.5 w-3.5" /> Tiết kiệm đến 102.000đ
        </span>
      </div>

      {/* Ô nhập mã voucher trực tiếp */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="Nhập mã voucher hoặc mã giới thiệu..."
          className="h-10 flex-1 rounded-lg border border-surface-border bg-white px-3 text-xs uppercase tracking-wider text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={() => {
            if (inputCode.trim()) {
              toggleVoucher(inputCode.trim().toUpperCase());
              setInputCode("");
            }
          }}
          className="h-10 px-4 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
        >
          Áp dụng
        </button>
      </div>

      {/* Danh sách các voucher khả dụng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {[
          {
            code: "FREESHIP50K",
            name: "Miễn Phí Vận Chuyển Toàn Quốc",
            desc: "Giảm tối đa 50k phí ship cho đơn từ 200k",
            badge: "Freeship Xtra",
            color: "border-emerald-200 bg-emerald-50/50 text-emerald-800",
          },
          {
            code: "MODERN50K",
            name: "Giảm 50.000đ Đơn Công Nghệ",
            desc: "Áp dụng cho các sản phẩm ngành hàng điện tử",
            badge: "-50.000đ",
            color: "border-orange-200 bg-orange-50/50 text-orange-800",
          },
        ].map((v) => {
          const isSelected = selectedVouchers.includes(v.code);
          return (
            <div
              key={v.code}
              onClick={() => toggleVoucher(v.code)}
              className={`flex items-start justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? "border-primary bg-primary-light/40 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="space-y-1 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-xs border ${v.color}`}>
                    {v.badge}
                  </span>
                  <span className="font-bold text-xs text-main">{v.code}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800">{v.name}</p>
                <p className="text-[11px] text-muted-foreground">{v.desc}</p>
              </div>
              <span
                className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
