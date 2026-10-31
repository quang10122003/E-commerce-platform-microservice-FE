"use client";

import { PackageOpen, SearchX } from "lucide-react";
import { ShopFlashSaleItemsRow } from "./shop-flash-sale-items-row";
import { ShopFlashSaleHistoryItemsRow } from "./history/shop-flash-sale-history-items-row";
import { useShopFlashSaleItemActions } from "@/hooks/shop/flash-sale/useShopFlashSaleItemActions";
import type { ShopFlashSaleItem } from "@/types/shop/flash-sale";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type ShopFlashSaleItemsTableProps = {
  campaignId: string;
  items: ShopFlashSaleItem[];
  keyword: string;
  isHistory?: boolean;
};

// Bảng trình bày danh sách các phân loại đã đăng ký Flash Sale theo chuẩn Shadcn Table.
export function ShopFlashSaleItemsTable({ campaignId, items, keyword, isHistory = false }: ShopFlashSaleItemsTableProps) {
  const actions = useShopFlashSaleItemActions(campaignId);
  const isEmpty = items.length === 0;
  const hasKeyword = keyword.trim().length > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-surface-border bg-white shadow-2xs">
      {/* Vùng bảng cuộn ngang trên thiết bị nhỏ, tràn viền không có padding thừa */}
      <Table className="min-w-[1050px] lg:min-w-0 lg:table-fixed">
        {/* Giữ tỉ lệ cột trên PC để ô nhập không đẩy rộng bảng khi chỉnh sửa */}
        <colgroup>
          {isHistory ? <>
            <col className="lg:w-[26%]" />
            <col className="lg:w-[14%]" />
            <col className="lg:w-[13%]" />
            <col className="lg:w-[13%]" />
            <col className="lg:w-[12%]" />
            <col className="lg:w-[12%]" />
            <col className="lg:w-[10%]" />
          </> : <>
          <col className="lg:w-[22%]" />
          <col className="lg:w-[12%]" />
          <col className="lg:w-[12%]" />
          <col className="lg:w-[11%]" />
          <col className="lg:w-[11%]" />
          <col className="lg:w-[10%]" />
          <col className="lg:w-[12%]" />
          <col className="lg:w-[10%]" />
          </>}
        </colgroup>

        {/* Tiêu đề các cột dữ liệu theo quy chuẩn giao diện quản lý */}
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-slate-50/80 border-b border-surface-border">
            <TableHead className="px-5 py-3 text-xs font-semibold text-slate-600">
              Sản phẩm
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-slate-600">
              Phân loại
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-slate-600">
              Số lượng đăng ký
            </TableHead>
            {isHistory && <TableHead className="px-4 py-3 text-xs font-semibold text-slate-600">
              Số lượng bán ra
            </TableHead>}
            <TableHead className="px-4 py-3 text-xs font-semibold text-slate-600">
              Trạng thái kho
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-slate-600">
              Tình trạng duyệt
            </TableHead>
            <TableHead className="px-4 py-3 text-xs font-semibold text-slate-600">
              Mức giảm
            </TableHead>
            {!isHistory && <><TableHead className="px-5 py-3 text-xs font-semibold text-slate-600">
              Giá sale
            </TableHead>
            <TableHead className="px-4 py-3 text-right sm:text-left text-xs font-semibold text-slate-600">
              Thao tác
            </TableHead>
            </>}
          </TableRow>
        </TableHeader>

        {/* Nội dung danh sách phân loại hoặc trạng thái rỗng */}
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell colSpan={isHistory ? 7 : 8} className="py-14 px-4 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  {hasKeyword ? (
                    <>
                      <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <SearchX className="size-6" aria-hidden="true" />
                      </div>
                      <p className="mt-2 font-semibold text-main">Không tìm thấy sản phẩm phù hợp</p>
                      <p className="text-xs text-muted-foreground">
                        Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tên.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <PackageOpen className="size-6" aria-hidden="true" />
                      </div>
                      <p className="mt-2 font-semibold text-main">Chưa có phân loại đăng ký</p>
                      <p className="text-xs text-muted-foreground">
                        Shop chưa có phân loại sản phẩm nào tham gia chương trình Flash Sale này.
                      </p>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              isHistory ? <ShopFlashSaleHistoryItemsRow key={item.itemId} item={item} /> : <ShopFlashSaleItemsRow
                key={item.itemId}
                campaignId={campaignId}
                item={item}
                onDelete={actions.requestDelete}
                isDeleting={actions.deletingItemId === item.itemId}
                deletePending={actions.deletingItemId !== null}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
