import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  CheckCircle2,
  CircleDashed,
  CircleX,
  CreditCard,
  PackageCheck,
  RotateCcw,
  Store,
  Truck,
} from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import {
  CANCEL_REASON_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  canCancelOrder,
} from "@/lib/utils/order.utils";
import { getCheckoutUrl } from "@/utils/checkout.utils";
import type { OrderStatus, UserOrder } from "@/types/user/order";
import { OrderCancelAction } from "./OrderCancelAction";
import { OrderTimelineView } from "./OrderTimelineView";
import { OrderItemView } from "./OrderItemView";
import { OrderPaymentAction } from "./OrderPaymentAction";
import { OrderReviewAction } from "./OrderReviewAction";
import { OrderTimeView } from "./OrderTimeView";

const STATUS_BADGE: Record<OrderStatus, BadgeProps["variant"]> = {
  PENDING_CONFIRMATION: "star",
  PENDING_PICKUP: "primary-soft",
  SHIPPING: "primary",
  DONE: "perk-soft",
  CANCEL: "danger-soft",
};

const STATUS_ICON = {
  PENDING_CONFIRMATION: CircleDashed,
  PENDING_PICKUP: PackageCheck,
  SHIPPING: Truck,
  DONE: CheckCircle2,
  CANCEL: CircleX,
} satisfies Record<OrderStatus, typeof CircleDashed>;

const CANCELLED_BY_LABELS: Record<NonNullable<UserOrder["cancelledBy"]>, string> = {
  USER: "Bạn đã hủy đơn",
  SHOP: "Đơn đã bị người bán hủy",
  SYSTEM: "Hệ thống tự động hủy do thanh toán không thành công",
};

