import React from "react";
import Link from "next/link";
import {
  DollarSign,
  Package,
  Star,
  ArrowUpRight,
  Plus,
  Truck,
  MessageSquare,
  AlertTriangle,
  Clock,
  Eye,
  CheckCircle2,
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
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Chờ Giao Đơn Vị Vận Chuyển",
    value: "8 đơn",
    change: "Cần gửi gấp",
    isPositive: false,
    subtext: "Hạn chót 17:00",
    icon: Truck,
    color: "bg-orange-50 text-cta",
  },
  {
    title: "Đánh Giá Cửa Hàng",
    value: "4.9 / 5.0",
    change: "+12 đánh giá mới",
    isPositive: true,
    subtext: "Tỷ lệ phản hồi 99%",
    icon: Star,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Sản Phẩm Cần Nhập Thêm",
    value: "3 mã SKU",
    change: "Tồn kho < 5",
    isPositive: false,
    subtext: "Sắp hết hàng",
    icon: AlertTriangle,
    color: "bg-rose-50 text-rose-600",
  },
];

const todoTasks = [
  { label: "Đơn hàng chờ xác nhận", count: 8, href: "/seller/orders?status=pending", color: "text-cta" },
  { label: "Đơn hàng đang giao", count: 24, href: "/seller/orders?status=shipping", color: "text-primary" },
  { label: "Tin nhắn khách hàng mới", count: 3, href: "/seller/chat", color: "text-blue-600" },
  { label: "Sản phẩm tạm khóa / Vi phạm", count: 0, href: "/seller/products?status=banned", color: "text-slate-400" },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-main tracking-tight">
              Kênh Người Bán (Seller Center)
            </h1>
            <Badge variant="perk-soft" size="sm">
              Gian hàng chính thức
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Chào mừng trở lại! Quản lý sản phẩm, đơn hàng và doanh số cửa hàng của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/seller/products/new">
            <Button
              variant="cta"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-semibold"
            >
              Thêm Sản Phẩm Mới
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. TO-DO LIST (DANH SÁCH CẦN LÀM) */}
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-main">Danh Sách Cần Xử Lý</h3>
          <span className="text-[11px] text-muted-foreground">Cập nhật lúc vừa xong</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {todoTasks.map((task, idx) => (
            <Link
              key={idx}
              href={task.href}
              className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-surface-border text-center transition-all group"
            >
              <div className={`text-xl sm:text-2xl font-black ${task.color} group-hover:scale-105 transition-transform`}>
                {task.count}
              </div>
              <div className="text-[11px] sm:text-xs font-medium text-slate-600 mt-1 line-clamp-1">
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
            <Card key={idx} className="p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {stat.title}
                </span>
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xl sm:text-2xl font-black text-main">{stat.value}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span
                    className={`font-bold ${
                      stat.isPositive ? "text-emerald-600" : "text-cta"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">{stat.subtext}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* 4. RECENT ORDERS TABLE (RESPONSIVE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Đơn Hàng Mới Nhận</CardTitle>
              <CardDescription>Các đơn hàng khách vừa đặt tại Shop của bạn</CardDescription>
            </div>
            <Link href="/seller/orders">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-cta">
                Xem tất cả →
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-y border-surface-border text-slate-500 uppercase font-semibold">
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
                    <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-main">{order.id}</td>
                      <td className="py-3 px-4 font-medium">{order.customer}</td>
                      <td className="py-3 px-4 text-muted-foreground max-w-[180px] truncate">
                        {order.product}
                      </td>
                      <td className="py-3 px-4 font-bold text-cta">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={order.statusVariant} size="sm">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm" className="h-7 text-[11px] px-2.5">
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
          <div>
            <h3 className="font-bold text-main text-base">Bí Quyết Bán Hàng</h3>
            <p className="text-xs text-muted-foreground">Tăng doanh số cho gian hàng</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-orange-50/70 border border-orange-100 space-y-1">
              <div className="font-bold text-cta flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Giao hàng đúng hạn
              </div>
              <p className="text-slate-600 text-[11px]">
                Giao hàng trước 16h giúp tăng 35% tỷ lệ khách quay lại mua lần sau.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 space-y-1">
              <div className="font-bold text-primary flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5" /> Tạo Voucher giảm giá
              </div>
              <p className="text-slate-600 text-[11px]">
                Các shop có voucher 10k-20k thu hút nhiều lượt thêm vào giỏ hàng hơn.
              </p>
            </div>
          </div>

          <Link href="/seller/vouchers/new" className="block pt-1">
            <Button variant="outline" size="sm" fullWidth className="text-xs">
              Tạo Voucher Ngay
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

