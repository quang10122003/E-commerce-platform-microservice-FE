"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  ReceiptText,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { SEARCH_DEBOUNCE_MS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ORDER_KEYWORD_MAX_LENGTH, ORDER_STATUS_TABS, getOrdersUrl } from "@/lib/utils/order.utils";
import { getNearbySellerPages } from "@/lib/utils/shop-product.utils";
import type { UserOrderPage, UserOrderQuery } from "@/types/user/order";
import { OrderCardView } from "./OrderCardView";

interface OrdersViewProps {
  query: UserOrderQuery;
  data: UserOrderPage | null;
}

// Trang đơn mua: trạng thái, từ khóa và trang nằm trên URL để BE lọc trên toàn bộ đơn.
export function OrdersView({ query, data: page }: OrdersViewProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(query.keyword ?? "");
  const data = page?.items ?? null;

  const debouncedKeyword = useDebouncedValue(searchTerm.trim(), SEARCH_DEBOUNCE_MS);
  const clearSearch = () => setSearchTerm("");

  // Gõ xong mới gọi BE; replace để mỗi lần gõ không tạo thêm một bước lịch sử.
  useEffect(() => {
    if (debouncedKeyword === (query.keyword ?? "")) return;
    router.replace(getOrdersUrl({ status: query.status, keyword: debouncedKeyword || null }), { scroll: false });
  }, [debouncedKeyword, query.keyword, query.status, router]);

  return (
    <div className="w-full space-y-5">
      {/* 1. Tổng số đơn và ô tìm kiếm */}
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <h1 className="sr-only">Đơn mua của tôi</h1>
        <div className="flex items-center gap-2.5 pl-1">
          <span className="flex size-9.5 items-center justify-center rounded-xl bg-primary-light text-primary">
            <ReceiptText className="size-4.5" strokeWidth={1.8} aria-hidden="true" />
          </span>
          <p className="text-sm text-slate-500">
            <span className="text-base font-black tabular-nums text-slate-900">{page ? page.totalItems.toLocaleString("vi-VN") : "—"}</span>
            {" "}{query.keyword ? "đơn khớp tìm kiếm" : "đơn hàng"}
          </p>
        </div>

        <form role="search" onSubmit={(event) => event.preventDefault()} className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          <input
            type="search"
            value={searchTerm}
            maxLength={ORDER_KEYWORD_MAX_LENGTH}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm mã đơn, tên shop, sản phẩm..."
            aria-label="Tìm đơn hàng"
            className="h-9.5 w-full rounded-xl border border-transparent bg-slate-50 pl-10 pr-9 text-sm text-slate-800 placeholder-slate-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
              aria-label="Xóa tìm kiếm"
            >
              <X className="size-4" />
            </button>
          )}
        </form>
      </div>

      {/* 2. Thanh Tabs trạng thái đơn hàng */}
      <nav
        className="-mx-4 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:overflow-visible sm:px-0"
        aria-label="Lọc theo trạng thái đơn"
      >
        <div className="flex w-fit min-w-max items-center gap-1 rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-2xs sm:w-full sm:justify-between sm:gap-2">
          {ORDER_STATUS_TABS.map((tab) => {
            const active = tab.status === query.status;
            return (
              <Link
                key={tab.label}
                href={getOrdersUrl({ status: tab.status, keyword: query.keyword })}
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

      {/* 3. Nội dung danh sách: Lỗi kết nối, Không khớp từ khóa, Danh sách rỗng, hoặc Danh sách đơn */}
      {!data ? (
        <OrdersStateView
          title="Chưa thể tải đơn hàng"
          description="Đã có lỗi khi kết nối máy chủ. Hãy thử tải lại danh sách đơn."
          actionHref={getOrdersUrl(query)}
          actionLabel="Thử tải lại"
          error
        />
      ) : data.length === 0 && query.keyword ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <Search className="size-10 text-slate-300 mb-2.5" />
          <h3 className="text-sm font-bold text-slate-800">Không tìm thấy đơn hàng nào</h3>
          <p className="mt-1 text-xs text-slate-500">
            Không có đơn nào khớp với từ khóa &ldquo;{query.keyword}&rdquo;
          </p>
          <button
            type="button"
            onClick={clearSearch}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Xóa tìm kiếm để xem tất cả
          </button>
        </div>
      ) : data.length === 0 ? (
        <OrdersStateView
          title="Chưa có đơn hàng nào"
          description="Các đơn hàng bạn đặt tại sàn sẽ xuất hiện tại đây để theo dõi tiến độ giao hàng."
          actionHref="/"
          actionLabel="Khám phá sản phẩm ngay"
        />
      ) : (
        <section aria-label="Danh sách đơn hàng" className="space-y-4">
          {query.keyword && (
            <p className="text-xs text-slate-500 font-medium">
              Tìm thấy <span className="font-bold text-slate-800">{page?.totalItems}</span> đơn hàng khớp &ldquo;{query.keyword}&rdquo;:
            </p>
          )}
          {data.map((order) => (
            <OrderCardView key={order.orderId} order={order} />
          ))}
          {page && <OrdersPagination query={query} page={page} />}
        </section>
      )}
    </div>
  );
}

// Phân trang theo metadata BE, giữ tab trạng thái và từ khóa đang chọn trên URL.
function OrdersPagination({ query, page }: { query: UserOrderQuery; page: UserOrderPage }) {
  if (page.totalPages <= 1) return null;
  const pageClass = "flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary";
  const href = (target: number) => getOrdersUrl({ status: query.status, keyword: query.keyword, page: target });
  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 pt-2" aria-label="Phân trang đơn hàng">
      {page.page > 1
        ? <Link href={href(page.page - 1)} scroll={false} aria-label="Trang trước" className={pageClass}><ChevronLeft className="size-4" /></Link>
        : <span aria-hidden="true" className={cn(pageClass, "opacity-40")}><ChevronLeft className="size-4" /></span>}
      {getNearbySellerPages(page.page, page.totalPages).map((target) => target === page.page
        ? <span key={target} aria-current="page" className="flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">{target}</span>
        : <Link key={target} href={href(target)} scroll={false} aria-label={`Trang ${target}`} className={pageClass}>{target}</Link>)}
      {page.page < page.totalPages
        ? <Link href={href(page.page + 1)} scroll={false} aria-label="Trang sau" className={pageClass}><ChevronRight className="size-4" /></Link>
        : <span aria-hidden="true" className={cn(pageClass, "opacity-40")}><ChevronRight className="size-4" /></span>}
    </nav>
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
