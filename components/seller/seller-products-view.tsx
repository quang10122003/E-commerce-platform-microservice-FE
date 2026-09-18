import Link from "next/link";
import {
  AlertOctagon,
  CheckCircle2,
  EyeOff,
  Package,
  Plus,
} from "lucide-react";

import { Button, Card, Input } from "@/components/ui";

// Hiển thị giao diện danh sách sản phẩm trong trạng thái chờ tích hợp API.
export function SellerProductsView() {
  return (
    <div className="space-y-6">
      {/* Khu vực thống kê tổng quan, chưa gắn dữ liệu backend. */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
        <Card variant="3d" className="bg-gradient-to-br from-indigo-50/60 to-white p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Tất Cả Sản Phẩm</span>
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-indigo-100/80 text-primary">
              <Package className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-main">0</div>
        </Card>

        <Card variant="3d" className="bg-gradient-to-br from-emerald-50/60 to-white p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Đang Bán</span>
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-emerald-100/80 text-emerald-600">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-emerald-600">0</div>
        </Card>

        <Card variant="3d" className="bg-gradient-to-br from-rose-50/60 to-white p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Hết Hàng Trong Kho</span>
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-rose-100/80 text-rose-600">
              <AlertOctagon className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-rose-600">0</div>
        </Card>

        <Card variant="3d" className="bg-gradient-to-br from-slate-100/80 to-white p-4.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Tạm Ẩn / Ngừng Bán</span>
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-slate-200/80 text-slate-600">
              <EyeOff className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-slate-700">0</div>
        </Card>
      </div>

      {/* Thanh công cụ cố định để giữ bố cục trước khi kết nối API. */}
      <Card variant="3d" className="space-y-3 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:space-y-0">
        <Input
          type="text"
          placeholder="Tìm theo tên sản phẩm, mã ID..."
          disabled
          className="h-10 max-w-md bg-slate-50/80 text-xs"
        />

        <div className="flex items-center gap-2.5">
          <select
            disabled
            aria-label="Lọc theo ngành hàng"
            className="h-10 rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-medium text-slate-500"
            defaultValue=""
          >
            <option value="">Tất cả ngành hàng</option>
          </select>

          <select
            disabled
            aria-label="Lọc theo trạng thái"
            className="h-10 rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-medium text-slate-500"
            defaultValue=""
          >
            <option value="">Tất cả trạng thái</option>
          </select>

          <Link href="/seller/products/new">
            <Button
              variant="gradient-cta"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              className="rounded-xl px-4 text-xs font-bold font-heading shadow-glow-cta"
            >
              Thêm Sản Phẩm Mới
            </Button>
          </Link>
        </div>
      </Card>

      {/* Bảng rỗng cố định, chờ dữ liệu sản phẩm từ API. */}
      <Card variant="3d" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
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
            <tbody>
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">
                  <Package className="mx-auto mb-2 h-12 w-12 text-slate-300" />
                  <p className="text-sm font-medium">Chưa có dữ liệu sản phẩm.</p>
                  <p className="mt-1 text-xs text-slate-400">Danh sách sẽ hiển thị sau khi tích hợp API.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
