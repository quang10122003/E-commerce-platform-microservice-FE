"use client";

import { useShopFlashSaleFilters } from "@/hooks/shop/flash-sale/useShopFlashSaleFilters";
import type { ShopFlashSaleQuery } from "@/types/shop/flash-sale";
import { DateTimeFields } from "@/components/ui/date-time-fields";

// Hiển thị lựa chọn lọc theo giờ thiết bị và lỗi khoảng thời gian.
export function ShopFlashSaleFilters({ query, idPrefix = "sale", immediate = true, onApplied }: { query: ShopFlashSaleQuery; idPrefix?: string; immediate?: boolean; onApplied?: () => void }) {
  const { draft, error, isPending, submit, change, apply } = useShopFlashSaleFilters(query);
  return (
    <form id={`${idPrefix}-form`} onSubmit={(event) => submit(event, onApplied)} aria-label="Bộ lọc chương trình sale" className={immediate ? "rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5" : "space-y-4"}>
      {/* Bộ chọn lịch dùng chung trên mọi kích thước màn hình. */}
      <div className="grid items-start gap-4 lg:grid-cols-3">
        {(["from", "to"] as const).map((field) => {
          const label = field === "from" ? "Bắt đầu từ" : "Đến thời điểm";
          // Hai mốc thời gian được chọn độc lập; khoảng hợp lệ được kiểm tra khi áp dụng.
          return (
            <DateTimeFields key={field} id={`${idPrefix}-${field}`} name={field} label={label} value={draft[field]} disabled={isPending} onChange={(value) => change(field, value, false)} onConfirm={immediate ? () => { apply(); } : undefined} />
          );
        })}
        <div className="min-w-0 space-y-2">
          <label htmlFor={`${idPrefix}-registration`} className="text-xs font-semibold text-muted-foreground">Hạn đăng ký</label>
          <select name="registration" id={`${idPrefix}-registration`} value={draft.registration} disabled={isPending} onChange={(event) => change("registration", event.target.value, immediate)} className="h-10.5 w-full rounded-lg border border-surface-border bg-surface-card px-3 text-sm text-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <option value="all">Tất cả chương trình</option>
            <option value="open">Còn đăng ký</option>
            <option value="closed">Đã đóng đăng ký</option>
          </select>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-xs text-danger">{error}</p>}
    </form>
  );
}
