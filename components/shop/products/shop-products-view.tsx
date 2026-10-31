"use client";

import Link from "next/link";
import { AlertOctagon, CheckCircle2, EyeOff, Filter, Package, Search } from "lucide-react";

import { Card, Input, Loading } from "@/components/ui";
import sellerProductStatuses from "@/data/shop-product-statuses.json";
import { useSellerProductFilters } from "@/hooks/shop/products/useShopProductFilters";
import { useDeleteSellerProduct } from "@/hooks/shop/products/useDeleteShopProduct";
import { getSellerProductsUrl } from "@/lib/utils/shop-product.utils";
import type { ProductCategoryOption } from "@/types/shop/product";
import type { SellerProductOverview, SellerProductPage, SellerProductStatus } from "@/types/shop/product";
import { ShopProductsTable } from "./shop-products-table";
import { ShopCreateProductAction } from "./shop-create-product-action";

type SellerProductsViewProps = {
  categories: ProductCategoryOption[];
  categoryError: boolean;
  products: SellerProductPage;
  productError: boolean;
  overview: SellerProductOverview;
  overviewError: boolean;
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
  categories, categoryError, products, productError, overview, overviewError, categoryId, status, keyword,
}: SellerProductsViewProps) {
  const { keywordInput, handleKeywordChange, handleCategoryChange, handleStatusChange, handleLinkClick, isPending, retry } = useSellerProductFilters({ categoryId, status, keyword });
  const { deletingProductId, deletingVariantId, handleDeleteProduct, handleDeleteVariant } = useDeleteSellerProduct();

  // Dùng chung các lựa chọn và handler cho bộ lọc desktop và mobile.
  const filterControls = (
        <div className="grid gap-3 sm:flex sm:items-center sm:gap-2.5">
          <select
            key={`category-${categoryId ?? "all"}`}
            aria-label="Lọc theo ngành hàng"
            defaultValue={categoryId ? String(categoryId) : ""}
            onChange={(event) => handleCategoryChange(event.target.value)}
            disabled={categoryError || isPending}
            className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 sm:px-3"
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
            className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 sm:px-3"
          >
            {sellerProductStatuses.map((item) => (
              <option key={item.value || "all"} value={item.value}>{item.label}</option>
            ))}
          </select>
        </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Chặn thao tác khác khi yêu cầu xóa sản phẩm hoặc phân loại chưa hoàn tất. */}
      {(deletingProductId !== null || deletingVariantId !== null) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <Loading label={deletingProductId !== null ? "Đang xóa sản phẩm..." : "Đang xóa phân loại..."} className="min-h-0 w-full max-w-sm" />
        </div>
      )}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-main sm:text-3xl">Quản lý sản phẩm</h1>
        </div>
        <ShopCreateProductAction />
      </header>
      {/* Các thẻ trạng thái dẫn tới bộ lọc; chỉ trạng thái đang xem có số lượng từ API. */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {sellerProductStatuses.map((item, index) => {
          const Icon = statusIcons[index];
          const isSelected = (status ?? "") === item.value;
          const count = item.value === "" ? overview.totalProducts
            : item.value === "ACTIVE" ? overview.activeProducts
              : item.value === "OUT_OF_STOCK" ? overview.outOfStockProducts
                : overview.inactiveProducts;
          return (
            <Link key={item.value || "all"} href={getSellerProductsUrl(categoryId, item.value, 1, keywordInput)} scroll={false} onClick={(event) => handleLinkClick(event, getSellerProductsUrl(categoryId, item.value, 1, keywordInput))}>
              <Card variant="3d" className={`h-full bg-gradient-to-br ${statusColors[index]} to-white p-4.5 transition hover:-translate-y-1 hover:shadow-3d-hover ${isSelected ? "ring-2 ring-primary/30" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold font-heading text-slate-600">{item.label}</span>
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <div className="mt-2.5 text-2xl font-black font-heading tracking-tight">
                  {!overviewError ? count : "—"}
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
      <Card variant="3d" className="flex items-center justify-between gap-2 p-3 sm:gap-4 sm:p-4">
        <div className="min-w-0 flex-1 sm:max-w-md">
        <Input type="search" aria-label="Tìm theo tên sản phẩm" placeholder="Tìm theo tên sản phẩm..." value={keywordInput} onChange={(event) => handleKeywordChange(event.target.value)} leftIcon={<Search className="h-4 w-4" />} className="h-10 w-full bg-slate-50/80 text-xs" />
        </div>
        <details className="group relative shrink-0 sm:hidden">
          <summary aria-label="Mở bộ lọc sản phẩm" className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-surface-border bg-surface-card text-main transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-open:border-primary group-open:bg-primary-light group-open:text-primary [&::-webkit-details-marker]:hidden">
            <Filter className="size-4 text-cta" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-full z-40 mt-2 w-64 max-w-[calc(100vw-3rem)] rounded-lg border border-surface-border bg-surface-card p-3 shadow-lg">
            <p className="mb-3 text-sm font-semibold text-main">Bộ lọc sản phẩm</p>
            {filterControls}
          </div>
        </details>
        {/* Hai bộ lọc luôn hiển thị trên desktop, thu gọn sau icon trên mobile. */}
        <div className="hidden sm:block">{filterControls}</div>
      </Card>

      {categoryError && <p role="alert" className="text-xs text-danger">Không thể tải danh mục ngành hàng. <button type="button" onClick={retry} disabled={isPending} className="ml-2 font-semibold underline underline-offset-2 disabled:cursor-wait disabled:opacity-50">Thử lại</button></p>}

      <ShopProductsTable retry={retry} products={products} productError={productError} isPending={isPending} categoryId={categoryId} status={status} keyword={keywordInput} handleLinkClick={handleLinkClick} deletingProductId={deletingProductId} deletingVariantId={deletingVariantId} handleDeleteProduct={handleDeleteProduct} handleDeleteVariant={handleDeleteVariant} />
    </div>
  );
}
