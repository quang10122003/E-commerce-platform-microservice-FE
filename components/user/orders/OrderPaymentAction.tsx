"use client";

import { Clock3, ExternalLink, Loader2 } from "lucide-react";
import { useRegistrationCountdown } from "@/hooks/shop/flash-sale/useRegistrationCountdown";
import { getSaleCountdown } from "@/lib/utils/user-flash-sale.utils";
import type { UserOrder } from "@/types/user/order";

// Nút thanh toán VNPay đếm ngược tới expiresAt; hết giờ chuyển sang trạng thái đối soát.
export function OrderPaymentAction({ payment }: { payment: UserOrder["payment"] }) {
  const now = useRegistrationCountdown(0);
  const countdown = getSaleCountdown(payment.expiresAt, now);
  const payable = !!payment.paymentUrl && (now === 0 || !countdown.expired);

  if (payable) {
    const [hours, minutes, seconds] = countdown.parts;
    return (
      <a
        href={payment.paymentUrl!}
        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 via-cta to-red-600 px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:brightness-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
      >
        <span>Thanh toán ngay</span>
        {now > 0 && (
          <span className="inline-flex items-center gap-1 rounded bg-black/20 px-1.5 py-0.5 text-xs font-mono tabular-nums">
            <Clock3 className="size-3" aria-hidden="true" />
            {hours === "00" ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`}
          </span>
        )}
        <ExternalLink className="size-3.5 opacity-80" />
      </a>
    );
  }

  return (
    <span
      aria-disabled="true"
      className="inline-flex h-9 cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 text-xs font-semibold text-amber-800"
    >
      <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      Đang đối soát thanh toán
    </span>
  );
}
