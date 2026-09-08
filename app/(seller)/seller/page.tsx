import React from "react";
import Link from "next/link";
import {
  DollarSign,
  Star,
  Plus,
  Truck,
  AlertTriangle,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

const shopStats = [
  {
    title: "Doanh Thu Hôm Nay",
    value: formatCurrency(8450000),
    change: "+18.5%",
    isPositive: true,
    subtext: "16 đơn hoàn thành",
    icon: DollarSign,
    color: "bg-emerald-50 text-emerald-600 border border-emerald-200/60",
    gradient: "from-emerald-500/10 to-teal-500/5",
  },
  {
    title: "Chờ Giao Vận Chuyển",
    value: "8 đơn",
    change: "Cần gửi gấp",
    isPositive: false,
    subtext: "Hạn chót 17:00",
    icon: Truck,
    color: "bg-orange-50 text-cta border border-orange-200/60",
    gradient: "from-orange-500/10 to-amber-500/5",
  },
  {
    title: "Đánh Giá Cửa Hàng",
    value: "4.9 / 5.0",
    change: "+12 đánh giá mới",
    isPositive: true,
    subtext: "Tỷ lệ phản hồi 99%",
    icon: Star,
    color: "bg-amber-50 text-amber-600 border border-amber-200/60",
    gradient: "from-amber-500/10 to-yellow-500/5",
  },
  {
    title: "Sản Phẩm Cần Nhập",
    value: "3 mã SKU",
    change: "Tồn kho < 5",
    isPositive: false,
    subtext: "Sắp hết hàng",
    icon: AlertTriangle,
    color: "bg-rose-50 text-rose-600 border border-rose-200/60",
    gradient: "from-rose-500/10 to-red-500/5",
  },
];

const todoTasks = [
  { label: "Đơn hàng chờ xác nhận", count: 8, href: "/seller/orders?status=pending", color: "text-cta", bg: "bg-orange-50/70 border-orange-200/60" },
  { label: "Đơn hàng đang giao", count: 24, href: "/seller/orders?status=shipping", color: "text-primary", bg: "bg-indigo-50/70 border-indigo-200/60" },
  { label: "Tin nhắn khách hàng mới", count: 3, href: "/seller/chat", color: "text-blue-600", bg: "bg-blue-50/70 border-blue-200/60" },
  { label: "Sản phẩm vi phạm", count: 0, href: "/seller/products?status=banned", color: "text-slate-400", bg: "bg-slate-50 border-slate-200/60" },
];

const shopOrders = [
  {
    id: "TS-8849",
    customer: "Trần Bảo Ngọc",
    product: "Tai nghe Bluetooth Pro ANC (Màu Đen x1)",
    total: 499000,
    status: "Chờ lấy hàng",
    statusVariant: "cta" as const,
    date: "15 phút trước",
  },
  {
    id: "TS-8848",
    customer: "Lê Minh Quân",
    product: "Đồng hồ AMOLED 5ATM (Dây Silicon Cam x1)",
    total: 1890000,
    status: "Đang giao",
    statusVariant: "primary-soft" as const,
    date: "45 phút trước",
  },
  {
    id: "TS-8847",
    customer: "Nguyễn Thu Hà",
    product: "Chuột Gaming 49g (Màu Trắng x1)",
    total: 680000,
    status: "Giao thành công",
    statusVariant: "perk" as const,
    date: "2 giờ trước",
  },
  {
    id: "TS-8846",
    customer: "Hoàng Văn Tuấn",
    product: "Bàn phím cơ không dây RGB (Switch Red x1)",
    total: 790000,
    status: "Giao thành công",
    statusVariant: "perk" as const,
    date: "3 giờ trước",
  },
];

export default function SellerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. SHOP HEADER GREETING */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-3d border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Kênh Người Bán (Seller Center)
            </h1>
            <Badge variant="favorite" size="xs">
              Yêu Thích+
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-300">
            Chào mừng trở lại, <span className="text-amber-400 font-bold">TechStore Official</span>! Quản lý doanh số và tăng trưởng kinh doanh hôm nay.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/seller/products/new">
            <Button
              variant="gradient-cta"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-bold rounded-xl shadow-glow-cta"
            >
              Thêm Sản Phẩm Mới
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. TO-DO LIST */}
      <Card variant="3d" className="p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-5 rounded-full bg-cta" />
            <h3 className="text-sm font-black text-main uppercase tracking-tight">
              Danh Sách Cần Xử Lý Ngay
            </h3>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">Cập nhật theo thời gian thực</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {todoTasks.map((task, idx) => (
            <Link
              key={idx}
              href={task.href}
              className={`p-4 rounded-2xl border ${task.bg} hover:shadow-3d hover:-translate-y-1 text-center transition-all duration-200 group cursor-pointer`}
            >
              <div className={`text-2xl sm:text-3xl font-black ${task.color} group-hover:scale-105 transition-transform`}>
                {task.count}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-700 mt-1.5 line-clamp-1">
                {task.label}
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* 3. STATS KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {shopStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} variant="3d" className={`p-5 space-y-3 bg-gradient-to-br ${stat.gradient} border-slate-200/90 hover:shadow-3d-hover hover:-translate-y-1.5 transition-all`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {stat.title}
                </span>
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center shadow-xs`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-main">{stat.value}</div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                  <span
                    className={`font-black flex items-center gap-0.5 ${
                      stat.isPositive ? "text-emerald-600" : "text-cta"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground font-medium">{stat.subtext}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 4. RECENT ORDERS TABLE (RESPONSIVE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="3d" className="lg:col-span-2 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <CardTitle>Đơn Hàng Mới Nhận</CardTitle>
              <CardDescription>Các đơn hàng khách vừa đặt tại Shop của bạn</CardDescription>
            </div>
            <Link href="/seller/orders">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-cta hover:text-cta-hover">
                Xem tất cả →
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 border-b border-surface-border text-slate-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Mã Đơn</th>
                    <th className="py-3 px-4">Khách Hàng</th>
                    <th className="py-3 px-4">Sản Phẩm</th>
                    <th className="py-3 px-4">Tổng Tiền</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {shopOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-black text-main">{order.id}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-700">{order.customer}</td>
                      <td className="py-3.5 px-4 text-muted-foreground max-w-[180px] truncate">
                        {order.product}
                      </td>
                      <td className="py-3.5 px-4 font-black text-cta text-sm">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={order.statusVariant} size="sm">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <Button variant="outline" size="sm" className="h-7.5 text-[11px] px-3 font-bold rounded-lg hover:border-cta hover:text-cta">
                          Xử lý đơn
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips & Policy */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="font-bold text-main text-base">Bí Quyết Tăng Doanh Số</h3>
              <p className="text-xs text-muted-foreground">Mẹo tối ưu hiệu quả gian hàng</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-1">
              <div className="font-bold text-cta flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Giao hàng đúng hạn
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Giao hàng trước 16h giúp tăng 35% tỷ lệ khách quay lại mua lần sau.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" /> Tạo Voucher giảm giá
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Các shop có voucher 10k-20k thu hút nhiều lượt thêm vào giỏ hàng hơn.
              </p>
            </div>
          </div>

          <Link href="/seller/vouchers/new" className="block pt-1">
            <Button variant="gradient-primary" size="md" fullWidth className="text-xs font-bold rounded-xl shadow-glow-primary">
              Tạo Mã Khuyến Mãi Ngay
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
