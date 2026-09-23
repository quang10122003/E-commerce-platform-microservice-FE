import Link from "next/link";
import Image from "next/image";
import {
  AlertOctagon,
  CheckCircle2,
  Edit,
  EyeOff,
  Layers,
  Package,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";

import { Badge, Button, Card, Input } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

// Dữ liệu mẫu cố định để xem trước giao diện quản lý sản phẩm.
const DEMO_PRODUCTS = [
  {
    id: 1,
    name: "Tai nghe Bluetooth True Wireless Pro ANC Chống ồn chủ động kép",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    minPrice: 499000,
    maxPrice: 650000,
    totalStock: 142,
    variantCount: 4,
    hasVariants: true,
    variantLabel: "Màu sắc, Phiên bản",
    status: "ACTIVE",
    createdAt: "14/09/2026",
  },
  {
    id: 2,
    name: "Đồng hồ thông minh AMOLED 5ATM GPS độc lập theo dõi sức khỏe SpO2",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    minPrice: 1890000,
    maxPrice: 2190000,
    totalStock: 56,
    variantCount: 2,
    hasVariants: true,
    variantLabel: "Màu sắc, Dây đeo",
    status: "ACTIVE",
    createdAt: "12/09/2026",
  },
  {
    id: 3,
    name: "Bàn phím cơ không dây RGB 3 Chế độ Gasket Mount Hot-swap Pro",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    minPrice: 790000,
    maxPrice: 950000,
    totalStock: 80,
    variantCount: 6,
    hasVariants: true,
    variantLabel: "Switch, Layout",
    status: "ACTIVE",
    createdAt: "10/09/2026",
  },
  {
    id: 4,
    name: "Củ sạc nhanh GaN 65W 3 Cổng Type-C PD 3.0 cho Laptop & Điện thoại",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    imageUrl: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=500&auto=format&fit=crop&q=80",
    minPrice: 350000,
    maxPrice: 350000,
    totalStock: 0,
    variantCount: 1,
    hasVariants: false,
    variantLabel: "Sản phẩm đơn",
    status: "OUT_OF_STOCK",
    createdAt: "08/09/2026",
  },
  {
    id: 5,
    name: "Chuột Gaming không dây siêu nhẹ 49g cảm biến 26.000 DPI PAW3395",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
    minPrice: 720000,
    maxPrice: 720000,
    totalStock: 25,
    variantCount: 1,
    hasVariants: false,
    variantLabel: "Sản phẩm đơn",
    status: "INACTIVE",
    createdAt: "05/09/2026",
  },
] as const;

// Hiển thị danh sách sản phẩm bằng dữ liệu demo cố định.
export function SellerProductsView() {
  return (
    <div className="space-y-6">
      {/* Khu vực thống kê tổng quan từ dữ liệu demo. */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
        <Card variant="3d" className="bg-gradient-to-br from-indigo-50/60 to-white p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Tất Cả Sản Phẩm</span>
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-indigo-100/80 text-primary">
              <Package className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-main">5</div>
        </Card>

        <Card variant="3d" className="bg-gradient-to-br from-emerald-50/60 to-white p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Đang Bán</span>
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-600">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-emerald-600">3</div>
        </Card>

        <Card variant="3d" className="bg-gradient-to-br from-rose-50/60 to-white p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Hết Hàng Trong Kho</span>
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-rose-100/80 text-rose-600">
              <AlertOctagon className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-rose-600">1</div>
        </Card>

        <Card variant="3d" className="bg-gradient-to-br from-slate-100/80 to-white p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Tạm Ẩn / Ngừng Bán</span>
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-slate-200/80 text-slate-600">
              <EyeOff className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-slate-700">1</div>
        </Card>
      </div>

      {/* Thanh công cụ xếp dọc trên mobile để không tràn chiều ngang. */}
      <Card variant="3d" className="space-y-3 p-3 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-4 sm:space-y-0">
        <Input
          type="text"
          placeholder="Tìm theo tên sản phẩm, mã ID..."
          disabled
          className="h-10 w-full max-w-md bg-slate-50/80 text-xs"
        />

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
          <select
            disabled
            aria-label="Lọc theo ngành hàng"
            className="h-10 min-w-0 rounded-xl border border-slate-200 bg-slate-100 px-2 text-xs font-medium text-slate-500 sm:px-3"
            defaultValue=""
          >
            <option value="">Tất cả ngành hàng</option>
          </select>

          <select
            disabled
            aria-label="Lọc theo trạng thái"
            className="h-10 min-w-0 rounded-xl border border-slate-200 bg-slate-100 px-2 text-xs font-medium text-slate-500 sm:px-3"
            defaultValue=""
          >
            <option value="">Tất cả trạng thái</option>
          </select>

          <Link href="/seller/products/new" className="col-span-2 sm:col-auto">
            <Button
              variant="gradient-cta"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              className="w-full rounded-xl px-4 text-xs font-bold font-heading shadow-glow-cta sm:w-auto"
            >
              Thêm Sản Phẩm Mới
            </Button>
          </Link>
        </div>
      </Card>

      {/* Bảng danh sách sản phẩm demo, không kết nối API hoặc thao tác dữ liệu. */}
      <Card variant="3d" className="overflow-hidden">
        <div className="max-w-full overflow-x-auto overscroll-x-contain">
          <table className="min-w-[620px] w-full text-left text-xs sm:min-w-[700px]">
            <thead className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3.5 sm:px-4">Sản Phẩm</th>
                <th className="hidden px-4 py-3.5 lg:table-cell">Ngành Hàng</th>
                <th className="px-3 py-3.5 whitespace-nowrap sm:px-4">Khoảng Giá</th>
                <th className="hidden px-4 py-3.5 text-center sm:table-cell">Tồn Kho</th>
                <th className="hidden px-4 py-3.5 text-center sm:table-cell">Phân Loại</th>
                <th className="px-3 py-3.5 text-center sm:px-4">Trạng Thái</th>
                <th className="px-3 py-3.5 text-right sm:px-4">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DEMO_PRODUCTS.map((product) => (
                <tr key={product.id} className="transition-colors hover:bg-slate-50/80">
                  <td className="px-3 py-3.5 sm:px-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200/80 bg-slate-100 sm:h-12 sm:w-12">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="max-w-[140px] space-y-0.5 sm:max-w-[240px] lg:max-w-[320px]">
                        <div className="line-clamp-2 font-heading text-xs font-bold leading-snug text-main sm:line-clamp-1">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                          <span>ID: #{product.id}</span>
                          <span>•</span>
                          <span>Tạo: {product.createdAt}</span>
                        </div>
                        {/* Nhận diện nhanh sản phẩm đơn hoặc có nhiều phân loại. */}
                        <Badge
                          variant={product.hasVariants ? "primary-soft" : "secondary"}
                          size="xs"
                          className="mt-1 w-fit"
                          icon={product.hasVariants ? <Layers className="h-3 w-3" /> : <Package className="h-3 w-3" />}
                        >
                          {product.hasVariants ? `${product.variantCount} phân loại` : "Sản phẩm đơn"}
                        </Badge>
                      </div>
                    </div>
                  </td>

                  <td className="hidden px-4 py-3.5 lg:table-cell">
                    <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-1 text-slate-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-200/80 text-slate-500">
                        <Tag className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <span className="line-clamp-2 text-[11px] font-semibold leading-tight font-heading">
                        {product.categoryName}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3.5 font-mono text-[11px] font-black text-cta sm:px-4 sm:text-sm">
                    {/* Sản phẩm đơn hiển thị một giá, sản phẩm biến thể hiển thị khoảng giá. */}
                    {product.hasVariants
                      ? `${formatCurrency(product.minPrice)} - ${formatCurrency(product.maxPrice)}`
                      : formatCurrency(product.minPrice)}
                    <span className="mt-0.5 block font-sans text-[9px] font-medium text-slate-400">
                      {product.hasVariants ? "Giá các phân loại" : "Giá sản phẩm"}
                    </span>
                  </td>

                  <td className={`hidden px-4 py-3.5 text-center font-mono font-black sm:table-cell ${product.totalStock === 0 ? "text-rose-600" : "text-slate-700"}`}>
                    {product.totalStock}
                    <span className="mt-0.5 block font-sans text-[9px] font-medium text-slate-400">
                      {product.hasVariants ? "Tổng kho" : "Kho sản phẩm"}
                    </span>
                  </td>

                  <td className="hidden px-4 py-3.5 text-center sm:table-cell">
                    {/* Mô tả cấu trúc phân loại để phân biệt với sản phẩm đơn. */}
                    {product.hasVariants ? (
                      <div className="space-y-1">
                        <span className="inline-flex items-center justify-center gap-1.5 text-slate-600">
                          <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                          <span className="font-mono font-black">{product.variantCount} phân loại</span>
                        </span>
                        <p className="text-[9px] font-medium text-slate-400">{product.variantLabel}</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <Package className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="text-[10px] font-semibold">Không phân loại</span>
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-3.5 text-center sm:px-4">
                    {product.status === "ACTIVE" ? (
                      <Badge variant="perk-soft" size="xs">Đang bán</Badge>
                    ) : product.status === "OUT_OF_STOCK" ? (
                      <Badge variant="danger-soft" size="xs">Hết hàng</Badge>
                    ) : (
                      <Badge variant="secondary" size="xs">Tạm ẩn</Badge>
                    )}
                  </td>

                  <td className="px-3 py-3.5 text-right sm:px-4">
                    <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                      <Button disabled variant="ghost" size="icon-sm" className="h-7.5 w-7.5 rounded-lg text-slate-500" title="Chỉnh sửa sản phẩm demo">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button disabled variant="ghost" size="icon-sm" className="h-7.5 w-7.5 rounded-lg text-slate-500" title="Xóa sản phẩm demo">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
