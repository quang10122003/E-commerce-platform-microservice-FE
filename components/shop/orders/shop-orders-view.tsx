"use client";

import Link from "next/link";
import { PackageOpen, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { useShopOrders } from "@/hooks/shop/orders/useShopOrders";
import type { ShopOrder, ShopOrderQuery, ShopOrderTab } from "@/types/shop/order";
import { OrderCardItem } from "./order-card-item";
import { OrderDetailModal } from "./order-detail-modal";
import { OrdersFilterBar } from "./orders-filter-bar";
import { OrdersOverviewStats } from "./orders-overview-stats";

const TAB_LABELS: Array<{ id: ShopOrderTab; label: string }> = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING_CONFIRMATION", label: "Chờ xác nhận" },
  { id: "PENDING_PICKUP", label: "Chờ lấy hàng" },
  { id: "SHIPPING", label: "Đang giao" },
  { id: "DONE", label: "Hoàn thành" },
  { id: "CANCEL", label: "Đã hủy" },
];

interface ShopOrdersViewProps {
  orders: ShopOrder[] | null;
  query: ShopOrderQuery;
}

// Trang quản lý đơn của shop: thống kê, bộ lọc, danh sách đơn và modal chi tiết.
export function ShopOrdersView({ orders, query }: ShopOrdersViewProps) {
  const state = useShopOrders(orders, query);
  const statusTabs = TAB_LABELS.map((tab) => ({ ...tab, count: state.counts[tab.id] }));

  return (
    <div className="space-y-5 pb-12">
      {/* Tiêu đề trang. */}
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Quản Lý Đơn Hàng</h1>
        <p className="mt-1 text-xs text-slate-500">Theo dõi đơn hàng và thông tin người mua tại Shop</p>
      </div>

      {/* Thống kê đếm trạng thái trực tiếp từ danh sách đơn API. */}
      <OrdersOverviewStats
        currentTab={state.tab}
        onTabChange={(tab) => state.setTab(tab as ShopOrderTab)}
        counts={{
          all: state.counts.ALL,
          pendingConfirmation: state.counts.PENDING_CONFIRMATION,
          pendingPickup: state.counts.PENDING_PICKUP,
          shipping: state.counts.SHIPPING,
          done: state.counts.DONE,
          cancel: state.counts.CANCEL,
        }}
        dataAvailable={orders !== null}
      />

      <OrdersFilterBar
        tab={state.tab} onTabChange={state.setTab} statusTabs={statusTabs}
        keyword={state.keyword} onKeywordChange={state.changeKeyword}
        paymentMethod={state.paymentMethod} onPaymentChange={state.changePayment}
        fromDate={state.fromDate} toDate={state.toDate} onFromDateChange={state.setFromDate} onToDateChange={state.setToDate}
        dateError={state.dateError} onApplyDateRange={state.applyDateRange}
        onResetFilters={state.resetFilters} isFiltered={state.isFiltered} isPending={state.isPending}
      />

      {/* Danh sách theo trạng thái tải: lỗi, rỗng hoặc có đơn. */}
      {orders === null ? (
        <section className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-12 text-center">
          <RefreshCw className="mb-3 h-10 w-10 text-primary" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-slate-800">Chưa thể tải danh sách đơn hàng</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">Đã có lỗi khi kết nối. Hãy thử tải lại trang.</p>
          <Link href="/shop/orders" className="mt-4 inline-flex h-9 items-center rounded-lg bg-cta px-4 text-xs font-semibold text-white transition-colors hover:bg-cta-hover active:scale-95">Thử lại</Link>
        </section>
      ) : state.visibleOrders.length === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <PackageOpen className="mb-3 h-12 w-12 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy đơn hàng nào</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">Không có đơn hàng nào khớp với bộ lọc hiện tại.</p>
          {state.isFiltered && (
            <Button type="button" variant="outline" size="sm" onClick={state.resetFilters} className="mt-4 text-xs font-semibold">Xóa bộ lọc để xem tất cả</Button>
          )}
        </section>
      ) : (
        <>
          <p className="px-2 text-xs font-medium text-slate-500">Hiển thị {state.visibleOrders.length} đơn</p>
          <div className={`space-y-3.5 transition-opacity ${state.isPending ? "opacity-60" : ""}`}>
            {state.visibleOrders.map((order) => <OrderCardItem key={order.orderId} order={order} onOpenDetail={state.setDetailOrder} />)}
          </div>
        </>
      )}

      <OrderDetailModal order={state.detailOrder} onClose={() => state.setDetailOrder(null)} />
    </div>
  );
}
