"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Plus, RotateCcw, Search, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ShopFlashSaleItemsTable } from "./shop-flash-sale-items-table";
import { useShopFlashSaleItems } from "@/hooks/shop/flash-sale/useShopFlashSaleItems";

type ShopFlashSaleItemsViewProps = {
  campaignId: string;
  isModal?: boolean;
};

// Hiển thị phân loại đã đăng ký; hook quản lý tải dữ liệu và tìm kiếm.
export function ShopFlashSaleItemsView({ campaignId, isModal = false }: ShopFlashSaleItemsViewProps) {
  const { keywordInput, setKeywordInput, debouncedKeyword, items, loading, error, handleRetry, close } =
    useShopFlashSaleItems(campaignId);

  return (
    <div className="flex flex-col gap-5 p-5 sm:p-6">
      {/* Tìm kiếm và đăng ký thêm cùng hàng trên tablet/PC, xếp dọc trên mobile. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {!isModal && (
          <Link
            href="/shop/flash-sales"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-surface-border text-muted-foreground hover:bg-surface-subtle"
            aria-label="Quay lại danh sách chương trình"
          >
            <ArrowLeft className="size-4" />
          </Link>
        )}

        {/* Thanh công cụ tìm kiếm */}
        <div className="relative w-full min-w-0 sm:max-w-md sm:flex-1">
          <Input
            type="text"
            aria-label="Tìm theo tên sản phẩm"
            placeholder="Tìm theo tên sản phẩm..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            leftIcon={<Search className="size-4" />}
            rightIcon={
              keywordInput ? (
                <button
                  type="button"
                  onClick={() => setKeywordInput("")}
                  className="rounded p-0.5 hover:bg-surface-subtle text-muted-foreground hover:text-main"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="size-3.5" />
                </button>
              ) : undefined
            }
            className="h-10 text-sm"
          />
        </div>

        {/* Đổi popup bằng replace để thao tác đóng không quay lại popup trước. */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <Link
            href={`/shop/flash-sales/${campaignId}/register`}
            replace={isModal}
            scroll={false}
            className={cn(
              buttonVariants({ variant: "gradient-cta", size: "sm" }),
              "h-10 rounded-lg shadow-none"
            )}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Đăng ký thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Khu vực hiển thị nội dung: Loading, Error hoặc Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center rounded-xl border border-surface-border bg-surface-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-primary" />
            Đang tải danh sách phân loại...
          </div>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/20 bg-danger-light p-6 text-center text-sm text-danger"
        >
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleRetry} className="gap-1.5">
            <RotateCcw className="size-3.5" />
            Thử lại
          </Button>
        </div>
      ) : (
        <ShopFlashSaleItemsTable campaignId={campaignId} items={items} keyword={debouncedKeyword} />
      )}

      {/* Chân trang khi hiển thị dạng modal */}
      {isModal && (
        <div className="flex items-center justify-end gap-2 border-t border-surface-border pt-4">
          <Button type="button" variant="outline" onClick={close}>
            Đóng
          </Button>
        </div>
      )}
    </div>
  );
}
