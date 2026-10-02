"use client";

import Link from "next/link";
import { AlertOctagon, CheckCircle2, EyeOff, Package, Plus, Search } from "lucide-react";

import { Button, Card, Input, Loading } from "@/components/ui";
import sellerProductStatuses from "@/data/shop-product-statuses.json";
import { useSellerProductFilters } from "@/hooks/useShopProductFilters";
import { useDeleteSellerProduct } from "@/hooks/useDeleteShopProduct";
import { getSellerProductsUrl } from "@/lib/utils/shop-product.utils";
import type { ProductCategoryOption } from "@/types/product";
import type { SellerProductPage, SellerProductStatus } from "@/types/shop-product";
import { ShopProductsTable } from "./shop-products-table";

type SellerProductsViewProps = {
  categories: ProductCategoryOption[];
  categoryError: boolean;
  products: SellerProductPage;
  productError: boolean;
  categoryId?: number;
  status?: SellerProductStatus;
  keyword?: string;
};

const statusIcons = [Package, CheckCircle2, AlertOctagon, EyeOff];
const statusColors = [
  "from-indigo-50/60 text-primary",
  "from-emerald-50/60 text-emerald-600",
  "from-rose-50/60 text-rose-600",
  "from-slate-100/80 text-slate-600",
];

// Hiển thị sản phẩm thật, bộ lọc URL và phân trang của người bán.
export function SellerProductsView({
  categories, categoryError, products, productError, categoryId, status, keyword,
}: SellerProductsViewProps) {
  const { keywordInput, handleKeywordChange, handleCategoryChange, handleStatusChange, handleLinkClick, isPending } = useSellerProductFilters({ categoryId, status, keyword });
  const { deletingProductId, deletingVariantId, handleDeleteProduct, handleDeleteVariant } = useDeleteSellerProduct();

  return (
    <div className="space-y-6">
      {/* Chặn thao tác khác khi yêu cầu xóa sản phẩm hoặc phân loại chưa hoàn tất. */}
      {(deletingProductId !== null || deletingVariantId !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <Loading label={deletingProductId !== null ? "Đang xóa sản phẩm..." : "Đang xóa phân loại..."} className="min-h-0 w-full max-w-sm" />
        </div>
      )}
      {/* Các thẻ trạng thái dẫn tới bộ lọc; chỉ trạng thái đang xem có số lượng từ API. */}
      <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
        {sellerProductStatuses.map((item, index) => {
          const Icon = statusIcons[index];
          const isSelected = (status ?? "") === item.value;
          return (
            <Link key={item.value || "all"} href={getSellerProductsUrl(categoryId, item.value, 1, keywordInput)} scroll={false} onClick={(event) => handleLinkClick(event, getSellerProductsUrl(categoryId, item.value, 1, keywordInput))}>
              <Card variant="3d" className={`h-full bg-gradient-to-br ${statusColors[index]} to-white p-4.5 transition hover:-translate-y-1 hover:shadow-3d-hover ${isSelected ? "ring-2 ring-primary/30" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold font-heading text-slate-600">{item.label}</span>
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <div className="mt-2.5 text-2xl font-black font-heading tracking-tight">
                  {isSelected && !productError ? products.totalItems : "—"}
                </div>
                <p className="mt-1 text-[10px] font-medium text-slate-500">
                  {isSelected ? "Sản phẩm theo bộ lọc" : "Xem danh sách"}
                </p>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Tìm theo tên và lọc sản phẩm qua URL để Server Component tải lại dữ liệu. */}
      <Card variant="3d" className="space-y-3 p-3 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-4 sm:space-y-0">
        <Input type="search" aria-label="Tìm theo tên sản phẩm" placeholder="Tìm theo tên sản phẩm..." value={keywordInput} onChange={(event) => handleKeywordChange(event.target.value)} leftIcon={<Search className="h-4 w-4" />} className="h-10 w-full max-w-md bg-slate-50/80 text-xs" />
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2.5">
          <select
            key={`category-${categoryId ?? "all"}`}
            aria-label="Lọc theo ngành hàng"
            defaultValue={categoryId ? String(categoryId) : ""}
            onChange={(event) => handleCategoryChange(event.target.value)}
            disabled={categoryError || isPending}
            className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 sm:px-3"
          >
            <option value="">Tất cả ngành hàng</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            key={`status-${status ?? "all"}`}
            aria-label="Lọc theo trạng thái"
            defaultValue={status ?? ""}
            onChange={(event) => handleStatusChange(event.target.value)}
            disabled={isPending}
            className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 sm:px-3"
          >
            {sellerProductStatuses.map((item) => (
              <option key={item.value || "all"} value={item.value}>{item.label}</option>
            ))}
          </select>
          <Link href="/shop/products/new" className="col-span-2 sm:col-auto">
            <Button variant="gradient-cta" size="md" leftIcon={<Plus className="h-4 w-4" />} className="w-full rounded-xl px-4 text-xs font-bold font-heading shadow-glow-cta sm:w-auto">
              Thêm Sản Phẩm Mới
            </Button>
          </Link>
        </div>
      </Card>

      {categoryError && <p role="alert" className="text-xs text-danger">Không thể tải danh mục ngành hàng. Hãy tải lại trang.</p>}

      <ShopProductsTable products={products} productError={productError} isPending={isPending} categoryId={categoryId} status={status} keyword={keywordInput} handleLinkClick={handleLinkClick} deletingProductId={deletingProductId} deletingVariantId={deletingVariantId} handleDeleteProduct={handleDeleteProduct} handleDeleteVariant={handleDeleteVariant} />
    </div>
  );
}
