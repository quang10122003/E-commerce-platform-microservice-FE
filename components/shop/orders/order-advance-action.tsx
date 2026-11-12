"use client";

import { Check, Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui";
import { useAdvanceShopOrder } from "@/hooks/shop/orders/useAdvanceShopOrder";
import { getShopNextAction } from "@/lib/utils/shop-order.utils";
import type { ShopOrder } from "@/types/shop/order";

// Nút chuyển đơn sang bước kế tiếp; nhãn theo trạng thái hiện tại, ẩn khi shop không có bước nào để làm.
export function OrderAdvanceAction({ order }: { order: ShopOrder }) {
  const { advance, isLoading } = useAdvanceShopOrder(order);
  const label = getShopNextAction(order);
  if (!label) return null;
  const Icon = order.status === "PENDING_CONFIRMATION" ? Check : Truck;

  return (
    <Button type="button" variant="gradient-primary" size="sm" onClick={advance} disabled={isLoading} className="text-xs font-semibold">
      {isLoading ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Icon className="mr-1 h-3.5 w-3.5" />} {label}
    </Button>
  );
}
