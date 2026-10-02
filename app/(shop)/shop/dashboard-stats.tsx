import { AlertTriangle, DollarSign, Star, TrendingUp, Truck } from "lucide-react";
import { Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

const stats = [
  { title: "Doanh Thu Hôm Nay", value: formatCurrency(8450000), change: "+18.5%", positive: true, subtext: "16 đơn hoàn thành", icon: DollarSign, color: "bg-emerald-50 text-emerald-600 border border-emerald-200/60", gradient: "from-emerald-500/10 to-teal-500/5" },
  { title: "Chờ Giao Vận Chuyển", value: "8 đơn", change: "Cần gửi gấp", positive: false, subtext: "Hạn chót 17:00", icon: Truck, color: "bg-orange-50 text-cta border border-orange-200/60", gradient: "from-orange-500/10 to-amber-500/5" },
  { title: "Đánh Giá Cửa Hàng", value: "4.9 / 5.0", change: "+12 đánh giá mới", positive: true, subtext: "Tỷ lệ phản hồi 99%", icon: Star, color: "bg-amber-50 text-amber-600 border border-amber-200/60", gradient: "from-amber-500/10 to-yellow-500/5" },
  { title: "Sản Phẩm Cần Nhập", value: "3 mã SKU", change: "Tồn kho < 5", positive: false, subtext: "Sắp hết hàng", icon: AlertTriangle, color: "bg-rose-50 text-rose-600 border border-rose-200/60", gradient: "from-rose-500/10 to-red-500/5" },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} variant="3d" className={`p-5 space-y-3 bg-gradient-to-br ${stat.gradient} border-slate-200/90 hover:shadow-3d-hover hover:-translate-y-1.5 transition-all`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{stat.title}</span>
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center shadow-xs`}><Icon className="w-4.5 h-4.5" /></div>
            </div>
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-black text-main">{stat.value}</div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                <span className={`font-black flex items-center gap-0.5 ${stat.positive ? "text-emerald-600" : "text-cta"}`}><TrendingUp className="w-3 h-3" />{stat.change}</span>
                <span className="text-muted-foreground font-medium">{stat.subtext}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
