import Image from "next/image";
import { Store, ShieldCheck, MessageSquare, Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CheckoutShopGroup } from "@/types/user/checkout";
import type { UseFormRegisterReturn } from "react-hook-form";

// Hiển thị danh sách sản phẩm cần thanh toán phân theo từng gian hàng.
export function CheckoutItemsGroup({ groups, noteField, noteError }: { groups: CheckoutShopGroup[]; noteField: UseFormRegisterReturn<"note">; noteError?: string }) {
  return (
    <div className="space-y-4" aria-label="Danh sách kiện hàng">
      {groups.map((shop) => (
        <section
          key={shop.shopId}
          className="overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-xs"
        >
          {/* Header thông tin Shop */}
          <div className="flex items-center justify-between border-b border-surface-border bg-slate-50/80 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-primary">
                <Store className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 px-1.5 py-0.5 rounded-xs tracking-wide">
                Mall
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-main">{shop.shopName}</h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
              <ShieldCheck className="h-3 w-3" /> Đảm bảo chính hãng
            </span>
          </div>

          {/* Danh sách từng mặt hàng trong Shop */}
          <div className="divide-y divide-surface-border">
            {shop.items.map((item) => (
              <div key={item.variantId} className="grid grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 sm:p-5">
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-slate-50">
                  {item.imageUrl ? <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  /> : <span className="flex h-full items-center justify-center text-muted-foreground"><Package className="h-6 w-6" aria-label="Chưa có ảnh sản phẩm" /></span>}
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-main hover:text-primary transition-colors">
                    {item.productName}
                  </h3>
                  {item.variantOptions.length > 0 && <p className="inline-block rounded-xs bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    Phân loại: {item.variantOptions.map((option) => `${option.name} ${option.value}`).join(" · ")}
                  </p>}
                  <p className="text-xs text-muted-foreground">Số lượng: x{item.quantity}</p>
                </div>
                {/* Giá sale và giá thường cùng thuộc một sản phẩm trên mọi màn hình. */}
                <div className="col-start-2 space-y-1 text-xs tabular-nums sm:col-start-auto sm:pl-4 sm:text-right">
                  {item.saleQuantity > 0 && item.sale && <div className="space-y-0.5">
                    <del className="text-muted-foreground">{formatCurrency(item.price)}</del>
                    <p className="font-semibold text-cta">{item.saleQuantity} × {formatCurrency(item.sale.salePrice)}</p>
                  </div>}
                  {item.regularQuantity > 0 && <p className="text-main">{item.regularQuantity} × {formatCurrency(item.price)}</p>}
                </div>
              </div>
            ))}
          </div>

        </section>
      ))}
      {/* Một ghi chú chung cho toàn bộ checkout, không tách theo shop. */}
      <section className="space-y-3 rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5" aria-labelledby="checkout-note-label">
        <label id="checkout-note-label" htmlFor="checkout-note" className="flex items-center gap-2 text-sm font-semibold text-main">
          <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Ghi chú cho đơn hàng
        </label>
        <input
          id="checkout-note"
          {...noteField}
          type="text"
          maxLength={1000}
          aria-invalid={!!noteError}
          aria-describedby={noteError ? "checkout-note-error" : undefined}
          placeholder="Ví dụ: giao giờ hành chính, đóng gói cẩn thận..."
          className="w-full rounded-lg border border-surface-border bg-white px-3 py-2 text-xs text-main placeholder:text-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
        {noteError && <p id="checkout-note-error" role="alert" className="text-xs text-danger">{noteError}</p>}
      </section>
    </div>
  );
}
