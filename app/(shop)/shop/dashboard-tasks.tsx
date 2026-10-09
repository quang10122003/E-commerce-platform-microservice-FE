import Link from "next/link";

const tasks = [
  { label: "Đơn hàng chờ xác nhận", count: 8, href: "/shop/orders?status=pending", color: "text-cta", bg: "bg-orange-50/70 border-orange-200/60" },
  { label: "Đơn hàng đang giao", count: 24, href: "/shop/orders?status=shipping", color: "text-primary", bg: "bg-indigo-50/70 border-indigo-200/60" },
  { label: "Tin nhắn khách hàng mới", count: 3, href: "/shop/chat", color: "text-blue-600", bg: "bg-blue-50/70 border-blue-200/60" },
  { label: "Sản phẩm vi phạm", count: 0, href: "/shop/products?status=banned", color: "text-slate-400", bg: "bg-slate-50 border-slate-200/60" },
];

export function DashboardTasks() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 rounded-sm bg-cta" />
          <h3 className="text-sm font-semibold tracking-tight text-main">Danh sách cần xử lý</h3>
        </div>
        <span className="text-right text-[11px] font-medium text-muted-foreground">Cập nhật theo thời gian thực</span>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tasks.map((task) => (
          <Link key={task.label} href={task.href} className={`group rounded-lg border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm sm:p-4 ${task.bg}`}>
            <div className={`text-2xl font-bold tracking-tight sm:text-3xl ${task.color}`}>{task.count}</div>
            <div className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1 sm:text-xs">{task.label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
