import Link from "next/link";
import type { ShopFlashSalePage, ShopFlashSaleQuery } from "@/types/shop/flash-sale";
import { getShopFlashSalesUrl } from "@/lib/utils/flash-sale.utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getNearbySellerPages } from "@/lib/utils/shop-product.utils";
import { ShopFlashSaleRow } from "./shop-flash-sale-row";

// Hiển thị kết quả API và liên kết phân trang giữ nguyên điều kiện lọc.
export function ShopFlashSaleTable({ data, query, error, now }: { data: ShopFlashSalePage; query: ShopFlashSaleQuery; error?: string; now: number }) {
  return (
    <section aria-label="Danh sách chương trình Flash Sale" className="overflow-hidden rounded-xl border border-surface-border bg-surface-card">
      {/* Cuộn ngang bảng trên màn hình nhỏ, không làm tràn toàn bộ trang. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <caption className="sr-only">Các chương trình Flash Sale và hạn đăng ký của Shop</caption>
          <thead className="bg-surface-muted text-xs font-semibold text-muted-foreground">
            <tr>
              <th scope="col" className="px-5 py-3.5">Chương trình</th>
              <th scope="col" className="px-4 py-3.5">Thời gian diễn ra</th>
              <th scope="col" className="px-4 py-3.5">Hạn đăng ký</th>
              <th scope="col" className="px-4 py-3.5">Khả năng đăng ký</th>
              <th scope="col" className="px-5 py-3.5">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {error ? <tr><td colSpan={5} role="alert" className="p-6 text-center text-danger">{error}<Link href={getShopFlashSalesUrl(query)} className="ml-2 underline">Thử lại</Link></td></tr>
              : data.items.length === 0 ? <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Không có chương trình phù hợp với bộ lọc.</td></tr>
              : data.items.map((campaign) => <ShopFlashSaleRow key={campaign.id} campaign={campaign} now={now} />)}
          </tbody>
        </table>
      </div>
      {/* Số trang thật từ API; cụm tối đa 5 nút dùng helper hiện có. */}
      {!error && data.totalItems > 0 && <nav aria-label="Phân trang chương trình sale" className="flex flex-col gap-3 border-t border-surface-border bg-surface-card px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="text-center text-xs font-medium text-muted-foreground sm:text-left">Hiển thị <span className="font-bold text-main">{data.items.length ? (data.page - 1) * data.pageSize + 1 : 0}–{Math.min(data.page * data.pageSize, data.totalItems)}</span> trong <span className="font-bold text-main">{data.totalItems}</span> chương trình</p>
        <div className="flex items-center justify-center gap-1.5">
          {data.page > 1 ? <Link aria-label="Trang trước" scroll={false} href={getShopFlashSalesUrl({ ...query, page: data.page - 1 })} className="inline-flex size-8.5 items-center justify-center rounded-lg border border-surface-border text-muted-foreground hover:bg-surface-subtle"><ChevronLeft className="size-4" /></Link> : <button type="button" aria-label="Trang trước" disabled className="inline-flex size-8.5 items-center justify-center rounded-lg border border-surface-border bg-surface-muted text-placeholder"><ChevronLeft className="size-4" /></button>}
          {getNearbySellerPages(data.page, data.totalPages).map((pageNumber) => (
            <Link key={pageNumber} scroll={false} href={getShopFlashSalesUrl({ ...query, page: pageNumber })} aria-label={`Trang ${pageNumber}`} aria-current={pageNumber === data.page ? "page" : undefined}
              className={`inline-flex h-8.5 min-w-8.5 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${pageNumber === data.page ? "bg-primary text-white shadow-md shadow-primary/20" : "border border-surface-border text-muted-foreground hover:bg-surface-subtle"}`}>
              {pageNumber}
            </Link>
          ))}
          {data.page < data.totalPages ? <Link aria-label="Trang sau" scroll={false} href={getShopFlashSalesUrl({ ...query, page: data.page + 1 })} className="inline-flex size-8.5 items-center justify-center rounded-lg border border-surface-border text-muted-foreground hover:bg-surface-subtle"><ChevronRight className="size-4" /></Link> : <button type="button" aria-label="Trang sau" disabled className="inline-flex size-8.5 items-center justify-center rounded-lg border border-surface-border bg-surface-muted text-placeholder"><ChevronRight className="size-4" /></button>}
        </div>
      </nav>}

    </section>
  );
}
