"use client";

import { Filter, Loader2, RotateCcw, Search, Wallet, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { DateRangeField } from "@/components/ui/date-range-field";
import type { ShopOrderTab } from "@/types/shop/order";
import type { CheckoutPaymentMethod } from "@/types/user/checkout";

interface OrdersFilterBarProps {
  tab: ShopOrderTab;
  onTabChange: (tab: ShopOrderTab) => void;
  statusTabs: Array<{ id: ShopOrderTab; label: string; count: number }>;
  keyword: string;
  onKeywordChange: (value: string) => void;
  paymentMethod: CheckoutPaymentMethod | "";
  onPaymentChange: (value: CheckoutPaymentMethod | "") => void;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  dateError: string;
  onApplyDateRange: () => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  isPending: boolean;
}

// Thanh tab trạng thái, tìm kiếm, lọc thanh toán và chọn khoảng thời gian đặt hàng.
export function OrdersFilterBar(props: OrdersFilterBarProps) {
  const { tab, onTabChange, statusTabs, keyword, onKeywordChange, paymentMethod, onPaymentChange, isPending } = props;
  // Phần lọc nâng cao mở từ nút biểu tượng trên màn hình nhỏ.
  const advancedFilters = (idPrefix: string) => (
    <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(13rem,1fr)_minmax(16rem,1.2fr)_auto]">
      <div className="relative">
        <Wallet className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <select value={paymentMethod} onChange={(event) => onPaymentChange(event.target.value as CheckoutPaymentMethod | "")} aria-label="Lọc theo phương thức thanh toán"
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-8 pr-3 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="">Tất cả phương thức thanh toán</option>
          <option value="COD">Thanh toán khi nhận hàng (COD)</option>
          <option value="VNPAY">VNPay</option>
        </select>
      </div>
      <DateRangeField id={`${idPrefix}-date-range`} label="Chọn khoảng ngày đặt hàng" fromDate={props.fromDate} toDate={props.toDate} onFromDateChange={props.onFromDateChange} onToDateChange={props.onToDateChange} />
      <div className="flex items-center gap-2 lg:col-span-1">
        <Button type="button" variant="primary" size="sm" onClick={props.onApplyDateRange} disabled={isPending} className="h-10 rounded-lg px-4 text-xs font-semibold shadow-none">
          {isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />} Áp dụng
        </Button>
        {props.isFiltered && <Button type="button" variant="outline" size="sm" onClick={props.onResetFilters} title="Đặt lại tất cả bộ lọc" aria-label="Đặt lại bộ lọc" className="h-10 shrink-0 px-2.5 text-xs text-slate-600 hover:border-danger/40 hover:text-danger"><RotateCcw className="h-3.5 w-3.5" /></Button>}
      </div>
      {props.dateError && <p role="alert" className="text-xs text-danger-hover lg:col-span-3">{props.dateError}</p>}
    </div>
  );

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs sm:p-5">
      {/* Tab trạng thái kèm số đơn theo bộ lọc hiện tại. */}
      <div className="no-scrollbar -mx-4 flex overflow-x-auto border-b border-slate-200 px-4 sm:-mx-5 sm:px-5">
        <div className="flex min-w-max gap-2 pb-px sm:gap-4">
          {statusTabs.map((item) => {
            const active = tab === item.id;
            return (
              <button key={item.id} type="button" onClick={() => onTabChange(item.id)} aria-pressed={active}
                className={`flex cursor-pointer items-center gap-2 border-b-2 px-1 py-3 text-xs font-semibold transition-colors sm:text-sm ${active ? "border-cta font-bold text-cta" : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}>
                <span>{item.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-orange-100 text-cta" : "bg-slate-100 text-slate-600"}`}>{item.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tìm kiếm và lọc phương thức thanh toán. */}
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input value={keyword} onChange={(event) => onKeywordChange(event.target.value)} maxLength={100}
            placeholder="Tìm theo mã đơn, tên khách, email, sản phẩm..." aria-label="Tìm kiếm đơn hàng"
            className="h-9.5 rounded-lg border-slate-200 bg-slate-50/50 pl-9 pr-8 text-xs focus:bg-white" />
          {keyword && (
            <button type="button" onClick={() => onKeywordChange("")} aria-label="Xóa từ khóa" className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <details className="group relative shrink-0 lg:hidden">
          <summary aria-label="Mở bộ lọc đơn hàng" className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-open:border-primary group-open:bg-primary-light [&::-webkit-details-marker]:hidden">
            <Filter className="size-4 text-cta" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-3rem)] rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            <p className="mb-3 text-sm font-semibold text-slate-800">Bộ lọc đơn hàng</p>
            {advancedFilters("shop-orders-mobile")}
          </div>
        </details>
      </div>

      {/* Desktop giữ bộ lọc mở; tablet và điện thoại dùng menu cạnh ô tìm kiếm. */}
      <div className="hidden lg:block">{advancedFilters("shop-orders-desktop")}</div>
    </div>
  );
}
