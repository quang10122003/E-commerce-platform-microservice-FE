"use client";

import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ShopCompletedFlashSaleCampaign } from "@/types/shop/flash-sale";
import { ShopFlashSaleHistoryRow } from "./shop-flash-sale-history-row";

interface ShopFlashSaleHistoryTableProps {
  items: ShopCompletedFlashSaleCampaign[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  error?: string;
}

// Bảng danh sách các chiến dịch Flash Sale đã hoàn thành theo chuẩn font của shop/products.
export function ShopFlashSaleHistoryTable({
  items,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  error,
}: ShopFlashSaleHistoryTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-card">
      {/* Vùng bảng cuộn ngang trên thiết bị nhỏ, tràn viền không có padding thừa */}
      <div className="flex flex-1 flex-col">
      <Table className="min-w-[950px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-slate-50/90 border-b border-slate-200">
            <TableHead className="w-[42%] px-4 py-3.5 text-sm font-semibold text-slate-600">
              Chiến dịch Flash Sale
            </TableHead>
            <TableHead className="w-[18%] px-4 py-3.5 text-sm font-semibold text-slate-600">
              Bắt đầu
            </TableHead>
            <TableHead className="w-[18%] px-4 py-3.5 text-sm font-semibold text-slate-600">
              Kết thúc
            </TableHead>
            <TableHead className="w-[12%] px-4 py-3.5 text-sm font-semibold text-slate-600">
              Thời lượng
            </TableHead>
            <TableHead className="w-[10%] px-4 py-3.5 text-right sm:text-left text-sm font-semibold text-slate-600">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-slate-100">
          {error ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} role="alert" className="p-12 text-center text-sm text-danger">
                {error}
              </TableCell>
            </TableRow>
          ) : (
            items.map((campaign) => (
              <ShopFlashSaleHistoryRow key={campaign.id} campaign={campaign} />
            ))
          )}
        </TableBody>
      </Table>
      {!error && items.length === 0 && (
        <div role="status" className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl border border-slate-200 text-slate-500">
            <SearchX className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-2 font-semibold text-sm text-main">Không tìm thấy chiến dịch phù hợp</p>
          <p className="text-sm text-muted-foreground">
            Thử điều chỉnh lại từ khóa hoặc tiêu chí lọc thời gian.
          </p>
        </div>
      )}
      </div>

      {/* Cụm thanh điều hướng phân trang dưới bảng đồng bộ với shop/products */}
      {totalItems > 0 && (
        <nav
          aria-label="Phân trang chương trình"
          className="flex flex-col gap-3 border-t border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4"
        >
          <p className="text-center text-sm font-medium text-slate-500 sm:text-left">
            Hiển thị <span className="font-bold text-slate-700">{startItem}–{endItem}</span> trong{" "}
            <span className="font-bold text-slate-700">{totalItems}</span> chiến dịch
          </p>

          <div className="flex items-center justify-center gap-1.5">
            {currentPage > 1 ? (
              <button
                type="button"
                aria-label="Trang trước"
                onClick={() => onPageChange(currentPage - 1)}
                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
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

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                aria-label={`Trang ${pageNumber}`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                className={`inline-flex h-8.5 min-w-8.5 items-center justify-center rounded-lg px-2 text-sm font-medium transition ${
                  pageNumber === currentPage
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {currentPage < totalPages ? (
              <button
                type="button"
                aria-label="Trang sau"
                onClick={() => onPageChange(currentPage + 1)}
                className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
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
