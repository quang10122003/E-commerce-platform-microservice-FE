import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { ShopFlashSaleItem } from "@/types/shop/flash-sale";

// Hiển thị kết quả tham gia Flash Sale, không có thao tác thay đổi đăng ký.
export function ShopFlashSaleHistoryItemsRow({ item }: { item: ShopFlashSaleItem }) {
  return (
    <TableRow className="transition-colors hover:bg-slate-50 border-b border-surface-border lg:[&>td]:px-2.5 lg:[&>td]:break-words">
      {/* Tên sản phẩm và mã lượt đăng ký. */}
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

      {/* Thuộc tính phân loại hoặc giá trị mặc định. */}
      <TableCell className="px-4 py-3.5">
        <span className={cn("inline-block rounded-md px-2 py-0.5 text-xs font-medium",
          item.options.length === 0 ? "italic text-muted-foreground bg-slate-100" : "text-slate-700 bg-slate-100 border border-slate-200/80")}
        >
          {item.options.length ? item.options.map((opt) => `${opt.name}: ${opt.value}`).join(" · ") : "Mặc định"}
        </span>
      </TableCell>

      {/* Số lượng đăng ký và bán ra lấy trực tiếp từ API. */}
      <TableCell className="px-4 py-3.5">
        <span className="font-semibold tabular-nums text-main text-xs sm:text-sm bg-slate-50 border border-slate-100 rounded px-2 py-1 inline-block">
          {item.registeredQuantity.toLocaleString("vi-VN")}
        </span>
      </TableCell>
      <TableCell className="px-4 py-3.5 font-semibold tabular-nums text-main text-xs sm:text-sm">
        {item.sold_quality.toLocaleString("vi-VN")}
      </TableCell>

      {/* Tình trạng tồn tại và duyệt đăng ký của phân loại. */}
      <TableCell className="px-4 py-3.5">
        <Badge variant="outline" size="sm" className={cn("whitespace-nowrap font-medium text-2xs",
          item.variantDeleted ? "bg-rose-50 text-rose-600 border-rose-200/80" : "bg-slate-100 text-slate-600 border-slate-200")}
        >
          {item.variantDeleted ? "Đã gỡ khỏi shop" : "Còn trong shop"}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3.5">
        <Badge variant="outline" size="sm" className={cn("whitespace-nowrap font-medium text-2xs",
          item.status === "REGISTERED" ? "bg-emerald-50 text-emerald-700 border-emerald-200/80" : "bg-slate-100 text-slate-600 border-slate-200")}
        >
          {item.status === "REGISTERED" ? "Đã đăng ký" : "Admin hủy"}
        </Badge>
      </TableCell>

      {/* Mức giảm đăng ký giữ nguyên từ API. */}
      <TableCell className="px-4 py-3.5">
        {item.discountPercent == null ? <span className="text-muted-foreground">—</span> : (
          <Badge variant="outline" size="sm" className="font-semibold text-2xs bg-amber-50 text-amber-700 border-amber-200/80">
            -{item.discountPercent.toLocaleString("vi-VN")}%
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
}
