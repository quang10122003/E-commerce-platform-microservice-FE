import Link from "next/link";
import { Clock, Sparkles, Star } from "lucide-react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
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
      <Card variant="3d" className="lg:col-span-2 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <div><CardTitle>Đơn Hàng Mới Nhận</CardTitle><CardDescription>Các đơn hàng khách vừa đặt tại Shop của bạn</CardDescription></div>
          <Link href="/shop/orders"><Button variant="ghost" size="sm" className="text-xs font-bold text-cta hover:text-cta-hover">Xem tất cả →</Button></Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 border-b border-surface-border text-slate-500 uppercase font-bold text-[10px]"><tr><th className="py-3 px-4">Mã Đơn</th><th className="py-3 px-4">Khách Hàng</th><th className="py-3 px-4">Sản Phẩm</th><th className="py-3 px-4">Tổng Tiền</th><th className="py-3 px-4">Trạng Thái</th><th className="py-3 px-4">Hành Động</th></tr></thead>
              <tbody className="divide-y divide-surface-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-black text-main">{order.id}</td><td className="py-3.5 px-4 font-bold text-slate-700">{order.customer}</td>
                    <td className="py-3.5 px-4 text-muted-foreground max-w-[180px] truncate">{order.product}</td><td className="py-3.5 px-4 font-black text-cta text-sm">{formatCurrency(order.total)}</td>
                    <td className="py-3.5 px-4"><Badge variant={order.statusVariant} size="sm">{order.status}</Badge></td>
                    <td className="py-3.5 px-4"><Button variant="outline" size="sm" className="h-7.5 text-[11px] px-3 font-bold rounded-lg hover:border-cta hover:text-cta">Xử lý đơn</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <ShopTips />
    </div>
  );
}

function ShopTips() {
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" /><div><h3 className="font-bold text-main text-base">Bí Quyết Tăng Doanh Số</h3><p className="text-xs text-muted-foreground">Mẹo tối ưu hiệu quả gian hàng</p></div></div>
      <div className="space-y-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-1"><div className="font-bold text-cta flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Giao hàng đúng hạn</div><p className="text-slate-600 text-[11px] leading-relaxed">Giao hàng trước 16h giúp tăng 35% tỷ lệ khách quay lại mua lần sau.</p></div>
        <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1"><div className="font-bold text-primary flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Tạo Voucher giảm giá</div><p className="text-slate-600 text-[11px] leading-relaxed">Các shop có voucher 10k-20k thu hút nhiều lượt thêm vào giỏ hàng hơn.</p></div>
      </div>
      <Link href="/shop/vouchers/new" className="block pt-1"><Button variant="gradient-primary" size="md" fullWidth className="text-xs font-bold rounded-xl shadow-glow-primary">Tạo Mã Khuyến Mãi Ngay</Button></Link>
    </Card>
  );
}
