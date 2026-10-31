"use client";

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useShopProductStatus } from "@/hooks/shop/products/useShopProductStatus";
import type { SellerProductItem } from "@/types/shop/product";

type ShopProductStatusToggleProps = {
  product: Pick<SellerProductItem, "id" | "name" | "status">;
  disabled?: boolean;
};

// Nút gạt bật/tắt bán hàng; giữ badge hiện có cho sản phẩm hết hàng.
export function ShopProductStatusToggle({ product, disabled = false }: ShopProductStatusToggleProps) {
  const { active, pending, toggle } = useShopProductStatus(product);
  if (product.status === "OUT_OF_STOCK") return <Badge variant="danger-soft" size="xs">Hết hàng</Badge>;

  return (
    <div className="flex flex-col items-center gap-1">
      <button type="button" role="switch" aria-checked={active} aria-busy={pending}
        aria-label={`Trạng thái ${product.name}, mã ${product.id}`} title={active ? "Ẩn sản phẩm" : "Bật bán sản phẩm"}
        disabled={disabled || pending} onClick={() => void toggle()}
        className={cn("relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none", active ? "bg-emerald-500" : "bg-slate-300")}
      >
        <span className={cn("inline-flex size-5 items-center justify-center rounded-full bg-white transition-transform motion-reduce:transition-none", active ? "translate-x-5" : "translate-x-0")}>
          {pending && <Loader2 className="size-3 animate-spin text-muted-foreground" aria-hidden="true" />}
        </span>
      </button>
      <span className={cn("whitespace-nowrap text-[10px] font-medium", active ? "text-emerald-700" : "text-muted-foreground")}>
        {active ? "Đang bán" : "Tạm ẩn"}
      </span>
    </div>
  );
}
