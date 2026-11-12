"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  PackageOpen,
  RefreshCw,
  Search,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_TABS, getOrdersUrl } from "@/lib/utils/order.utils";
import type { UserOrder, UserOrderQuery } from "@/types/user/order";
import { OrderCardView } from "./OrderCardView";

interface OrdersViewProps {
  query: UserOrderQuery;
  data: UserOrder[] | null;
}

// Trang đơn mua: đồng bộ URL trạng thái, hỗ trợ tìm kiếm nhanh tức thời trên client.
export function OrdersView({ query, data }: OrdersViewProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc nhanh theo từ khóa (Mã đơn, Tên shop, Tên sản phẩm) không cần gọi lại API
  const filteredData = useMemo(() => {
    if (!data) return null;
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase().trim();
    return data.filter((order) => {
      const matchOrderId = String(order.orderId).includes(term);
      const matchShop = order.shop.shopName.toLowerCase().includes(term);
      const matchProduct = order.items.some((item) =>
        item.productName.toLowerCase().includes(term)
      );
      return matchOrderId || matchShop || matchProduct;
    });
  }, [data, searchTerm]);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      {/* 1. Breadcrumb & Tiêu đề trang */}
      <div className="space-y-1">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-semibold text-slate-800">Đơn mua của tôi</span>
        </nav>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Đơn Mua Của Tôi
            </h1>
            {data && data.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                {data.length} đơn
              </span>
            )}
          </div>

          {/* Ô tìm kiếm nhanh trong các đơn đã tải */}
          {data && data.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã đơn, tên shop, sản phẩm..."
                className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-8.5 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                  aria-label="Xóa tìm kiếm"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Thanh Tabs trạng thái đơn hàng */}
      <nav
        className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:overflow-visible"
        aria-label="Lọc theo trạng thái đơn"
      >
        <div className="flex w-fit min-w-max items-center gap-1 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xs sm:w-full sm:justify-between sm:gap-2">
          {ORDER_STATUS_TABS.map((tab) => {
            const active = tab.status === query.status;
            return (
              <Link
                key={tab.label}
                href={getOrdersUrl({ status: tab.status })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-9.5 items-center justify-center rounded-xl px-3.5 sm:px-4 text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap",
                  active
                    ? "bg-primary text-white shadow-xs font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 3. Nội dung danh sách: Lỗi kết nối, Danh sách rỗng, hoặc Danh sách đơn */}
      {!data ? (
        <OrdersStateView
          title="Chưa thể tải đơn hàng"
          description="Đã có lỗi khi kết nối máy chủ. Hãy thử tải lại danh sách đơn."
          actionHref={getOrdersUrl(query)}
          actionLabel="Thử tải lại"
          error
        />
      ) : data.length === 0 ? (
        <OrdersStateView
          title="Chưa có đơn hàng nào"
          description="Các đơn hàng bạn đặt tại sàn sẽ xuất hiện tại đây để theo dõi tiến độ giao hàng."
          actionHref="/"
          actionLabel="Khám phá sản phẩm ngay"
        />
      ) : filteredData && filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <Search className="size-10 text-slate-300 mb-2.5" />
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy đơn hàng nào</h3>
          <p className="mt-1 text-xs text-slate-500">
            Không có đơn nào khớp với từ khóa &ldquo;{searchTerm}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Xóa tìm kiếm để xem tất cả
          </button>
        </div>
      ) : (
        <section aria-label="Danh sách đơn hàng" className="space-y-4">
          {searchTerm && (
            <p className="text-xs text-slate-500 font-medium">
              Tìm thấy <span className="font-bold text-slate-800">{filteredData?.length}</span> đơn hàng phù hợp:
            </p>
          )}
          {filteredData?.map((order) => (
            <OrderCardView key={order.orderId} order={order} />
          ))}
        </section>
      )}
    </div>
  );
}

// Khối thông báo khi danh sách rỗng hoặc gặp sự cố tải
function OrdersStateView({
  title,
  description,
  actionHref,
  actionLabel,
  error,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
  error?: boolean;
}) {
  const Icon = error ? RefreshCw : PackageOpen;
  return (
    <section className="flex flex-col items-center rounded-2xl border border-slate-200/90 bg-white px-5 py-14 text-center shadow-2xs">
      <div
        className={cn(
          "mb-4 flex size-20 items-center justify-center rounded-2xl",
          error ? "bg-rose-50 text-rose-600" : "bg-primary-light text-primary"
        )}
      >
        <Icon className="size-9" strokeWidth={1.6} aria-hidden="true" />
      </div>
      <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
      <Link
        href={actionHref}
        className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-cta px-6 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-cta-hover active:scale-95"
      >
        <ShoppingBag className="size-4" />
        {actionLabel}
      </Link>
    </section>
  );
}
