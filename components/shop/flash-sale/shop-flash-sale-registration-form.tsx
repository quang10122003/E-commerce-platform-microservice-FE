"use client";

import Link from "next/link";
import { CheckCircle2, Info, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidDiscountPercent } from "@/lib/utils/flash-sale.utils";
import { cn, formatCurrency } from "@/lib/utils";
import { useFlashSaleRegistration } from "@/hooks/shop/flash-sale/useFlashSaleRegistration";

import { useMounted } from "@/lib/hooks";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";
import { formatSellerProductDate } from "@/lib/utils/shop-product.utils";
import type { ShopFlashSaleProduct, ShopFlashSaleCampaignDetail } from "@/types/shop/flash-sale";

// Dùng chung biểu mẫu cho popup và trang đăng ký mở trực tiếp.
export function ShopFlashSaleRegistrationForm({ campaignId, products, error, campaign, campaignError, now, isModal = false }: { campaignId: string; products: ShopFlashSaleProduct[]; error?: string; campaign?: ShopFlashSaleCampaignDetail; campaignError?: string; now: number; isModal?: boolean }) {
  const { form, close, retry, submit, registrationSuccessful, clearRegistrationFeedback, productSelected, changeProduct, selectedProduct, selectedVariant, quantityLimit, validateProduct, validateQuantity, changeDiscount, changeQuantity, changeVariant, matchingProducts, showSuggestions, selectProduct, openSuggestions, blurSuggestions, salePrice, priceLoading, priceError, retryPrice, registrationOpen } = useFlashSaleRegistration(campaignId, products, isModal, campaign, now);
  const mounted = useMounted();
  const localDeadline = mounted && campaign ? toLocalDateTimeInput(campaign.registrationDeadline) : "";
  const { register, formState: { errors, isSubmitting } } = form;
  return (
        <form onSubmit={submit} onChange={clearRegistrationFeedback} aria-busy={isSubmitting} noValidate>
          {/* Tên và hạn đăng ký lấy độc lập với danh sách sản phẩm. */}
          {campaign && <div className="border-b border-surface-border px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-heading text-lg font-semibold text-main">{campaign.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">Hạn đăng ký: {localDeadline ? `${formatSellerProductDate(localDeadline)} · ${localDeadline.slice(11)}` : "—"} (giờ thiết bị)</p>
                {!registrationOpen && <p role="status" className="mt-2 text-sm font-medium text-danger">Chương trình đã hết hạn đăng ký.</p>}
              </div>
              {/* Thay popup hiện tại trong lịch sử để đóng luôn về danh sách chương trình. */}
              <Link href={`/shop/flash-sales/${campaignId}/items`} replace={isModal} scroll={false} className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                <Package className="size-3.5" aria-hidden="true" />
                Xem phân loại đã đăng ký
              </Link>
            </div>
          </div>}
          {campaignError && <p role="alert" className="mx-6 mt-5 rounded-lg bg-danger-light p-3 text-sm text-danger">{campaignError} <button type="button" onClick={retry} className="ml-2 font-semibold underline underline-offset-2">Thử lại</button></p>}
          {error && <p role="alert" className="mx-6 mt-5 rounded-lg bg-danger-light p-3 text-sm text-danger">{error} <button type="button" onClick={retry} className="ml-2 font-semibold underline underline-offset-2">Thử lại</button></p>}
          {!error && !products.length && <p role="status" className="mx-6 mt-5 text-sm text-muted-foreground">Shop chưa có sản phẩm để đăng ký Flash Sale.</p>}
          <fieldset disabled={isSubmitting} className="grid min-w-0 sm:grid-cols-[1.3fr_1fr]">
            {/* Sản phẩm từ API và các thông số Shop có thể nhập. */}
            <section className="space-y-6 px-6 py-6 sm:px-8 sm:py-8" aria-label="Thông tin đăng ký">
              {/* Chọn sản phẩm trước khi mở danh sách phân loại tương ứng. */}
              <div className="relative" onBlur={blurSuggestions}>
                <label htmlFor="sale-product" className="mb-2 block text-sm font-semibold">Sản phẩm</label>
                <Input id="sale-product" onFocus={openSuggestions} placeholder="Nhập tên sản phẩm để tìm" autoComplete="off" aria-invalid={!!errors.productName}
                  {...register("productName", { required: "Vui lòng chọn sản phẩm.", validate: validateProduct, onChange: changeProduct })}
                  error={errors.productName?.message} />
                {/* Gợi ý tìm theo tên; ID giúp phân biệt sản phẩm trùng tên. */}
                {showSuggestions && <div aria-label="Sản phẩm gợi ý" className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-surface-border bg-surface-card shadow-lg">
                  {matchingProducts.length ? matchingProducts.map(product => <button key={product.id} type="button" onClick={() => selectProduct(product)}
                    className={cn("flex w-full items-start justify-between gap-3 border-b border-surface-border px-3 py-3 text-left text-sm last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary", product.status !== "ACTIVE" ? "bg-surface-muted hover:bg-surface-border" : "hover:bg-primary-light focus-visible:bg-primary-light")}>
                    <span className="min-w-0"><span className={cn("block break-words font-medium", product.status !== "ACTIVE" ? "text-muted-foreground" : "text-main")}>{product.name}</span><span className="mt-1 block text-xs text-muted-foreground">#{product.id} · {product.categoryName}</span></span>
                    <span className={cn("shrink-0 text-xs", product.status !== "ACTIVE" ? "rounded-md border border-surface-border-strong bg-surface-card px-2 py-1 font-semibold text-main" : "text-muted-foreground")}>{product.status === "ACTIVE" ? "Đang bán" : product.status === "INACTIVE" ? "Đang ẩn" : "Hết hàng"}</span>
                  </button>) : <p role="status" className="px-3 py-4 text-sm text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>}
                </div>}
                <p className="mt-2 text-xs text-muted-foreground">Nhập tên và chọn sản phẩm từ danh sách gợi ý.</p>
              </div>
              <div>
                <label htmlFor="sale-variant" className="mb-2 block text-sm font-semibold">Phân loại</label>
                <select disabled={!productSelected} aria-invalid={!!errors.variantId} aria-describedby="sale-variant-hint" id="sale-variant" {...register("variantId", { onChange: changeVariant, required: "Vui lòng chọn phân loại." })} className="h-11 w-full rounded-lg border border-surface-border bg-surface-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground">
                  <option value="">{productSelected ? "Chọn phân loại" : "Chọn sản phẩm trước"}</option>
                  {productSelected && selectedProduct?.variants.map(variant => <option key={variant.id} value={variant.id} disabled={variant.stockQuantity < 2}>
                    {variant.attributes.map(attribute => `${attribute.name}: ${attribute.value}`).join(" / ") || variant.sku} · Tồn {variant.stockQuantity}
                  </option>)}
                </select>
                <p id="sale-variant-hint" className="mt-2 text-xs text-muted-foreground">{selectedVariant ? `Tồn kho: ${selectedVariant.stockQuantity}` : "Chọn sản phẩm đang bán, sau đó chọn phân loại."}</p>
                {errors.variantId && <p role="alert" className="mt-2 text-xs text-danger">{errors.variantId.message}</p>}
              </div>
              <div>
                <label htmlFor="sale-discount" className="mb-2 block text-sm font-semibold">Mức giảm giá (%)</label>
                <Input id="sale-discount" type="number" inputMode="decimal" step="0.01" min="1" max="99" aria-invalid={!!errors.discountPercent}
                  {...register("discountPercent", { valueAsNumber: true, onChange: changeDiscount, required: "Nhập mức giảm giá.", validate: value => isValidDiscountPercent(value) || "Nhập mức giảm từ 1 đến 99%; tối đa 2 số thập phân." })}
                  error={errors.discountPercent?.message} helperText="Từ 1 đến 99%, tối đa 2 chữ số thập phân." />
              </div>
              <div>
                <label htmlFor="sale-quantity" className="mb-2 block text-sm font-semibold">Số lượng đăng ký</label>
                <Input id="sale-quantity" disabled={!productSelected || !selectedVariant} type="number" inputMode="numeric" min="1" max={quantityLimit || undefined} step="1" aria-invalid={!!errors.registeredQuantity}
                  {...register("registeredQuantity", { valueAsNumber: true, onChange: changeQuantity, required: "Nhập số lượng đăng ký.", validate: validateQuantity })}
                  error={errors.registeredQuantity?.message} />
                {/* Nhắc giới hạn số lượng và giải thích đăng ký không giữ tồn kho. */}
                <div role="note" className="mt-3 flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary-light p-3 text-primary">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <div className="text-xs leading-5">
                    <p className="font-semibold">Chú ý</p>
                    <p>Chỉ đăng ký tối đa 50% tồn kho, làm tròn xuống khi tồn kho là số lẻ.{selectedVariant ? ` Tồn ${selectedVariant.stockQuantity}: đăng ký tối đa ${quantityLimit}.` : ""} Đăng ký không giữ hàng.</p>
                  </div>
                </div>
              </div>
            </section>
            {/* Giá gốc từ phân loại hiện tại, giá sale do backend tính theo input đang chọn. */}
            <aside className="border-t border-surface-border bg-surface-subtle px-6 py-6 sm:border-l sm:border-t-0 sm:px-7 sm:py-8">
              <h3 className="font-heading text-base font-semibold">Giá bán dự kiến</h3>
              <p className="mt-5 text-sm text-muted-foreground">Giá gốc</p>
              <p className="mt-1 text-lg font-medium tabular-nums">{selectedVariant ? formatCurrency(selectedVariant.price) : "—"}</p>
              <div className="mt-5 border-t border-surface-border pt-5">
                <p className="text-sm text-muted-foreground">Giá Flash Sale</p>
                <p aria-live="polite" aria-busy={priceLoading} className="mt-2 font-heading text-3xl font-bold tabular-nums text-primary">{priceLoading ? "Đang tính..." : salePrice !== undefined ? formatCurrency(salePrice) : "—"}</p>
              </div>
              {priceError ? <p role="alert" className="mt-4 text-sm leading-6 text-danger">{priceError} <button type="button" onClick={retryPrice} className="font-semibold underline underline-offset-2">Thử lại</button></p>
                : <p className="mt-4 text-sm leading-6 text-muted-foreground">{salePrice !== undefined ? "Giá dự kiến được hệ thống tính từ giá phân loại hiện tại và mức giảm đã nhập." : "Chọn sản phẩm, phân loại và nhập mức giảm để xem giá sale dự kiến."}</p>}
            </aside>
          </fieldset>
          {/* Phản hồi đăng ký dựa trên kết quả thực tế từ backend. */}
          {errors.root?.registration && <p role="alert" className="mx-6 mb-5 text-sm text-danger">{errors.root.registration.message}</p>}
          {registrationSuccessful && !errors.root?.registration && (
            <p role="status" className="mx-6 mb-5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-primary-light p-3 text-sm text-primary sm:mx-8">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                Đăng ký sản phẩm vào Flash Sale thành công.
              </span>
              <Link href={`/shop/flash-sales/${campaignId}/items`} replace={isModal} scroll={false} className="font-semibold underline underline-offset-2 hover:opacity-80">
                Xem phân loại đã đăng ký &rarr;
              </Link>
            </p>
          )}
          <footer className="flex flex-wrap items-center justify-end gap-4 border-t border-surface-border px-6 py-5 sm:px-8">
            <div className="flex gap-2"><Button type="button" variant="outline" disabled={isSubmitting} onClick={close}>Đóng</Button><Button type="submit" variant="primary" disabled={isSubmitting || !!error || !!campaignError || !registrationOpen || !selectedVariant || quantityLimit < 1}>{isSubmitting ? "Đang đăng ký..." : "Đăng ký sản phẩm"}</Button></div>
          </footer>
        </form>
  );
}
