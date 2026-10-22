"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Save, Trash2, X } from "lucide-react";
import { isValidDiscountPercent } from "@/lib/utils/flash-sale.utils";
import { useShopFlashSaleItemEdit } from "@/hooks/shop/flash-sale/useShopFlashSaleItemEdit";
import { ShopFlashSaleItemPriceView } from "./shop-flash-sale-item-price-view";
import type { ShopFlashSaleItem } from "@/types/shop/flash-sale";

// Dòng hiển thị thông tin một phân loại đã đăng ký trong bảng
export function ShopFlashSaleItemsRow({ campaignId, item, onDelete, isDeleting, deletePending }: {
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
    <tr className="border-t border-surface-border transition-colors hover:bg-surface-subtle lg:[&>td]:px-2 lg:[&>td]:break-words"
      onKeyDown={(event) => {
        if (editor.editing && event.key === "Escape") {
          event.stopPropagation();
          editor.cancelEdit();
        }
      }}>
      {/* Tên sản phẩm và mã phân loại */}
      <td className="px-5 py-4">
        <p className="font-medium text-main">{item.productName}</p>
        <p className="mt-1 text-xs text-muted-foreground">ID: #{item.itemId}</p>
      </td>

      {/* Thuộc tính phân loại hoặc giá trị mặc định */}
      <td className="px-4 py-4">
        <span
          className={`inline-block text-xs ${
            item.options.length === 0
              ? "italic text-muted-foreground"
              : "text-main font-normal"
          }`}
        >
          {formattedOptions}
        </span>
      </td>

      {/* Số lượng đăng ký được sửa trực tiếp, không vượt một nửa tồn kho. */}
      <td className="px-4 py-4">
        {editor.editing ? <div className="min-w-36 lg:min-w-0">
          <Input type="number" inputMode="numeric" min="1" max={editor.quantityLimit} step="1" disabled={!editor.canEditQuantity || editor.saving}
            aria-label={`Số lượng đăng ký, mã ${item.itemId}`} aria-invalid={!!errors.registeredQuantity} className="min-w-0 px-2"
            {...register("registeredQuantity", { valueAsNumber: true, required: "Nhập số lượng đăng ký.",
              onChange: editor.changeQuantity, validate: editor.validateQuantity })}
            error={errors.registeredQuantity?.message}
            helperText={item.stockQuantity == null ? "Chưa có tồn kho." : `Kho: ${item.stockQuantity.toLocaleString("vi-VN")} · Đăng ký ≤ ${editor.quantityLimit} (50%)`} />
        </div> : <span className="font-medium tabular-nums text-main">
          {item.registeredQuantity.toLocaleString("vi-VN")}
        </span>}
      </td>

      {/* Tình trạng tồn tại của phân loại, không suy ra từ giá sale */}
      <td className="px-4 py-4">
        <Badge variant={item.variantDeleted ? "danger-soft" : "secondary"} size="sm">
          {item.variantDeleted ? "Đã gỡ khỏi shop" : "Còn trong shop"}
        </Badge>
      </td>

      {/* Trạng thái tham gia của phân loại trong chương trình Flash Sale */}
      <td className="px-4 py-4">
        {isRegistered ? (
          <Badge variant="perk-soft" size="sm">
            Đã đăng ký
          </Badge>
        ) : (
          <Badge variant="secondary" size="sm" className="bg-slate-100 text-slate-600">
            Admin hủy đăng ký
          </Badge>
        )}
      </td>

      {/* Mức giảm đăng ký lấy trực tiếp từ API, không suy ra từ giá sale */}
      <td className="px-4 py-4">
        {editor.editing ? (
          <div className="min-w-32 lg:min-w-0">
            <Input type="number" inputMode="decimal" min="1" max="99" step="0.01" disabled={editor.saving}
              aria-label={`Mức giảm giá (%), mã ${item.itemId}`} aria-invalid={!!errors.discountPercent} className="min-w-0 px-2"
              {...register("discountPercent", { valueAsNumber: true, required: "Nhập mức giảm giá.", onChange: editor.changeDiscount,
                validate: value => isValidDiscountPercent(value) || "Nhập từ 1–99%, tối đa 2 số thập phân." })}
              error={errors.discountPercent?.message} helperText="1–99% · Tối đa 2 số lẻ" />
          </div>
        ) : item.discountPercent == null ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <Badge variant="discount" size="sm">
            {item.discountPercent.toLocaleString("vi-VN")}%
          </Badge>
        )}
      </td>

      {/* Giá do backend tính; khi đổi mức giảm thì hiển thị ô giá dự kiến. */}
      <td className="w-48 min-w-48 px-5 py-4 lg:w-auto lg:min-w-0">
        <ShopFlashSaleItemPriceView itemId={item.itemId} originalPrice={item.salePrice} editor={editor} />
      </td>
      {/* Chỉ hiện Lưu và Hủy khi bản nháp thay đổi; khóa thao tác trong lúc lưu. */}
      <td className="w-36 min-w-36 px-4 py-4 lg:w-auto lg:min-w-0">
        <div className="flex flex-wrap items-start gap-1">
          <div className="flex w-16 max-w-full shrink-0 flex-col gap-1">
          {editor.changed ? <>
            <Button type="button" variant="ghost" size="sm" onClick={editor.cancelEdit} disabled={editor.saving} className="gap-1 px-1">
              <X className="size-4" aria-hidden="true" /> Hủy
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={editor.save}
              disabled={editor.saving || isDeleting || item.variantDeleted || item.status !== "REGISTERED"}
              isLoading={editor.saving} className="gap-1 px-1">
              <Save className="size-4" aria-hidden="true" /> Lưu
            </Button>
          </> : <Button type="button" variant="ghost" size="icon" disabled={item.variantDeleted || item.status !== "REGISTERED" || isDeleting}
            onClick={editor.editing ? editor.cancelEdit : editor.startEdit}
            aria-label={`${editor.editing ? "Thoát chỉnh sửa" : "Chỉnh sửa đăng ký"} ${item.productName}, mã ${item.itemId}`}
            title={item.variantDeleted ? "Sản phẩm đã gỡ khỏi shop, không thể chỉnh sửa" : item.status !== "REGISTERED" ? "Admin đã hủy đăng ký, không thể chỉnh sửa" : editor.editing ? "Thoát chỉnh sửa" : "Chỉnh sửa đăng ký"}
            className="w-full rounded-lg text-primary">
            <Pencil className="size-4" aria-hidden="true" />
          </Button>}
          </div>
          <Button type="button" variant="ghost" size="icon" disabled={editor.editing || deletePending} isLoading={isDeleting} onClick={() => onDelete(item)}
            aria-label={`Xóa đăng ký ${item.productName}, mã ${item.itemId}`} title="Xóa đăng ký" className="rounded-lg text-danger hover:bg-danger-light hover:text-danger">
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {editor.changed && <p className="mt-1 text-xs text-muted-foreground">{editor.saving ? "Đang lưu..." : "Chưa lưu thay đổi."}</p>}
      </td>
    </tr>
  );
}
