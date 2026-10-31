"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Plus, RotateCcw, Search, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShopFlashSaleItemsTable } from "./shop-flash-sale-items-table";
import { useShopFlashSaleItems } from "@/hooks/shop/flash-sale/useShopFlashSaleItems";

type ShopFlashSaleItemsViewProps = {
  campaignId: string;
  isModal?: boolean;
  registrationOpen?: boolean;
  isHistory?: boolean;
};

// Hiển thị phân loại đã đăng ký theo chuẩn Shadcn UI; hook quản lý tải dữ liệu và tìm kiếm.
export function ShopFlashSaleItemsView({ campaignId, isModal = false, registrationOpen = true, isHistory = false }: ShopFlashSaleItemsViewProps) {
  const { keywordInput, setKeywordInput, debouncedKeyword, items, loading, error, handleRetry, close } =
    useShopFlashSaleItems(campaignId);

  return (
    <div className="flex flex-col gap-4">
      {/* Thanh công cụ quản trị trong Card Shadcn */}
      <Card className="rounded-xl border border-surface-border bg-white shadow-2xs">
        <CardContent className="p-3.5 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              {!isModal && (
                <Link
                  href="/shop/flash-sales"
                  className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-surface-border bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-main transition shadow-2xs shrink-0"
                  aria-label="Quay lại danh sách chương trình"
                >
                  <ArrowLeft className="size-4" />
                  <span className="hidden sm:inline">Quay lại</span>
                </Link>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="primary-soft" className="font-mono text-xs font-bold px-2.5 py-1">
                  Chiến dịch #{campaignId}
                </Badge>
                <Badge variant="outline" className="text-2xs text-muted-foreground font-mono hidden sm:inline-flex">
                  {items.length} phân loại đã đăng ký
                </Badge>
              </div>
            </div>

            {/* Thanh công cụ tìm kiếm */}
            <div className="relative w-full min-w-0 sm:max-w-md sm:flex-1">
              <Input
                type="text"
                aria-label="Tìm theo tên sản phẩm"
                placeholder="Tìm theo tên sản phẩm..."
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                leftIcon={<Search className="size-4 text-muted-foreground" />}
                rightIcon={
                  keywordInput ? (
                    <button
                      type="button"
                      onClick={() => setKeywordInput("")}
                      className="rounded p-0.5 hover:bg-surface-subtle text-muted-foreground hover:text-main transition"
                      aria-label="Xóa từ khóa tìm kiếm"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : undefined
                }
                className="h-10 text-sm bg-white"
              />
            </div>

            {/* Nút đăng ký thêm sản phẩm chỉ hiển thị khi còn hạn đăng ký. */}
            {registrationOpen && <div className="flex items-center gap-2 sm:ml-auto">
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
            </div>}
          </div>
        </CardContent>
      </Card>

      {/* Khu vực hiển thị nội dung: Loading, Error hoặc Table */}
      {loading ? (
        <Card className="rounded-xl border border-surface-border bg-white shadow-2xs">
          <CardContent className="flex h-52 items-center justify-center p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <Loader2 className="size-4 animate-spin text-primary" />
              Đang tải danh sách phân loại sản phẩm...
            </div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="rounded-xl border border-danger/20 bg-danger-light shadow-2xs">
          <CardContent className="flex flex-col items-center justify-center gap-3 p-8 text-center text-sm text-danger">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={handleRetry} className="gap-1.5 rounded-lg">
              <RotateCcw className="size-3.5" />
              Thử lại
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ShopFlashSaleItemsTable campaignId={campaignId} items={items} keyword={debouncedKeyword} isHistory={isHistory} />
      )}

      {/* Chân trang khi hiển thị dạng modal */}
      {isModal && (
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={close} className="rounded-lg">
            Đóng
          </Button>
        </div>
      )}
    </div>
  );
}
