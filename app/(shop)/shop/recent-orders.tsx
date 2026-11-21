import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Badge, Button, CardDescription, CardTitle } from "@/components/ui";
import { ORDER_STATUS_CONFIG } from "@/components/shop/orders/order-status-config";
import { formatCurrency } from "@/lib/utils";
import { parseOffsetDateTime } from "@/utils/date-time.utils";
import type { SellerOrderOverview, ShopOverviewDailyPoint } from "@/types/shop/overview";

function formatDay(date: string) {
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
}

export function RecentOrders({ orders }: { orders: SellerOrderOverview | null }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
        <header className="flex flex-row items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
          <div><CardTitle>Đơn Hàng Mới Nhận</CardTitle><CardDescription>Các đơn hàng khách vừa đặt tại Shop của bạn</CardDescription></div>
          <Link href="/shop/orders"><Button variant="ghost" size="sm" className="text-xs font-bold text-cta hover:text-cta-hover">Xem tất cả →</Button></Link>
        </header>
        {orders?.recentOrders.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="border-b border-surface-border bg-slate-50/70 text-[10px] font-semibold uppercase text-slate-500"><tr><th className="px-4 py-3">Mã Đơn</th><th className="px-4 py-3">Người Nhận</th><th className="px-4 py-3">Sản Phẩm</th><th className="px-4 py-3">Tổng Tiền</th><th className="px-4 py-3">Trạng Thái</th><th className="px-4 py-3">Thời Gian</th></tr></thead>
              <tbody className="divide-y divide-surface-border">
                {orders.recentOrders.map((order) => {
                  const status = ORDER_STATUS_CONFIG[order.status];
                  return (
                    <tr key={order.orderId} className="transition-colors hover:bg-slate-50/80">
                      <td className="px-4 py-3.5 font-semibold text-main">#{order.orderId}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-700">{order.recipientName ?? "—"}</td>
                      <td className="max-w-[200px] px-4 py-3.5 text-muted-foreground"><p className="truncate">{order.firstProductName ?? "—"}</p>{order.itemCount > 1 && <p className="text-[11px]">và {order.itemCount - 1} sản phẩm khác</p>}</td>
                      <td className="px-4 py-3.5"><p className="text-sm font-semibold text-cta">{formatCurrency(order.totalAmount)}</p><p className="text-[11px] text-muted-foreground">{order.paymentMethod === "VNPAY" ? "VNPay" : "COD"}</p></td>
                      <td className="px-4 py-3.5"><Badge variant={status.badgeVariant} size="sm">{status.label}</Badge></td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">{parseOffsetDateTime(order.createdAt)?.toLocaleString("vi-VN") ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">{orders ? "Shop chưa có đơn hàng nào." : "Không tải được danh sách đơn hàng, vui lòng thử lại sau."}</p>
        )}
      </section>
      <WeeklyRevenue days={orders?.last7Days ?? null} />
    </div>
  );
}

function WeeklyRevenue({ days }: { days: ShopOverviewDailyPoint[] | null }) {
  const maxRevenue = Math.max(1, ...(days ?? []).map((day) => day.revenue));
  const totalRevenue = (days ?? []).reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = (days ?? []).reduce((sum, day) => sum + day.orderCount, 0);
  return (
    <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /><div><h3 className="text-base font-semibold text-main">Doanh Thu 7 Ngày</h3><p className="text-xs text-muted-foreground">Không tính đơn đã hủy</p></div></div>
      {days ? (
        <>
          <div className="flex items-end justify-between gap-2 border-b border-slate-100 pb-3">
            <div><p className="text-xl font-bold text-main">{formatCurrency(totalRevenue)}</p><p className="text-[11px] text-muted-foreground">{totalOrders} đơn đặt</p></div>
            <Link href="/shop/analytics" className="text-xs font-semibold text-primary hover:underline">Chi tiết →</Link>
          </div>
          <ul className="space-y-2.5 text-xs">
            {days.map((day) => (
              <li key={day.date} className="flex items-center gap-2.5">
                <span className="w-10 shrink-0 text-muted-foreground">{formatDay(day.date)}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><span className="block h-full rounded-full bg-primary" style={{ width: `${(day.revenue / maxRevenue) * 100}%` }} /></span>
                <span className="w-24 shrink-0 text-right font-medium text-main">{formatCurrency(day.revenue)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : <p className="py-8 text-center text-xs text-muted-foreground">Không tải được số liệu.</p>}
    </aside>
  );
}
