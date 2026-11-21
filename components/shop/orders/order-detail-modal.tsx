"use client";

import Image from "next/image";
import { useEffect } from "react";
import { House, Mail, MapPin, Package, Phone, User, Wallet, X } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { OrderTimelineView } from "@/components/user/orders/OrderTimelineView";
import { OrderTimeView } from "@/components/user/orders/OrderTimeView";
import { formatCurrency } from "@/lib/utils";
import { formatVariantAttributes } from "@/lib/utils/order.utils";
import { getShopOrderPriceSummary, getShopPaymentState } from "@/lib/utils/shop-order.utils";
import type { ShopOrder } from "@/types/shop/order";
import { ORDER_STATUS_CONFIG } from "./order-status-config";

interface OrderDetailModalProps {
  order: ShopOrder | null;
  onClose: () => void;
}

// Modal chi tiết đơn của shop, chỉ hiển thị dữ liệu BE trả về và các giá trị tính được từ đó.
export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  // Khóa cuộn trang nền và khôi phục trạng thái cũ khi đóng chi tiết.
  useEffect(() => {
    if (!order) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [order]);

  if (!order) return null;
  const statusCfg = ORDER_STATUS_CONFIG[order.status];
  const price = getShopOrderPriceSummary(order);
  const paymentState = getShopPaymentState(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" role="dialog" aria-modal="true" aria-labelledby="shop-order-detail-title">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Tiêu đề và trạng thái đơn. */}
        <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <h3 id="shop-order-detail-title" className="text-base font-bold text-slate-900 sm:text-lg">Chi tiết đơn hàng #{order.orderId}</h3>
            <Badge variant={statusCfg.badgeVariant} size="sm">{statusCfg.label}</Badge>
          </div>
          <button type="button" onClick={onClose} aria-label="Đóng" className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto overscroll-contain p-5">
          {/* Dòng thời gian từng bước kèm mốc giờ BE trả về. */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Tiến độ đơn hàng</h4>
            <OrderTimelineView order={order} />
          </div>

          {/* Người nhận từ snapshot checkout và thông tin thanh toán. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-800"><MapPin className="h-4 w-4 text-cta" /> Thông tin nhận hàng</div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800"><User className="h-3.5 w-3.5 text-slate-400" />{order.buyer.recipientName ?? "—"}</div>
              <div className="flex items-center gap-1.5 text-slate-600"><Mail className="h-3.5 w-3.5 text-slate-400" />{order.buyer.email}</div>
              {order.buyer.phone && <div className="flex items-center gap-1.5 text-slate-600"><Phone className="h-3.5 w-3.5 text-slate-400" />{order.buyer.phone}</div>}
              <div className="flex items-start gap-1.5 leading-relaxed text-slate-600"><House className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />{order.buyer.shippingAddress}</div>
            </div>
            <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-slate-800"><Wallet className="h-4 w-4 text-primary" /> Thanh toán</div>
              <div><span className="text-slate-500">Phương thức: </span><span className="font-semibold">{order.payment.method === "COD" ? "Thanh toán khi nhận hàng (COD)" : "VNPay"}</span></div>
              <div><span className="text-slate-500">Trạng thái: </span><span className="font-semibold">{paymentState.label}</span></div>
              <div><span className="text-slate-500">Đặt lúc: </span><OrderTimeView value={order.createdAt} /></div>
              {order.payment.method === "VNPAY" && order.payment.status === "PENDING" && order.payment.expiresAt && (
                <div><span className="text-slate-500">Hạn thanh toán: </span><OrderTimeView value={order.payment.expiresAt} /></div>
              )}
            </div>
          </div>

          {/* Sản phẩm trong đơn. */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Danh sách sản phẩm ({order.items.length})</h4>
            <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
              {order.items.map((item) => (
                <div key={item.orderItemId} className="flex items-center gap-3 bg-white p-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-primary-light">
                    {item.imageUrl
                      ? <Image src={item.imageUrl} alt="" fill unoptimized sizes="48px" className="object-cover" />
                      : <Package className="absolute inset-0 m-auto h-5 w-5 text-primary" aria-hidden="true" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800">{item.productName}</p>
                    {item.variantAttributes && <p className="text-[11px] text-slate-500">{formatVariantAttributes(item.variantAttributes)}</p>}
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-slate-900">{formatCurrency(item.unitPrice)}</p>
                    <p className="text-slate-500">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tiền hàng tính từ item; tổng thanh toán là số BE đã chốt. */}
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
            <div className="flex justify-between text-slate-600"><span>Tiền hàng (giá gốc):</span><span className="font-medium text-slate-900">{formatCurrency(price.originalTotal)}</span></div>
            {price.saleDiscount > 0 && (
              <div className="flex justify-between text-emerald-600"><span>Giảm giá Flash Sale:</span><span className="font-medium">-{formatCurrency(price.saleDiscount)}</span></div>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
              <span>Tổng thanh toán:</span><span className="text-base font-black text-cta">{formatCurrency(price.totalAmount)}</span>
            </div>
          </div>
        </div>

        <footer className="flex items-center justify-end border-t border-slate-200 bg-slate-50/80 px-5 py-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Đóng</Button>
        </footer>
      </div>
    </div>
  );
}
