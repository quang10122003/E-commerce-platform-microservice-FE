"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Package,
  CheckCircle2,
  AlertOctagon,
  EyeOff,
  Edit,
  Trash2,
  Layers,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button, Input, Badge, Card } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import { SAMPLE_CATEGORIES } from "@/hooks/useCreateProduct";

export default function SellerProductsPage() {
  const {
    currentPage,
    deleteProduct,
    filteredProducts,
    searchTerm,
    selectedCategory,
    selectedStatus,
    setCurrentPage,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
    stats,
    toggleProductStatus,
    totalPages,
  } = useSellerProducts();

  const visiblePageCount = Math.min(5, totalPages);
  const firstVisiblePage = Math.min(
    Math.max(currentPage - 2, 1),
    Math.max(totalPages - visiblePageCount + 1, 1)
  );
  const pageNumbers = Array.from(
    { length: visiblePageCount },
    (_, pageIndex) => firstVisiblePage + pageIndex
  );

  return (
    <div className="space-y-6">
      {/* 1. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <Card variant="3d" className="p-4.5 bg-gradient-to-br from-indigo-50/60 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Tất Cả Sản Phẩm</span>
            <div className="w-8.5 h-8.5 rounded-xl bg-indigo-100/80 text-primary flex items-center justify-center">
              <Package className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-main">{stats.total}</div>
        </Card>

        <Card variant="3d" className="p-4.5 bg-gradient-to-br from-emerald-50/60 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Đang Bán</span>
            <div className="w-8.5 h-8.5 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-emerald-600">{stats.active}</div>
        </Card>

        <Card variant="3d" className="p-4.5 bg-gradient-to-br from-rose-50/60 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Hết Hàng Trong Kho</span>
            <div className="w-8.5 h-8.5 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center">
              <AlertOctagon className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-rose-600">{stats.outOfStock}</div>
        </Card>

        <Card variant="3d" className="p-4.5 bg-gradient-to-br from-slate-100/80 to-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-heading text-slate-600">Tạm Ẩn / Ngừng Bán</span>
            <div className="w-8.5 h-8.5 rounded-xl bg-slate-200/80 text-slate-600 flex items-center justify-center">
              <EyeOff className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5 text-2xl font-black font-heading tracking-tight text-slate-700">{stats.inactive}</div>
        </Card>
      </div>

      {/* 2. TOOLBAR: SEARCH, FILTERS & ADD BUTTON */}
      <Card variant="3d" className="p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã ID..."
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 text-xs bg-slate-50/80"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value === "ALL" ? "ALL" : Number(e.target.value)
              )
            }
            aria-label="Lọc theo ngành hàng"
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">Tất cả ngành hàng</option>
            {SAMPLE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Lọc theo trạng thái"
            className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang bán</option>
            <option value="OUT_OF_STOCK">Hết hàng</option>
            <option value="INACTIVE">Tạm ẩn</option>
          </select>

          <Link href="/seller/products/new">
            <Button
              variant="gradient-cta"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-bold font-heading rounded-xl shadow-glow-cta px-4"
            >
              Thêm Sản Phẩm Mới
            </Button>
          </Link>
        </div>
      </Card>

      {/* 4. PRODUCT DATA TABLE */}
      <Card variant="3d" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-3 sm:px-4">Sản Phẩm</th>
                <th className="hidden lg:table-cell py-3.5 px-4">Ngành Hàng</th>
                <th className="py-3.5 px-3 sm:px-4 whitespace-nowrap">Khoảng Giá</th>
                <th className="hidden sm:table-cell py-3.5 px-4 text-center">Tồn Kho</th>
                <th className="hidden sm:table-cell py-3.5 px-4 text-center">Phân Loại</th>
                <th className="py-3.5 px-3 sm:px-4 text-center">Trạng Thái</th>
                <th className="py-3.5 px-3 sm:px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Package className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm font-medium">Không tìm thấy sản phẩm nào phù hợp.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-3 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-0.5 max-w-[140px] sm:max-w-[240px] lg:max-w-[320px]">
                          <div className="font-bold font-heading text-main line-clamp-2 sm:line-clamp-1 leading-snug">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-mono">
                            <span>ID: #{product.id}</span>
                            <span>•</span>
                            <span>Tạo: {product.createdAt}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="hidden lg:table-cell py-3.5 px-4">
                      {/* Chip ngành hàng trung tính, đồng bộ với các ô dữ liệu trong bảng */}
                      <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-1 text-slate-700">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-200/80 text-slate-500">
                          <Tag className="h-3 w-3" aria-hidden="true" />
                        </span>
                        <span className="line-clamp-2 text-[11px] font-semibold leading-tight font-heading">
                          {product.categoryName}
                        </span>
                      </div>
                    </td>

                    {/* Price Range */}
                    <td className="py-3.5 px-3 sm:px-4 font-black font-mono text-cta text-[11px] sm:text-sm whitespace-nowrap">
                      {product.minPrice === product.maxPrice
                        ? formatCurrency(product.minPrice)
                        : `${formatCurrency(product.minPrice)} - ${formatCurrency(product.maxPrice)}`}
                    </td>

                    {/* Stock */}
                    <td className="hidden sm:table-cell py-3.5 px-4 text-center">
                      <span
                        className={`font-black font-mono ${
                          product.totalStock === 0
                            ? "text-rose-600"
                            : product.totalStock < 10
                            ? "text-amber-600"
                            : "text-slate-700"
                        }`}
                      >
                        {product.totalStock}
                      </span>
                    </td>

                    {/* Hiển thị biểu tượng và số lượng phân loại */}
                    <td className="hidden sm:table-cell py-3.5 px-4 text-center">
                      <span
                        className="inline-flex items-center justify-center gap-1.5 text-slate-600"
                        title={`${product.variantCount} biến thể`}
                        aria-label={`${product.variantCount} biến thể`}
                      >
                        <Layers className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                        <span className="font-black font-mono">{product.variantCount}</span>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 sm:px-4 text-center">
                      {product.status === "OUT_OF_STOCK" ? (
                        <Badge variant="danger-soft" size="xs">
                          Hết Hàng
                        </Badge>
                      ) : (
                        <button
                          type="button"
                          role="switch"
                          aria-checked={product.status === "ACTIVE"}
                          aria-label={product.status === "ACTIVE" ? "Đang bán" : "Tạm ẩn"}
                          onClick={() => toggleProductStatus(product.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95 ${
                            product.status === "ACTIVE"
                              ? "bg-emerald-500"
                              : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`h-4 w-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
                              product.status === "ACTIVE"
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                          <span className="sr-only">
                            {product.status === "ACTIVE" ? "Đang bán" : "Tạm ẩn"}
                          </span>
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-3 sm:px-4 text-right">
                      <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-slate-500 hover:text-primary rounded-lg h-7.5 w-7.5"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteProduct(product.id)}
                          className="text-slate-500 hover:text-rose-600 rounded-lg h-7.5 w-7.5"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. PAGINATION CONTROLS */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="rounded-lg h-7.5 w-7.5"
              title="Trang trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <div className="flex items-center gap-1">
              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  type="button"
                  variant={pageNumber === currentPage ? "gradient-primary" : "outline"}
                  size="icon-sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  aria-label={`Chuyển đến trang ${pageNumber}`}
                  aria-current={pageNumber === currentPage ? "page" : undefined}
                  className="h-7.5 w-7.5 rounded-lg text-xs font-bold"
                >
                  {pageNumber}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="rounded-lg h-7.5 w-7.5"
              title="Trang tiếp"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
