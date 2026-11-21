"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, FileText, MessageSquare, Package, Phone, User, XCircle } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { OrderTimeView } from "@/components/user/orders/OrderTimeView";
import { formatCurrency } from "@/lib/utils";
import { OrderCancelAction } from "@/components/user/orders/OrderCancelAction";
import { CANCEL_REASON_LABELS, canCancelOrder, formatVariantAttributes } from "@/lib/utils/order.utils";
import { SHOP_CANCELLED_BY_LABELS, getShopPaymentState } from "@/lib/utils/shop-order.utils";
import type { ShopOrder } from "@/types/shop/order";
import { OrderAdvanceAction } from "./order-advance-action";
import { ORDER_STATUS_CONFIG } from "./order-status-config";

interface OrderCardItemProps {
  order: ShopOrder;
  onOpenDetail: (order: ShopOrder) => void;
}

// Thẻ một đơn của shop: mã đơn, khách, sản phẩm, ghi chú, thông tin hủy và tiền thanh toán.
export function OrderCardItem({ order, onOpenDetail }: OrderCardItemProps) {
  // Hiện dấu tích ngắn sau khi sao chép mã đơn.
  const [copied, setCopied] = useState(false);
  const statusCfg = ORDER_STATUS_CONFIG[order.status];
  const paymentState = getShopPaymentState(order);

  const copyOrderId = () => {
    navigator.clipboard?.writeText(String(order.orderId));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-slate-300 hover:shadow-xs">
      {/* Đầu thẻ: mã đơn, giờ đặt, khách hàng và trạng thái. */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-900">#{order.orderId}</span>
            <button type="button" onClick={copyOrderId} title="Sao chép mã đơn" aria-label="Sao chép mã đơn" className="rounded p-0.5 text-slate-400 transition-colors hover:text-slate-700">
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <span className="text-[11px] font-medium text-slate-500">Đặt lúc: <OrderTimeView value={order.createdAt} /></span>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{order.buyer.recipientName ?? "—"}</span>
            {order.buyer.phone && <span className="hidden items-center gap-1 text-[11px] text-slate-400 sm:inline-flex"><Phone className="h-3 w-3" />{order.buyer.phone}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order.priceType === "SALE" && <Badge variant="flame" size="xs">Flash Sale</Badge>}
          <Badge variant={statusCfg.badgeVariant} size="sm">{statusCfg.label}</Badge>
        </div>
      </header>

      {/* Danh sách sản phẩm trong đơn. */}
      <div className="divide-y divide-slate-100 px-4 sm:px-5">
        {order.items.map((item) => {
          const variant = formatVariantAttributes(item.variantAttributes);
          return (
            <div key={item.orderItemId} className="flex items-start gap-3 py-3 sm:gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-primary-light sm:h-16 sm:w-16">
                {item.imageUrl
                  ? <Image src={item.imageUrl} alt={item.productName} fill unoptimized sizes="64px" className="object-cover" />
                  : <Package className="absolute inset-0 m-auto h-6 w-6 text-primary" aria-hidden="true" />}
              </div>
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => onOpenDetail(order)} className="line-clamp-1 text-left text-xs font-semibold text-slate-800 hover:text-primary sm:text-sm">{item.productName}</button>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {variant && <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{variant}</span>}
                  <span className="text-xs text-slate-500">x{item.quantity}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                {item.originalUnitPrice > item.unitPrice && <div className="text-[11px] text-slate-400 line-through">{formatCurrency(item.originalUnitPrice)}</div>}
                <div className="text-xs font-bold text-slate-800 sm:text-sm">{formatCurrency(item.unitPrice)}</div>
                {item.quantity > 1 && <div className="text-[11px] font-medium text-slate-500">Tổng: {formatCurrency(item.totalAmount)}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Ghi chú của khách khi đặt hàng. */}
      {order.buyer.note && (
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-lg border border-amber-200/80 bg-amber-50/60 p-2.5 text-xs text-amber-900 sm:mx-5">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div><span className="font-bold">Ghi chú của khách: </span><span>{order.buyer.note}</span></div>
        </div>
      )}

      {/* Ai hủy, lý do và thời điểm hủy. */}
      {order.status === "CANCEL" && order.cancelledBy && (
        <div className="mx-4 mb-3 flex items-start gap-2 rounded-lg border border-rose-200/80 bg-rose-50/60 p-2.5 text-xs text-rose-900 sm:mx-5">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          <div>
            <span className="font-bold">{SHOP_CANCELLED_BY_LABELS[order.cancelledBy]}</span>
            {order.cancelReason && <span>: {CANCEL_REASON_LABELS[order.cancelReason]}</span>}
            {order.cancelledAt && <span className="ml-2 text-[11px] text-rose-700">(<OrderTimeView value={order.cancelledAt} />)</span>}
          </div>
        </div>
      )}

      {/* Chân thẻ: thanh toán, tổng tiền và xem chi tiết. */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-4 py-3 sm:px-5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-500">{order.payment.method === "COD" ? "Thanh toán khi nhận hàng (COD)" : "VNPay"}</span>
            <span className={`rounded px-1.5 text-[10px] font-bold ${paymentState.paid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{paymentState.label}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs font-medium text-slate-500">Tổng thanh toán:</span>
            <span className="text-base font-black text-cta sm:text-lg">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => onOpenDetail(order)} className="text-xs text-slate-600 hover:text-slate-900">
            <FileText className="mr-1 h-3.5 w-3.5" /> Xem chi tiết
          </Button>
          {/* Shop chỉ hủy đơn COD trước khi giao cho đơn vị vận chuyển, giống rule của BE. */}
          {canCancelOrder(order) && <OrderCancelAction orderId={order.orderId} scope="shop" />}
          <OrderAdvanceAction order={order} />
        </div>
      </footer>
    </article>
  );
}
