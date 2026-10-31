import Link from "next/link";
import type { ShopFlashSalePage, ShopFlashSaleQuery } from "@/types/shop/flash-sale";
import { getShopFlashSalesUrl } from "@/lib/utils/flash-sale.utils";
import { ChevronLeft, ChevronRight, RotateCcw, ZapOff } from "lucide-react";
import { getNearbySellerPages } from "@/lib/utils/shop-product.utils";
import { ShopFlashSaleRow } from "./shop-flash-sale-row";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Hiển thị kết quả API và liên kết phân trang theo chuẩn font chữ của shop/products.
export function ShopFlashSaleTable({
  data,
  query,
  error,
  now,
}: {
  data: ShopFlashSalePage;
  query: ShopFlashSaleQuery;
  error?: string;
  now: number;
}) {
  const firstItem = data.totalItems === 0 ? 0 : (data.page - 1) * data.pageSize + 1;
  const lastItem = Math.min(data.page * data.pageSize, data.totalItems);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card">
      {/* Vùng bảng danh sách chương trình tràn viền không có padding thừa */}
      <div className="flex flex-1 flex-col">
      <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-slate-50/90 border-b border-slate-200">
            <TableHead className="w-[30%] px-4 py-3.5 text-sm font-semibold text-slate-600">
              Chương trình Flash Sale
            </TableHead>
            <TableHead className="w-[20%] px-4 py-3.5 text-sm font-semibold text-slate-600">
              Thời gian diễn ra
            </TableHead>
            <TableHead className="w-[20%] px-4 py-3.5 text-sm font-semibold text-slate-600">
              Hạn đăng ký
            </TableHead>
            <TableHead className="w-[14%] px-4 py-3.5 text-sm font-semibold text-slate-600">
              Trạng thái
            </TableHead>
            <TableHead className="w-[16%] px-4 py-3.5 text-right sm:text-left text-sm font-semibold text-slate-600">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-100">
          {error ? (
            <TableRow>
              <TableCell colSpan={5} className="p-8 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="font-semibold text-sm text-danger">{error}</p>
                  <Link
                    href={getShopFlashSalesUrl(query)}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary underline underline-offset-4 hover:text-primary-hover"
                  >
                    <RotateCcw className="size-3.5" />
                    Thử lại ngay
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.items.map((campaign) => (
              <ShopFlashSaleRow key={campaign.id} campaign={campaign} now={now} />
            ))
          )}
        </TableBody>
      </Table>
      {!error && data.items.length === 0 && (
        <div role="status" className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-slate-200 text-slate-400">
            <ZapOff className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-1 font-semibold text-sm text-main">Không có chương trình Flash Sale phù hợp</p>
          <p className="text-sm text-muted-foreground">
            Hiện chưa có chiến dịch nào theo tiêu chí lọc này. Hãy thử kiểm tra lại mốc thời gian.
          </p>
        </div>
      )}
      </div>

      {/* Thanh phân trang đồng bộ chuẩn với shop/products */}
      {!error && data.totalItems > 0 && (
        <nav
          aria-label="Phân trang chương trình"
          className="flex flex-col gap-3 border-t border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
        >
          <p className="text-center text-sm font-medium text-slate-500 sm:text-left">
            Hiển thị <span className="font-bold text-slate-700">{firstItem}–{lastItem}</span> trong{" "}
            <span className="font-bold text-slate-700">{data.totalItems}</span> chương trình
          </p>

          <div className="flex items-center justify-center gap-1.5">
            {data.page > 1 ? (
              <Link
                aria-label="Trang trước"
                scroll={false}
                href={getShopFlashSalesUrl({ ...query, page: data.page - 1 })}
                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                aria-label="Trang trước"
                disabled
                className="inline-flex h-8.5 w-8.5 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-300 opacity-70"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            {getNearbySellerPages(data.page, data.totalPages).map((pageNumber) => (
              <Link
                key={pageNumber}
                scroll={false}
                href={getShopFlashSalesUrl({ ...query, page: pageNumber })}
                aria-label={`Trang ${pageNumber}`}
                aria-current={pageNumber === data.page ? "page" : undefined}
                className={`inline-flex h-8.5 min-w-8.5 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                  pageNumber === data.page
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </Link>
            ))}

            {data.page < data.totalPages ? (
              <Link
                aria-label="Trang sau"
                scroll={false}
                href={getShopFlashSalesUrl({ ...query, page: data.page + 1 })}
                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                type="button"
                aria-label="Trang sau"
                disabled
                className="inline-flex h-8.5 w-8.5 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-300 opacity-70"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
