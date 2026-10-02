import Link from "next/link";
import { Card } from "@/components/ui";

const tasks = [
  { label: "Đơn hàng chờ xác nhận", count: 8, href: "/shop/orders?status=pending", color: "text-cta", bg: "bg-orange-50/70 border-orange-200/60" },
  { label: "Đơn hàng đang giao", count: 24, href: "/shop/orders?status=shipping", color: "text-primary", bg: "bg-indigo-50/70 border-indigo-200/60" },
  { label: "Tin nhắn khách hàng mới", count: 3, href: "/shop/chat", color: "text-blue-600", bg: "bg-blue-50/70 border-blue-200/60" },
  { label: "Sản phẩm vi phạm", count: 0, href: "/shop/products?status=banned", color: "text-slate-400", bg: "bg-slate-50 border-slate-200/60" },
];

export function DashboardTasks() {
  return (
    <Card variant="3d" className="p-5">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-5 rounded-full bg-cta" />
          <h3 className="text-sm font-black text-main uppercase tracking-tight">Danh Sách Cần Xử Lý Ngay</h3>
        </div>
        <span className="text-[11px] text-muted-foreground font-medium">Cập nhật theo thời gian thực</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {tasks.map((task) => (
          <Link key={task.label} href={task.href} className={`p-4 rounded-2xl border ${task.bg} hover:shadow-3d hover:-translate-y-1 text-center transition-all duration-200 group cursor-pointer`}>
            <div className={`text-2xl sm:text-3xl font-black ${task.color} group-hover:scale-105 transition-transform`}>{task.count}</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-700 mt-1.5 line-clamp-1">{task.label}</div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
