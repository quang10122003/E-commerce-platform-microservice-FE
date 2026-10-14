"use client";

import { Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useProductDetailContext } from "@/hooks/user/product-detail/useProductDetailContext";

// Hiển thị giá và sale dùng chung cho desktop, tablet và bảng mua hàng mobile.
export function ProductPriceView() {
  const { pricing } = useProductDetailContext();

  // Chỉ vùng giá hiển thị skeleton trong lúc lấy sale, không hiện giá hoặc ưu đãi tạm.
  if (pricing.isLoading) {
    return (
      <div role="status" aria-busy="true" className="space-y-3 rounded-xl bg-surface-subtle p-4">
        <span className="sr-only">Đang tải giá sản phẩm</span>
        <div aria-hidden="true" className="space-y-3">
          <div className="skeleton-shimmer h-4 w-3/5 rounded" />
          <div className="flex items-end gap-3">
            <div className="skeleton-shimmer h-9 w-1/2 rounded sm:h-10" />
            <div className="space-y-1.5">
              <div className="skeleton-shimmer h-4 w-20 rounded" />
              <div className="skeleton-shimmer h-5 w-12 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={pricing.sale
        ? "flex flex-wrap items-end gap-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-4"
        : "flex flex-wrap items-end gap-3 rounded-xl bg-surface-subtle p-4"}
    >
      {/* Countdown Flash Sale. */}
      {pricing.sale && (
        <div className="mb-1 flex w-full items-center gap-2 text-xs text-orange-600">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="font-semibold uppercase tracking-wide">Flash Sale kết thúc sau</span>
          <div className="flex items-center gap-1" aria-label="Thời gian sale còn lại">
            {pricing.countdown.map((unit, index) => (
              <span key={index} className="flex items-center gap-1">
                <span className="rounded bg-orange-500 px-1.5 py-0.5 text-xs font-black tabular-nums text-white">{unit}</span>
                {index < 2 && <span className="font-black text-orange-500">:</span>}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Giá khuyến mãi và giá gốc gạch ngang chỉ hiển thị khi có sale còn hạn. */}
      {pricing.price !== null ? (
        <span className="text-3xl font-black text-cta sm:text-4xl">{formatCurrency(pricing.price)}</span>
      ) : (
        <span className="text-sm text-muted-foreground">Chọn phân loại để xem giá</span>
      )}
      {pricing.sale && pricing.originalPrice !== null && (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm text-muted-foreground line-through">{formatCurrency(pricing.originalPrice)}</span>
          <span className="rounded bg-cta px-2 py-0.5 text-center text-xs font-black text-white">-{pricing.sale.discountPercent}%</span>
        </div>
      )}
    </div>
  );
}