// Thẻ một đơn hàng: thông tin Shop, danh sách sản phẩm, thanh toán và các hành động phù hợp.
export function OrderCardView({ order }: { order: UserOrder }) {
  const { payment } = order;
  const StatusIcon = STATUS_ICON[order.status];

  // Sản phẩm nào variantId null thì bỏ qua, chỉ lấy variant hợp lệ cùng số lượng 1 để chuyển sang checkout
  const repurchaseItems = order.items
    .filter((item): item is typeof item & { variantId: number } => typeof item.variantId === "number")
    .map((item) => ({ variantId: item.variantId, quantity: 1 }));
  const canRepurchase = (order.status === "DONE" || order.status === "CANCEL") && repurchaseItems.length > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-slate-300 hover:shadow-md">
      {/* 1. Header: Shop Info, Order Code & Status Badge */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
          {/* Shop branding link */}
          <Link
            href={`/shops/${order.shop.shopId}`}
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800 hover:text-primary transition-colors"
          >
            <span className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white text-primary shadow-2xs">
              {order.shop.shopLogoUrl ? (
                <Image
                  src={order.shop.shopLogoUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="28px"
                  className="object-cover"
                />
              ) : (
                <Store className="size-3.5" aria-hidden="true" />
              )}
            </span>
            <span className="truncate max-w-[180px] sm:max-w-[260px]">{order.shop.shopName}</span>
          </Link>

          <span className="text-slate-300 font-light">|</span>

          {/* Mã đơn hàng */}
          <span className="text-xs font-mono text-slate-500 font-medium">
            #{order.orderId}
          </span>
        </div>

        {/* Trạng thái đơn */}
        <div className="flex items-center gap-2">
          {order.priceType === "SALE" && (
            <Badge variant="flame" size="xs">
              Flash Sale
            </Badge>
          )}
          <Badge variant={STATUS_BADGE[order.status]} size="sm">
            <StatusIcon className="mr-1 size-3.5" aria-hidden="true" />
            {ORDER_STATUS_LABELS[order.status]}
          </Badge>
        </div>
      </header>

      {/* 2. Danh sách sản phẩm trong đơn */}
      <div className="divide-y divide-slate-100">
        {order.items.map((item) => {
          // BE quyết định đơn còn hạn đánh giá theo đồng hồ của server.
          const reviewable = order.reviewable && !item.reviewed;
          return (
            <div key={item.orderItemId}>
              <OrderItemView item={item} />
              {/* Đánh giá đặt ngoài link sản phẩm vì không được lồng nút trong thẻ a. */}
              {(reviewable || item.reviewed) && (
                <div className="flex justify-end px-4 pb-3 sm:px-5">
                  {reviewable ? <OrderReviewAction item={item} /> : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                      <BadgeCheck className="size-3.5" aria-hidden="true" /> Đã đánh giá
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Khối thông báo hủy khi đơn bị hủy */}
      {order.status === "CANCEL" && order.cancelledBy && (
        <div className="mx-4 my-3 rounded-xl border border-danger/20 bg-danger-light/70 px-4 py-2.5 text-xs text-danger-hover sm:mx-5">
          <div className="font-semibold flex items-center gap-1.5">
            <CircleX className="size-3.5" />
            <span>{CANCELLED_BY_LABELS[order.cancelledBy]}</span>
            {order.cancelledAt && (
              <span className="font-normal text-danger-hover/80">
                (vào lúc <OrderTimeView value={order.cancelledAt} />)
              </span>
            )}
          </div>
          {order.cancelReason && (
            <p className="mt-1 text-[11px] text-danger-hover/90">
              Lý do hủy: <span className="font-medium">{CANCEL_REASON_LABELS[order.cancelReason]}</span>
            </p>
          )}
        </div>
      )}

      {/* Tiến độ đơn kèm mốc giờ từng bước; details native để mở/đóng không cần state. */}
      <details className="group mx-4 mb-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 sm:mx-5">
        <summary className="cursor-pointer select-none text-xs font-semibold text-slate-600 marker:text-slate-400 hover:text-primary">Tiến độ đơn hàng</summary>
        <div className="pt-3"><OrderTimelineView order={order} /></div>
      </details>

      {/* 4. Footer: Phương thức thanh toán, Tổng tiền & Hành động */}
      <footer className="flex flex-col gap-3.5 border-t border-slate-100 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="space-y-1 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              {payment.method === "COD" ? (
                <Truck className="size-3.5 text-perk" aria-hidden="true" />
              ) : (
                <CreditCard className="size-3.5 text-primary" aria-hidden="true" />
              )}
              {payment.method === "COD" ? "Thanh toán khi nhận hàng (COD)" : "Cổng VNPay"}
            </span>

            {payment.method !== "COD" && payment.status !== "PENDING" && payment.status !== "CANCEL" && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                <BadgeCheck className="size-3" aria-hidden="true" />
                {PAYMENT_STATUS_LABELS[payment.status]}
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Đặt ngày: <OrderTimeView value={order.createdAt} />
          </div>
        </div>

        {/* Tổng tiền & Cụm nút hành động */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:justify-end sm:border-0 sm:pt-0">
          <div className="text-right">
            <span className="text-xs text-slate-500 mr-2">Thành tiền:</span>
            <span className="text-base sm:text-lg font-black text-cta">
              {formatCurrency(order.totalAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Nút hủy đơn khi còn trong hạn */}
            {canCancelOrder(order) && <OrderCancelAction orderId={order.orderId} />}

            {/* Nút thanh toán VNPay khi đang chờ */}
            {payment.method === "VNPAY" && payment.status === "PENDING" && order.status !== "CANCEL" && (
              <OrderPaymentAction payment={payment} />
            )}

            {/* Nút Mua lại chuyển thẳng sang checkout với variantId cùng số lượng 1 */}
            {canRepurchase && (
              <Link
                href={getCheckoutUrl(repurchaseItems)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs sm:text-sm font-semibold text-slate-700 transition-colors hover:border-cta hover:text-cta active:scale-95"
              >
                <RotateCcw className="size-3.5" />
                <span>Mua lại</span>
              </Link>
            )}
          </div>
        </div>
      </footer>
    </article>
  );
}
