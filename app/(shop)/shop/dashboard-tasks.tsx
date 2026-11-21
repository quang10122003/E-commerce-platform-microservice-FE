import Link from "next/link";
import type { SellerOrderOverview } from "@/types/shop/overview";
import type { SellerProductOverview } from "@/types/shop/product";

export function DashboardTasks({ orders, products }: { orders: SellerOrderOverview | null; products: SellerProductOverview | null }) {
  const tasks = [
    { label: "Đơn hàng chờ xác nhận", count: orders?.ordersByStatus.PENDING_CONFIRMATION, href: "/shop/orders", color: "text-cta", bg: "bg-orange-50/70 border-orange-200/60" },
    { label: "Đơn hàng chờ lấy hàng", count: orders?.ordersByStatus.PENDING_PICKUP, href: "/shop/orders", color: "text-amber-600", bg: "bg-amber-50/70 border-amber-200/60" },
    { label: "Đơn hàng đang giao", count: orders?.ordersByStatus.SHIPPING, href: "/shop/orders", color: "text-primary", bg: "bg-indigo-50/70 border-indigo-200/60" },
    { label: "Sản phẩm hết hàng", count: products?.outOfStockProducts, href: "/shop/products?status=OUT_OF_STOCK", color: "text-rose-600", bg: "bg-rose-50/70 border-rose-200/60" },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-5 w-1 rounded-sm bg-cta" />
        <h3 className="text-sm font-semibold tracking-tight text-main">Danh sách cần xử lý</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tasks.map((task) => (
          <Link key={task.label} href={task.href} className={`group rounded-lg border p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm sm:p-4 ${task.count ? task.bg : "bg-slate-50 border-slate-200/60"}`}>
            <div className={`text-2xl font-bold tracking-tight sm:text-3xl ${task.count ? task.color : "text-slate-400"}`}>{task.count ?? "—"}</div>
            <div className="mt-1.5 text-[11px] font-medium text-slate-700 line-clamp-1 sm:text-xs">{task.label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
