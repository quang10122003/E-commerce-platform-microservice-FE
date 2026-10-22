"use client";

import { PackageOpen, SearchX } from "lucide-react";
import { ShopFlashSaleItemsRow } from "./shop-flash-sale-items-row";
import { useShopFlashSaleItemActions } from "@/hooks/shop/flash-sale/useShopFlashSaleItemActions";
import type { ShopFlashSaleItem } from "@/types/shop/flash-sale";

type ShopFlashSaleItemsTableProps = {
  campaignId: string;
  items: ShopFlashSaleItem[];
  keyword: string;
};

// Bảng trình bày danh sách các phân loại đã đăng ký Flash Sale
export function ShopFlashSaleItemsTable({ campaignId, items, keyword }: ShopFlashSaleItemsTableProps) {
  const actions = useShopFlashSaleItemActions(campaignId);
  // Kiểm tra danh sách rỗng để hiển thị thông điệp phù hợp
  const isEmpty = items.length === 0;
  // Phân biệt trạng thái tìm kiếm không thấy kết quả với việc chưa từng có sản phẩm
  const hasKeyword = keyword.trim().length > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-xs">
      {/* Vùng bảng cuộn ngang trên thiết bị nhỏ */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm lg:min-w-0 lg:table-fixed lg:[&_th]:px-2">
          <caption className="sr-only">Danh sách phân loại sản phẩm đăng ký Flash Sale</caption>
          {/* Giữ tỉ lệ cột trên PC để ô nhập không đẩy rộng bảng khi chỉnh sửa. */}
          <colgroup>
            <col className="lg:w-[22%]" />
            <col className="lg:w-[10%]" />
            <col className="lg:w-[13%]" />
            <col className="lg:w-[11%]" />
            <col className="lg:w-[11%]" />
            <col className="lg:w-[10%]" />
            <col className="lg:w-[13%]" />
            <col className="lg:w-[10%]" />
          </colgroup>
          {/* Tiêu đề các cột dữ liệu */}
          <thead className="bg-surface-muted text-xs font-semibold text-muted-foreground border-b border-surface-border">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Sản phẩm
              </th>
              <th scope="col" className="px-4 py-3.5">
                Phân loại
              </th>
              <th scope="col" className="px-4 py-3.5">
                Số lượng đăng ký
              </th>
              <th scope="col" className="px-4 py-3.5">
                Trạng thái sản phẩm
              </th>
              <th scope="col" className="px-4 py-3.5">
                Trạng thái đăng ký
              </th>
              <th scope="col" className="px-4 py-3.5">
                Giảm giá
              </th>
              <th scope="col" className="px-5 py-3.5">
                Giá sale
              </th>
              <th scope="col" className="px-4 py-3.5">
                Thao tác
              </th>
            </tr>
          </thead>

          {/* Nội dung danh sách phân loại hoặc trạng thái rỗng */}
          <tbody>
            {isEmpty ? (
              <tr>
                <td colSpan={8} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    {hasKeyword ? (
                      <>
                        <SearchX className="size-8 text-muted-foreground/60" aria-hidden="true" />
                        <p className="font-medium text-main">Không tìm thấy sản phẩm phù hợp.</p>
                        <p className="text-xs text-muted-foreground">
                          Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tên.
                        </p>
                      </>
                    ) : (
                      <>
                        <PackageOpen className="size-8 text-muted-foreground/60" aria-hidden="true" />
                        <p className="font-medium text-main">Chưa có phân loại đăng ký</p>
                        <p className="text-xs text-muted-foreground">
                          Shop chưa có phân loại nào tham gia chương trình Flash Sale này.
                        </p>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <ShopFlashSaleItemsRow key={item.itemId} campaignId={campaignId} item={item} onDelete={actions.requestDelete}
                  isDeleting={actions.deletingItemId === item.itemId} deletePending={actions.deletingItemId !== null} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
