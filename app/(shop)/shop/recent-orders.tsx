import Link from "next/link";
import { Clock, Sparkles, Star } from "lucide-react";
import { Badge, Button, CardDescription, CardTitle } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

const orders = [
  { id: "TS-8849", customer: "Trần Bảo Ngọc", product: "Tai nghe Bluetooth Pro ANC (Màu Đen x1)", total: 499000, status: "Chờ lấy hàng", statusVariant: "cta" as const },
  { id: "TS-8848", customer: "Lê Minh Quân", product: "Đồng hồ AMOLED 5ATM (Dây Silicon Cam x1)", total: 1890000, status: "Đang giao", statusVariant: "primary-soft" as const },
  { id: "TS-8847", customer: "Nguyễn Thu Hà", product: "Chuột Gaming 49g (Màu Trắng x1)", total: 680000, status: "Giao thành công", statusVariant: "perk" as const },
  { id: "TS-8846", customer: "Hoàng Văn Tuấn", product: "Bàn phím cơ không dây RGB (Switch Red x1)", total: 790000, status: "Giao thành công", statusVariant: "perk" as const },
];

export function RecentOrders() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-2">
        <header className="flex flex-row items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
          <div><CardTitle>Đơn Hàng Mới Nhận</CardTitle><CardDescription>Các đơn hàng khách vừa đặt tại Shop của bạn</CardDescription></div>
          <Link href="/shop/orders"><Button variant="ghost" size="sm" className="text-xs font-bold text-cta hover:text-cta-hover">Xem tất cả →</Button></Link>
        </header>
        <div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="border-b border-surface-border bg-slate-50/70 text-[10px] font-semibold uppercase text-slate-500"><tr><th className="px-4 py-3">Mã Đơn</th><th className="px-4 py-3">Khách Hàng</th><th className="px-4 py-3">Sản Phẩm</th><th className="px-4 py-3">Tổng Tiền</th><th className="px-4 py-3">Trạng Thái</th><th className="px-4 py-3">Hành Động</th></tr></thead>
              <tbody className="divide-y divide-surface-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-main">{order.id}</td><td className="px-4 py-3.5 font-medium text-slate-700">{order.customer}</td>
                    <td className="max-w-[180px] truncate px-4 py-3.5 text-muted-foreground">{order.product}</td><td className="px-4 py-3.5 text-sm font-semibold text-cta">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3.5"><Badge variant={order.statusVariant} size="sm">{order.status}</Badge></td>
                    <td className="px-4 py-3.5"><Button variant="outline" size="sm" className="h-7.5 rounded-md px-3 text-[11px] font-semibold hover:border-cta hover:text-cta">Xử lý đơn</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <ShopTips />
    </div>
  );
}

function ShopTips() {
  return (
    <aside className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /><div><h3 className="text-base font-semibold text-main">Bí Quyết Tăng Doanh Số</h3><p className="text-xs text-muted-foreground">Mẹo tối ưu hiệu quả gian hàng</p></div></div>
      <div className="space-y-3 text-xs">
        <div className="space-y-1 rounded-lg border border-orange-100 bg-orange-50/60 p-3.5"><div className="flex items-center gap-1.5 font-semibold text-cta"><Clock className="h-3.5 w-3.5" /> Giao hàng đúng hạn</div><p className="text-[11px] leading-relaxed text-slate-600">Giao hàng trước 16h giúp tăng 35% tỷ lệ khách quay lại mua lần sau.</p></div>
        <div className="space-y-1 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3.5"><div className="flex items-center gap-1.5 font-semibold text-primary"><Star className="h-3.5 w-3.5" /> Tạo Voucher giảm giá</div><p className="text-[11px] leading-relaxed text-slate-600">Các shop có voucher 10k-20k thu hút nhiều lượt thêm vào giỏ hàng hơn.</p></div>
      </div>
      <Link href="/shop/vouchers/new" className="block pt-1"><Button variant="gradient-primary" size="md" fullWidth className="rounded-md text-xs font-semibold shadow-none">Tạo Mã Khuyến Mãi Ngay</Button></Link>
    </aside>
  );
}
