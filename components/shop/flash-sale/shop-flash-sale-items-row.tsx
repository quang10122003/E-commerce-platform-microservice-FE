"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { Package, Pencil, Save, Trash2, X } from "lucide-react";
import { isValidDiscountPercent } from "@/lib/utils/flash-sale.utils";
import { useShopFlashSaleItemEdit } from "@/hooks/shop/flash-sale/useShopFlashSaleItemEdit";
import { ShopFlashSaleItemPriceView } from "./shop-flash-sale-item-price-view";
import type { ShopFlashSaleItem } from "@/types/shop/flash-sale";
import { cn } from "@/lib/utils";

// Dòng hiển thị thông tin một phân loại đã đăng ký trong bảng theo chuẩn Shadcn TableRow.
export function ShopFlashSaleItemsRow({
  campaignId,
  item,
  onDelete,
  isDeleting,
  deletePending,
}: {
  campaignId: string;
  item: ShopFlashSaleItem;
  onDelete: (item: ShopFlashSaleItem) => void;
  isDeleting: boolean;
  deletePending: boolean;
}) {
  const editor = useShopFlashSaleItemEdit(campaignId, item);
  const { register, formState: { errors } } = editor.form;

  // Ghép các thuộc tính phân loại; nếu mảng rỗng thì hiển thị "Mặc định"
  const formattedOptions =
    item.options.length > 0
      ? item.options.map((opt) => `${opt.name}: ${opt.value}`).join(" · ")
      : "Mặc định";

  // Kiểm tra trạng thái đăng ký của phân loại trong chiến dịch
  const isRegistered = item.status === "REGISTERED";

  return (
    <TableRow
      className="transition-colors hover:bg-slate-50 border-b border-surface-border lg:[&>td]:px-2.5 lg:[&>td]:break-words"
      onKeyDown={(event) => {
        if (editor.editing && event.key === "Escape") {
          event.stopPropagation();
          editor.cancelEdit();
        }
      }}
    >
      {/* Tên sản phẩm, icon đại diện và mã phân loại */}
      <TableCell className="px-5 py-3.5">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
            <Package className="size-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-main line-clamp-2 text-xs sm:text-sm leading-tight">{item.productName}</p>
            <p className="mt-0.5 text-xs font-mono text-muted-foreground">ID: #{item.itemId}</p>
          </div>
        </div>
      </TableCell>

      {/* Thuộc tính phân loại hoặc giá trị mặc định */}
      <TableCell className="px-4 py-3.5">
        <span
          className={cn(
            "inline-block rounded-md px-2 py-0.5 text-xs font-medium",
            item.options.length === 0
              ? "italic text-muted-foreground bg-slate-100"
              : "text-slate-700 bg-slate-100 border border-slate-200/80"
          )}
        >
          {formattedOptions}
        </span>
      </TableCell>

      {/* Số lượng đăng ký được sửa trực tiếp, không vượt một nửa tồn kho */}
      <TableCell className="px-4 py-3.5">
        {editor.editing ? (
          <div className="min-w-36 lg:min-w-0">
            <Input
              type="number"
              inputMode="numeric"
              min="1"
              max={editor.quantityLimit}
              step="1"
              disabled={!editor.canEditQuantity || editor.saving}
              aria-label={`Số lượng đăng ký, mã ${item.itemId}`}
              aria-invalid={!!errors.registeredQuantity}
              className="min-w-0 px-2 text-xs h-9 bg-white"
              {...register("registeredQuantity", {
                valueAsNumber: true,
                required: "Nhập số lượng đăng ký.",
                onChange: editor.changeQuantity,
                validate: editor.validateQuantity,
              })}
              error={errors.registeredQuantity?.message}
              helperText={
                item.stockQuantity == null
                  ? "Chưa có tồn kho."
                  : `Kho: ${item.stockQuantity.toLocaleString("vi-VN")} (≤ ${editor.quantityLimit})`
              }
            />
          </div>
        ) : (
          <span className="font-semibold tabular-nums text-main text-xs sm:text-sm bg-slate-50 border border-slate-100 rounded px-2 py-1 inline-block">
            {item.registeredQuantity.toLocaleString("vi-VN")}
          </span>
        )}
      </TableCell>

      {/* Tình trạng tồn tại của phân loại trong shop */}
      <TableCell className="px-4 py-3.5">
        <Badge
          variant="outline"
          size="sm"
          className={cn(
            "whitespace-nowrap font-medium text-2xs",
            item.variantDeleted
              ? "bg-rose-50 text-rose-600 border-rose-200/80"
              : "bg-slate-100 text-slate-600 border-slate-200"
          )}
        >
          {item.variantDeleted ? "Đã gỡ khỏi shop" : "Còn trong shop"}
        </Badge>
      </TableCell>

      {/* Trạng thái tham gia của phân loại trong chương trình */}
      <TableCell className="px-4 py-3.5">
        <Badge
          variant="outline"
          size="sm"
          className={cn(
            "whitespace-nowrap font-medium text-2xs",
            isRegistered
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
              : "bg-slate-100 text-slate-600 border-slate-200"
          )}
        >
          {isRegistered ? "Đã đăng ký" : "Admin hủy"}
        </Badge>
      </TableCell>

      {/* Mức giảm đăng ký lấy trực tiếp từ API */}
      <TableCell className="px-4 py-3.5">
        {editor.editing ? (
          <div className="min-w-32 lg:min-w-0">
            <Input
              type="number"
              inputMode="decimal"
              min="1"
              max="99"
              step="0.01"
              disabled={editor.saving}
              aria-label={`Mức giảm giá (%), mã ${item.itemId}`}
              aria-invalid={!!errors.discountPercent}
              className="min-w-0 px-2 text-xs h-9 bg-white"
              {...register("discountPercent", {
                valueAsNumber: true,
                required: "Nhập mức giảm giá.",
                onChange: editor.changeDiscount,
                validate: (value) => isValidDiscountPercent(value) || "Từ 1–99%, tối đa 2 số lẻ.",
              })}
              error={errors.discountPercent?.message}
              helperText="1–99%"
            />
          </div>
        ) : item.discountPercent == null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <Badge variant="outline" size="sm" className="font-semibold text-2xs bg-amber-50 text-amber-700 border-amber-200/80">
            -{item.discountPercent.toLocaleString("vi-VN")}%
          </Badge>
        )}
      </TableCell>

      {/* Giá do backend tính; khi đổi mức giảm thì hiển thị ô giá dự kiến */}
      <TableCell className="w-48 min-w-48 px-5 py-3.5 lg:w-auto lg:min-w-0">
        <ShopFlashSaleItemPriceView itemId={item.itemId} originalPrice={item.salePrice} editor={editor} />
      </TableCell>

      {/* Cụm thao tác chỉnh sửa hoặc xóa đăng ký */}
      <TableCell className="w-36 min-w-36 px-4 py-3.5 lg:w-auto lg:min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {editor.changed ? (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={editor.cancelEdit}
                disabled={editor.saving}
                className="h-8 gap-1 px-2 text-xs text-slate-600 hover:text-main"
              >
                <X className="size-3.5" aria-hidden="true" /> Hủy
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={editor.save}
                disabled={editor.saving || isDeleting || item.variantDeleted || item.status !== "REGISTERED"}
                isLoading={editor.saving}
                className="h-8 gap-1 px-2 text-xs shadow-none"
              >
                <Save className="size-3.5" aria-hidden="true" /> Lưu
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={item.variantDeleted || item.status !== "REGISTERED" || isDeleting}
              onClick={editor.editing ? editor.cancelEdit : editor.startEdit}
              aria-label={`${editor.editing ? "Thoát chỉnh sửa" : "Chỉnh sửa đăng ký"} ${item.productName}, mã ${item.itemId}`}
              title={
                item.variantDeleted
                  ? "Sản phẩm đã gỡ khỏi shop, không thể chỉnh sửa"
                  : item.status !== "REGISTERED"
                  ? "Admin đã hủy đăng ký, không thể chỉnh sửa"
                  : editor.editing
                  ? "Thoát chỉnh sửa"
                  : "Chỉnh sửa đăng ký"
              }
              className="h-8 gap-1 rounded-lg border-slate-200 text-xs font-medium text-slate-700 hover:text-primary hover:border-primary/40 shadow-none"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
              Sửa
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={editor.editing || deletePending}
            isLoading={isDeleting}
            onClick={() => onDelete(item)}
            aria-label={`Xóa đăng ký ${item.productName}, mã ${item.itemId}`}
            title="Xóa đăng ký"
            className="h-8 w-8 rounded-lg text-danger hover:bg-danger-light hover:text-danger"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
        {editor.changed && (
          <p className="mt-1 text-2xs text-muted-foreground">
            {editor.saving ? "Đang lưu..." : "Chưa lưu thay đổi."}
          </p>
        )}
      </TableCell>
    </TableRow>
  );
}
