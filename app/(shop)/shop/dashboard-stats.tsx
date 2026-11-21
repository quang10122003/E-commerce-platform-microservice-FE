import { Package, ShoppingBag, Star, TrendingDown, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { percentChange } from "@/lib/utils/shop-analytics.utils";
import type { SellerOrderOverview } from "@/types/shop/overview";
import type { SellerProductOverview } from "@/types/shop/product";

interface Stat {
  title: string;
  value: string;
  change: string;
  positive: boolean | null;
  subtext: string;
  icon: LucideIcon;
  color: string;
  surface: string;
}

function changeText(current: number, previous: number): Pick<Stat, "change" | "positive"> {
  const change = percentChange(current, previous);
  if (change === null) return { change: "Hôm qua chưa có", positive: null };
  return { change: `${change > 0 ? "+" : ""}${change.toFixed(1)}% so hôm qua`, positive: change >= 0 };
}

export function DashboardStats({ orders, products }: { orders: SellerOrderOverview | null; products: SellerProductOverview | null }) {
  const today = orders?.today;
  const reviews = orders?.reviews;
  const stats: Stat[] = [
    {
      title: "Doanh Thu Hôm Nay", value: today ? formatCurrency(today.revenue) : "—",
      ...(today ? changeText(today.revenue, today.yesterdayRevenue) : { change: "Không tải được", positive: null }),
      subtext: today ? `Hôm qua ${formatCurrency(today.yesterdayRevenue)}` : "",
      icon: Wallet, color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60", surface: "from-emerald-50/90 to-white border-emerald-200/70",
    },
    {
      title: "Đơn Hàng Hôm Nay", value: today ? `${today.orderCount} đơn` : "—",
      ...(today ? changeText(today.orderCount, today.yesterdayOrderCount) : { change: "Không tải được", positive: null }),
      subtext: today ? `${today.cancelledCount} đơn bị hủy` : "",
      icon: ShoppingBag, color: "bg-orange-50 text-cta border border-orange-200/60", surface: "from-orange-50/90 to-white border-orange-200/70",
    },
    {
      title: "Đánh Giá Cửa Hàng", value: reviews?.averageRating != null ? `${reviews.averageRating.toFixed(1)} / 5.0` : "—",
      change: reviews ? `+${reviews.newReviewsLast7Days} đánh giá 7 ngày` : "Không tải được", positive: reviews ? true : null,
      subtext: reviews ? `${reviews.totalReviews} lượt đánh giá` : "",
      icon: Star, color: "bg-amber-50 text-amber-700 border border-amber-200/60", surface: "from-amber-50/90 to-white border-amber-200/70",
    },
    {
      title: "Sản Phẩm Đang Bán", value: products ? `${products.activeProducts} / ${products.totalProducts}` : "—",
      change: products ? `${products.outOfStockProducts} hết hàng` : "Không tải được", positive: products ? products.outOfStockProducts === 0 : null,
      subtext: products ? `${products.inactiveProducts} đang ẩn` : "",
      icon: Package, color: "bg-rose-50 text-rose-700 border border-rose-200/60", surface: "from-rose-50/90 to-white border-rose-200/70",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const Trend = stat.positive === false ? TrendingDown : TrendingUp;
        return (
          <article key={stat.title} className={`space-y-2.5 rounded-lg border bg-gradient-to-br p-3 transition-colors hover:border-slate-300 sm:space-y-3 sm:p-5 ${stat.surface}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium leading-snug text-slate-600 sm:text-xs">{stat.title}</span>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md sm:h-9 sm:w-9 ${stat.color}`}><Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" /></div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold tracking-tight text-main sm:text-2xl">{stat.value}</div>
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-slate-100 pt-2 text-[11px]">
                <span className={`flex items-center gap-1 font-semibold ${stat.positive === null ? "text-muted-foreground" : stat.positive ? "text-emerald-700" : "text-cta"}`}><Trend className="h-3 w-3" />{stat.change}</span>
                <span className="font-medium text-muted-foreground">{stat.subtext}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
