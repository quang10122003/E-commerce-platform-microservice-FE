import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Edit, Layers, Loader2, Package, Tag, Trash2 } from "lucide-react";
import { Badge, Button, Card, buttonVariants } from "@/components/ui";
import { cn, formatCurrency } from "@/lib/utils";
import { formatSellerProductDate, getNearbySellerPages, getSellerProductsUrl, getSellerVariantLabel, summarizeSellerProduct } from "@/lib/utils/shop-product.utils";
import type { SellerProductPage, SellerProductStatus } from "@/types/shop-product";
import type { MouseEvent } from "react";

type ShopProductsTableProps = { products: SellerProductPage; productError: boolean; isPending: boolean; categoryId?: number; status?: SellerProductStatus; keyword?: string; handleLinkClick: (event: MouseEvent<HTMLAnchorElement>, href: string) => void; deletingProductId: number | null; deletingVariantId: number | null; handleDeleteProduct: (productId: number, productName: string) => Promise<void>; handleDeleteVariant: (productId: number, variantId: number, variantLabel: string) => Promise<void>; };

export function ShopProductsTable({ products, productError, isPending, categoryId, status, keyword, handleLinkClick, deletingProductId, deletingVariantId, handleDeleteProduct, handleDeleteVariant }: ShopProductsTableProps) {
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const firstItem = products.totalItems === 0 ? 0 : (products.page - 1) * products.pageSize + 1;
  const lastItem = Math.min(products.page * products.pageSize, products.totalItems);
  return (
    <>
      {/* Bảng hiển thị sản phẩm và chi tiết phân loại từ API. */}
      <Card variant="3d" className="overflow-hidden">
        <div aria-live="polite" aria-busy={isPending}>
        {isPending ? (
          <div className="max-w-full overflow-x-auto overscroll-x-contain" aria-label="Đang tải sản phẩm">
            <table className="min-w-[620px] w-full text-left text-xs sm:min-w-[700px]">
              <thead className="border-b border-slate-200 bg-slate-50/90 text-[10px] font-bold uppercase text-slate-500"><tr><th className="px-3 py-3.5 sm:px-4">Sản phẩm</th><th className="hidden px-4 py-3.5 lg:table-cell">Ngành hàng</th><th className="px-3 py-3.5 sm:px-4">Khoảng giá</th><th className="hidden px-4 py-3.5 sm:table-cell">Tồn kho</th><th className="hidden px-4 py-3.5 sm:table-cell">Phân loại</th><th className="px-3 py-3.5 sm:px-4">Trạng thái</th><th className="px-3 py-3.5 sm:px-4">Thao tác</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {Array.from({ length: Math.max(products.items.length, 1) }, (_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-3 py-3.5 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="skeleton-shimmer h-10 w-10 shrink-0 rounded-md sm:h-12 sm:w-12" />
                        <div className="min-w-0 flex-1">
                          <div className="skeleton-shimmer h-3.5 w-4/5 rounded-md" />
                          <div className="skeleton-shimmer mt-0.5 h-2.5 w-2/5 rounded-md" />
                          <div className="skeleton-shimmer mt-1 h-4 w-20 rounded-full" />
                          <div className="skeleton-shimmer mt-1 h-3 w-24 rounded-md" />
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3.5 lg:table-cell"><div className="skeleton-shimmer h-6 w-24 rounded-lg" /></td>
                    <td className="px-3 py-3.5 sm:px-4"><div className="skeleton-shimmer h-4 w-24 rounded-md" /><div className="skeleton-shimmer mt-2 h-2.5 w-16 rounded-md" /></td>
                    <td className="hidden px-4 py-3.5 sm:table-cell"><div className="skeleton-shimmer mx-auto h-4 w-8 rounded-md" /></td>
                    <td className="hidden px-4 py-3.5 sm:table-cell"><div className="skeleton-shimmer mx-auto h-5 w-20 rounded-full" /></td>
                    <td className="px-3 py-3.5 sm:px-4"><div className="skeleton-shimmer mx-auto h-5 w-16 rounded-full" /></td>
                    <td className="px-3 py-3.5 sm:px-4"><div className="flex justify-end gap-1"><div className="skeleton-shimmer h-7 w-7 rounded-lg" /><div className="skeleton-shimmer h-7 w-7 rounded-lg" /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : productError ? (
          <p role="alert" className="p-6 text-center text-sm text-danger">Không thể tải danh sách sản phẩm. Hãy tải lại trang.</p>
        ) : products.items.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">Không có sản phẩm phù hợp bộ lọc.</p>
        ) : (
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
                {products.items.map((product) => {
                  const summary = summarizeSellerProduct(product);
                  const isExpanded = expandedProductId === product.id;
                  return (
                    <Fragment key={product.id}>
                      <tr className="transition-colors hover:bg-slate-50/80">
                        <td className="px-3 py-3.5 sm:px-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200/80 bg-slate-100 sm:h-12 sm:w-12">
                              {product.imageUrl ? <Image src={product.imageUrl} alt={product.name} width={48} height={48} unoptimized className="h-full w-full object-cover" /> : <Package className="m-auto h-full w-5 text-slate-400" />}
                            </div>
                            <div className="max-w-[140px] space-y-0.5 sm:max-w-[240px] lg:max-w-[320px]">
                              <div className="line-clamp-2 font-heading text-xs font-bold leading-snug text-main sm:line-clamp-1">{product.name}</div>
                              <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                                <span>ID: #{product.id}</span><span>•</span><span>Tạo: {formatSellerProductDate(product.createdAt)}</span>
                              </div>
                              <Badge variant={summary.hasVariants ? "primary-soft" : "secondary"} size="xs" className="mt-1 w-fit" icon={summary.hasVariants ? <Layers className="h-3 w-3" /> : <Package className="h-3 w-3" />}>
                                {summary.hasVariants ? `${product.variants.length} phân loại` : "Sản phẩm đơn"}
                              </Badge>
                              {summary.hasVariants && (
                                <button type="button" onClick={() => setExpandedProductId(isExpanded ? null : product.id)} aria-expanded={isExpanded} className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-primary transition hover:text-indigo-700">
                                  <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                  {isExpanded ? "Thu gọn phân loại" : "Xem phân loại"}
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="hidden px-4 py-3.5 lg:table-cell">
                          <div className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-1 text-slate-700">
                            <Tag className="h-3 w-3 shrink-0" aria-hidden="true" /><span className="line-clamp-2 text-[11px] font-semibold leading-tight font-heading">{product.categoryName}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3.5 font-mono text-[11px] font-black text-cta sm:px-4 sm:text-sm">
                          {summary.minPrice === null ? "Chưa có giá" : summary.minPrice === summary.maxPrice ? formatCurrency(summary.minPrice) : `${formatCurrency(summary.minPrice)} - ${formatCurrency(summary.maxPrice!)}`}
                          <span className="mt-0.5 block font-sans text-[9px] font-medium text-slate-400">{summary.hasVariants ? "Giá các phân loại" : "Giá sản phẩm"}</span>
                        </td>
                        <td className={`hidden px-4 py-3.5 text-center font-mono font-black sm:table-cell ${summary.totalStock === 0 ? "text-rose-600" : "text-slate-700"}`}>
                          {summary.totalStock}<span className="mt-0.5 block font-sans text-[9px] font-medium text-slate-400">{summary.hasVariants ? "Tổng kho" : "Kho sản phẩm"}</span>
                        </td>
                        <td className="hidden px-4 py-3.5 text-center sm:table-cell">
                          {summary.hasVariants ? <div className="space-y-1"><span className="inline-flex items-center justify-center gap-1.5 text-slate-600"><Layers className="h-3.5 w-3.5 text-primary" /><span className="font-mono font-black">{product.variants.length} phân loại</span></span><p className="text-[9px] font-medium text-slate-400">{summary.attributeNames || "Theo SKU"}</p></div> : <span className="inline-flex items-center gap-1.5 text-slate-500"><Package className="h-3.5 w-3.5" /><span className="text-[10px] font-semibold">Không phân loại</span></span>}
                        </td>
                        <td className="px-3 py-3.5 text-center sm:px-4">
                          {product.status === "ACTIVE" ? <Badge variant="perk-soft" size="xs">Đang bán</Badge> : product.status === "OUT_OF_STOCK" ? <Badge variant="danger-soft" size="xs">Hết hàng</Badge> : <Badge variant="secondary" size="xs">Tạm ẩn</Badge>}
                        </td>
                        <td className="px-3 py-3.5 text-right sm:px-4">
                          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                            <Link href={`/shop/products/${product.id}/edit`} className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "h-7.5 w-7.5 rounded-lg text-slate-500 hover:bg-indigo-50 hover:text-primary")} title="Chỉnh sửa sản phẩm" aria-label={`Chỉnh sửa sản phẩm ${product.name}`}><Edit className="h-3.5 w-3.5" /></Link>
                            <Button variant="ghost" size="icon-sm" className="h-7.5 w-7.5 cursor-pointer rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600" title="Xóa sản phẩm" aria-label={`Xóa sản phẩm ${product.name}`} disabled={deletingProductId !== null || deletingVariantId !== null} onClick={() => void handleDeleteProduct(product.id, product.name)}>{deletingProductId === product.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}</Button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50/70">
                          <td colSpan={7} className="px-3 py-3.5 sm:px-4">
                            <div className="overflow-hidden rounded-lg border border-indigo-100 bg-white shadow-xs">
                              <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-500"><Layers className="h-3.5 w-3.5 text-primary" />Danh sách phân loại</div>
                              <table className="w-full text-left text-xs">
                                <thead className="border-b border-slate-100 bg-slate-50/80 text-[9px] font-bold uppercase text-slate-400"><tr><th className="px-3 py-2">Thuộc tính</th><th className="px-3 py-2">Giá</th><th className="px-3 py-2">Tồn kho</th><th className="px-3 py-2 text-right">Thao tác</th></tr></thead>
                                <tbody className="divide-y divide-slate-100">
                                  {product.variants.map((variant) => (
                                    <tr key={variant.id} className="transition-colors hover:bg-slate-50/70">
                                      <td className="px-3 py-2 font-semibold text-slate-700">{getSellerVariantLabel(variant)}<span className="block font-mono text-[10px] font-normal text-slate-400">{variant.sku}</span></td>
                                      <td className="whitespace-nowrap px-3 py-2 font-mono text-[10px] font-bold text-cta">{formatCurrency(variant.price)}</td>
                                      <td className="px-3 py-2 font-mono text-[10px] font-bold text-slate-600">{variant.stockQuantity}</td>
                                      <td className="px-3 py-2"><div className="flex items-center justify-end gap-0.5 sm:gap-1"><Button variant="ghost" size="icon-sm" className="h-7.5 w-7.5 cursor-pointer rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600" title={product.variants.length <= 1 ? "Không thể xóa phân loại cuối cùng" : "Xóa phân loại"} aria-label={`Xóa phân loại ${getSellerVariantLabel(variant)}`} disabled={product.variants.length <= 1 || deletingProductId !== null || deletingVariantId !== null} onClick={() => void handleDeleteVariant(product.id, variant.id, getSellerVariantLabel(variant))}>{deletingVariantId === variant.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}</Button></div></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        </div>

        {/* Phân trang dùng số lượng thật từ API và giữ bộ lọc trên URL. */}
        {!productError && products.totalItems > 0 && (
          <nav aria-label="Phân trang sản phẩm" className="flex flex-col gap-3 border-t border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="text-center text-xs font-medium text-slate-500 sm:text-left">Hiển thị <span className="font-bold text-slate-700">{firstItem}–{lastItem}</span> trong <span className="font-bold text-slate-700">{products.totalItems}</span> sản phẩm</p>
            <div className="flex items-center justify-center gap-1.5">
              {products.page > 1 ? <Link href={getSellerProductsUrl(categoryId, status, products.page - 1, keyword)} scroll={false} onClick={(event) => handleLinkClick(event, getSellerProductsUrl(categoryId, status, products.page - 1, keyword))} aria-label="Trang trước" className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><ChevronLeft className="h-4 w-4" /></Link> : <button type="button" aria-label="Trang trước" disabled className="inline-flex h-8.5 w-8.5 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-300 opacity-70"><ChevronLeft className="h-4 w-4" /></button>}
              {getNearbySellerPages(products.page, products.totalPages).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={getSellerProductsUrl(categoryId, status, pageNumber, keyword)}
                  scroll={false}
                  onClick={(event) => handleLinkClick(event, getSellerProductsUrl(categoryId, status, pageNumber, keyword))}
                  aria-label={`Trang ${pageNumber}`}
                  aria-current={pageNumber === products.page ? "page" : undefined}
                  className={`inline-flex h-8.5 min-w-8.5 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${pageNumber === products.page ? "bg-primary text-white shadow-md shadow-primary/20" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {pageNumber}
                </Link>
              ))}
              {products.page < products.totalPages ? <Link href={getSellerProductsUrl(categoryId, status, products.page + 1, keyword)} scroll={false} onClick={(event) => handleLinkClick(event, getSellerProductsUrl(categoryId, status, products.page + 1, keyword))} aria-label="Trang sau" className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><ChevronRight className="h-4 w-4" /></Link> : <button type="button" aria-label="Trang sau" disabled className="inline-flex h-8.5 w-8.5 cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-300 opacity-70"><ChevronRight className="h-4 w-4" /></button>}
            </div>
          </nav>
        )}
      </Card>
    </>
  );
}
