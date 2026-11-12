import { Ban, Clock, HandCoins, Receipt, ShoppingBag, TrendingDown, TrendingUp, Users, Wallet, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { percentChange } from "@/lib/utils/shop-analytics.utils";
import type { ShopAnalytics } from "@/types/shop/analytics";

interface OverviewCard {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  tone: string;
  // Thay đổi so với kỳ trước; goodWhenUp=false cho chỉ số càng thấp càng tốt.
  change?: number | null;
  goodWhenUp?: boolean;
}

// Hai hàng thẻ: dòng tiền theo từng nhóm và chỉ số vận hành của kỳ đang xem.
export function AnalyticsOverviewCards({ analytics }: { analytics: ShopAnalytics }) {
  const { overview: now, previousOverview: before } = analytics;
  const expected = now.held.amount + now.expectedCod.amount;
  const expectedBefore = before.held.amount + before.expectedCod.amount;
  const cancelledOrders = analytics.byStatus.find((slice) => slice.key === "CANCEL")?.orderCount ?? 0;
  const activeOrders = now.placed.orderCount - cancelledOrders;
  const activeAmount = analytics.byStatus.filter((slice) => slice.key !== "CANCEL").reduce((sum, slice) => sum + slice.amount, 0);

  const cards: OverviewCard[] = [
    { title: "Doanh thu đã về", value: formatCurrency(now.received.amount), subtext: `${now.received.orderCount} đơn giao xong`, icon: Wallet, tone: "text-emerald-700 bg-emerald-50 border-emerald-200/70", change: percentChange(now.received.amount, before.received.amount), goodWhenUp: true },
    { title: "Doanh thu dự kiến", value: formatCurrency(expected), subtext: `Đã thu online ${formatCurrency(now.held.amount)} · COD ${formatCurrency(now.expectedCod.amount)}`, icon: HandCoins, tone: "text-indigo-700 bg-indigo-50 border-indigo-200/70", change: percentChange(expected, expectedBefore), goodWhenUp: true },
    { title: "Chờ thanh toán", value: formatCurrency(now.awaitingPayment.amount), subtext: `${now.awaitingPayment.orderCount} đơn VNPay chưa trả, có thể bị hủy`, icon: Clock, tone: "text-amber-700 bg-amber-50 border-amber-200/70" },
    { title: "Đã mất do hủy", value: formatCurrency(now.lost.amount), subtext: now.refundDue.orderCount > 0 ? `Cần hoàn ${formatCurrency(now.refundDue.amount)} cho ${now.refundDue.orderCount} đơn đã trả` : `${now.lost.orderCount} đơn bị hủy`, icon: XCircle, tone: "text-rose-700 bg-rose-50 border-rose-200/70", change: percentChange(now.lost.amount, before.lost.amount), goodWhenUp: false },
    { title: "Giá trị đặt hàng", value: formatCurrency(now.placed.amount), subtext: `${now.placed.orderCount} đơn đặt trong kỳ`, icon: ShoppingBag, tone: "text-slate-700 bg-slate-50 border-slate-200", change: percentChange(now.placed.amount, before.placed.amount), goodWhenUp: true },
    { title: "Giá trị đơn trung bình", value: activeOrders > 0 ? formatCurrency(activeAmount / activeOrders) : "—", subtext: "Không tính đơn đã hủy", icon: Receipt, tone: "text-slate-700 bg-slate-50 border-slate-200" },
    { title: "Tỷ lệ hủy", value: now.placed.orderCount > 0 ? `${((cancelledOrders / now.placed.orderCount) * 100).toFixed(1)}%` : "—", subtext: `${cancelledOrders}/${now.placed.orderCount} đơn đặt trong kỳ`, icon: Ban, tone: "text-slate-700 bg-slate-50 border-slate-200" },
    { title: "Khách mua", value: String(now.buyerCount), subtext: `Đã giảm Flash Sale ${formatCurrency(analytics.saleDiscount)}`, icon: Users, tone: "text-slate-700 bg-slate-50 border-slate-200", change: percentChange(now.buyerCount, before.buyerCount), goodWhenUp: true },
  ];

  return (
    <section aria-label="Tổng quan doanh thu" className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const up = (card.change ?? 0) >= 0;
        const TrendIcon = up ? TrendingUp : TrendingDown;
        return (
          <article key={card.title} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-slate-300 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-600 sm:text-xs">{card.title}</span>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border ${card.tone}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
            </div>
            <div className="break-words text-base font-black tracking-tight text-slate-900 sm:text-xl">{card.value}</div>
            <div className="mt-auto space-y-1 border-t border-slate-100 pt-2 text-[11px]">
              {card.change !== undefined && (
                card.change === null
                  ? <span className="font-medium text-slate-400">Kỳ trước chưa có số liệu</span>
                  : <span className={`flex items-center gap-1 font-semibold ${up === card.goodWhenUp ? "text-emerald-700" : "text-rose-600"}`}><TrendIcon className="h-3 w-3" aria-hidden="true" />{up ? "+" : ""}{card.change.toFixed(1)}% so với kỳ trước</span>
              )}
              <p className="font-medium text-slate-500">{card.subtext}</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
