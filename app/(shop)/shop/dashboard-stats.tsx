import { AlertTriangle, DollarSign, Star, TrendingUp, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const stats = [
  { title: "Doanh Thu Hôm Nay", value: formatCurrency(8450000), change: "+18.5%", positive: true, subtext: "16 đơn hoàn thành", icon: DollarSign, color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60", surface: "from-emerald-50/90 to-white border-emerald-200/70" },
  { title: "Chờ Giao Vận Chuyển", value: "8 đơn", change: "Cần gửi gấp", positive: false, subtext: "Hạn chót 17:00", icon: Truck, color: "bg-orange-50 text-cta border border-orange-200/60", surface: "from-orange-50/90 to-white border-orange-200/70" },
  { title: "Đánh Giá Cửa Hàng", value: "4.9 / 5.0", change: "+12 đánh giá mới", positive: true, subtext: "Tỷ lệ phản hồi 99%", icon: Star, color: "bg-amber-50 text-amber-700 border border-amber-200/60", surface: "from-amber-50/90 to-white border-amber-200/70" },
  { title: "Sản Phẩm Cần Nhập", value: "3 mã SKU", change: "Tồn kho < 5", positive: false, subtext: "Sắp hết hàng", icon: AlertTriangle, color: "bg-rose-50 text-rose-700 border border-rose-200/60", surface: "from-rose-50/90 to-white border-rose-200/70" },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article key={stat.title} className={`space-y-2.5 rounded-lg border bg-gradient-to-br p-3 transition-colors hover:border-slate-300 sm:space-y-3 sm:p-5 ${stat.surface}`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium leading-snug text-slate-600 sm:text-xs">{stat.title}</span>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md sm:h-9 sm:w-9 ${stat.color}`}><Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" /></div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-bold tracking-tight text-main sm:text-2xl">{stat.value}</div>
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-slate-100 pt-2 text-[11px]">
                <span className={`flex items-center gap-1 font-semibold ${stat.positive ? "text-emerald-700" : "text-cta"}`}><TrendingUp className="h-3 w-3" />{stat.change}</span>
                <span className="font-medium text-muted-foreground">{stat.subtext}</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
