import Image from "next/image";
import { ArrowRight, Package } from "lucide-react";
import { ORDER_STATUS_CONFIG } from "@/components/shop/orders/order-status-config";
import { formatCurrency } from "@/lib/utils";
import { CANCEL_REASON_LABELS } from "@/lib/utils/order.utils";
import { formatMinutes } from "@/lib/utils/shop-analytics.utils";
import type { ShopAnalytics } from "@/types/shop/analytics";
import type { OrderStatus } from "@/types/user/order";
import { AnalyticsEmpty } from "./analytics-panel";

const PIPELINE: Array<{ status: OrderStatus; bar: string }> = [
  { status: "PENDING_CONFIRMATION", bar: "bg-amber-400" },
  { status: "PENDING_PICKUP", bar: "bg-indigo-400" },
  { status: "SHIPPING", bar: "bg-blue-400" },
  { status: "DONE", bar: "bg-emerald-500" },
  { status: "CANCEL", bar: "bg-rose-400" },
];

const CANCELLED_BY = {
  USER: { label: "Khách hủy", bar: "bg-amber-400" },
  SHOP: { label: "Shop hủy", bar: "bg-rose-400" },
  SYSTEM: { label: "Hệ thống hủy", bar: "bg-slate-400" },
};

// Thanh ngang tỉ lệ theo giá trị lớn nhất trong nhóm.
function ValueBar({ ratio, className }: { ratio: number; className: string }) {
  return <div className="h-2 overflow-hidden rounded-sm bg-slate-100"><div className={`h-full rounded-sm ${className}`} style={{ width: `${Math.max(ratio * 100, 2)}%` }} /></div>;
}

// Tiền và số đơn đang nằm ở từng chặng xử lý của các đơn đặt trong kỳ.
export function OrderPipeline({ byStatus }: { byStatus: ShopAnalytics["byStatus"] }) {
  if (byStatus.length === 0) return <AnalyticsEmpty />;
  const max = Math.max(...byStatus.map((slice) => slice.amount));
  return (
    <ul className="space-y-3">
      {PIPELINE.map(({ status, bar }) => {
        const slice = byStatus.find((item) => item.key === status);
        return (
          <li key={status} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="shrink-0 font-semibold text-slate-700">{ORDER_STATUS_CONFIG[status].label}</span>
              <span className="text-right text-slate-500"><span className="font-bold text-slate-900">{formatCurrency(slice?.amount ?? 0)}</span> · {slice?.orderCount ?? 0} đơn</span>
            </div>
            <ValueBar ratio={slice && max > 0 ? slice.amount / max : 0} className={bar} />
          </li>
        );
      })}
    </ul>
  );
}

// Lý do hủy xếp theo giá trị mất, tô màu theo bên hủy.
export function CancelReasons({ cancellations }: { cancellations: ShopAnalytics["cancellations"] }) {
  if (cancellations.length === 0) return <AnalyticsEmpty label="Không có đơn nào bị hủy trong kỳ" />;
  const sorted = [...cancellations].sort((a, b) => b.amount - a.amount);
  return (
    <ul className="space-y-3">
      {sorted.map((slice) => (
        <li key={`${slice.cancelledBy}-${slice.reason}`} className="space-y-1.5">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="min-w-0 truncate font-semibold text-slate-700">{slice.reason ? CANCEL_REASON_LABELS[slice.reason] : "Không ghi lý do"}<span className="ml-1.5 font-medium text-slate-400">· {CANCELLED_BY[slice.cancelledBy].label}</span></span>
            <span className="shrink-0 text-slate-500"><span className="font-bold text-slate-900">{formatCurrency(slice.amount)}</span> · {slice.orderCount} đơn</span>
          </div>
          <ValueBar ratio={slice.amount / sorted[0].amount} className={CANCELLED_BY[slice.cancelledBy].bar} />
        </li>
      ))}
    </ul>
  );
}

// Thời gian trung bình của từng chặng từ lúc đặt tới lúc giao xong.
export function ProcessingTime({ processingTime }: { processingTime: ShopAnalytics["processingTime"] }) {
  const steps = [
    { label: "Đặt → Xác nhận", value: processingTime.confirmMinutes },
    { label: "Xác nhận → Gửi hàng", value: processingTime.handoverMinutes },
    { label: "Gửi hàng → Giao xong", value: processingTime.deliveryMinutes },
  ];
  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      {steps.map((step, index) => (
        <li key={step.label} className="flex flex-1 items-center gap-2">
          <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <p className="text-[11px] font-medium text-slate-500">{step.label}</p>
            <p className="mt-1 text-lg font-black text-slate-900">{formatMinutes(step.value)}</p>
          </div>
          {index < steps.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-300 sm:block" aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}

// Sản phẩm bán chạy theo doanh thu của các đơn chưa hủy đặt trong kỳ.
export function TopProducts({ topProducts }: { topProducts: ShopAnalytics["topProducts"] }) {
  if (topProducts.length === 0) return <AnalyticsEmpty />;
  const max = topProducts[0].revenue;
  return (
    <ol className="space-y-3">
      {topProducts.map((product, index) => (
        <li key={`${product.productId}-${product.productName}`} className="flex items-center gap-3">
          <span className="w-5 shrink-0 text-center text-xs font-black text-slate-400">{index + 1}</span>
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-primary-light">
            {product.imageUrl
              ? <Image src={product.imageUrl} alt={product.productName} fill unoptimized sizes="44px" className="object-cover" />
              : <Package className="absolute inset-0 m-auto h-5 w-5 text-primary" aria-hidden="true" />}
          </div>
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-semibold text-slate-800">{product.productName}</span>
              <span className="shrink-0 text-slate-500"><span className="font-bold text-slate-900">{formatCurrency(product.revenue)}</span> · {product.quantity} sp</span>
            </div>
            <ValueBar ratio={max > 0 ? product.revenue / max : 0} className="bg-primary" />
          </div>
        </li>
      ))}
    </ol>
  );
}
