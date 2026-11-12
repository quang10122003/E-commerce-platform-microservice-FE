"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, MessageSquareText, Star } from "lucide-react";
import { useProductReviewSection, useProductReviews } from "@/hooks/user/product-detail/useProductReviews";
import { formatVariantAttributes } from "@/lib/utils/order.utils";
import { getNearbySellerPages } from "@/lib/utils/shop-product.utils";
import type { ProductReviewItem, ProductReviewPage } from "@/types/user/review";

// Hiển thị ngôi sao đánh giá.
function StarRow({ rating, size = "h-3.5 w-3.5" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} trên 5 sao`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} aria-hidden="true" className={`${size} ${i < Math.round(rating) ? "fill-star text-star" : "fill-slate-200 text-slate-200"}`} />
      ))}
    </div>
  );
}

// Một đánh giá: tên người mua (snapshot), số sao, phân loại đã mua, nội dung và ảnh đính kèm.
function ReviewItem({ review }: { review: ProductReviewItem }) {
  const variant = formatVariantAttributes(review.variantAttributes);
  return (
    <div className="py-5">
      <div className="flex items-start gap-3">
        {/* Không có avatar thì hiện chữ cái đầu của tên. */}
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light text-sm font-bold text-primary" aria-hidden="true">
          {review.reviewerAvatarUrl
            ? <Image src={review.reviewerAvatarUrl} alt="" fill unoptimized sizes="36px" className="object-cover" />
            : review.reviewerName.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-main">{review.reviewerName}</span>
            <StarRow rating={review.rating} />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span>{new Date(review.createdAt).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}</span>
            {variant && <><span className="hidden sm:inline">·</span><span className="truncate">Phân loại: {variant}</span></>}
          </div>
        </div>
      </div>
      {review.content && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">{review.content}</p>}
      {review.imageUrls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.imageUrls.map((src, index) => (
            <a key={`${index}-${src}`} href={src} target="_blank" rel="noopener noreferrer" className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 transition hover:border-primary sm:h-20 sm:w-20">
              <Image src={src} alt={`Ảnh đánh giá ${index + 1} của ${review.reviewerName}`} fill unoptimized sizes="80px" className="object-cover" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Nút lọc theo mức sao kèm số đánh giá; mức chưa có đánh giá thì khóa.
function RatingFilter({ summary, rating, onChange, disabled }: {
  summary: ProductReviewPage["summary"]; rating?: number; onChange: (rating?: number) => void; disabled: boolean;
}) {
  const options = [{ value: undefined, label: "Tất cả", count: summary.reviewCount },
    ...summary.ratingCounts.map(({ rating: value, count }) => ({ value, label: `${value} sao`, count }))];
  return (
    <div role="group" aria-label="Lọc đánh giá theo số sao" className="flex flex-wrap gap-2">
      {options.map(({ value, label, count }) => {
        const active = rating === value;
        return (
          <button key={label} type="button" onClick={() => onChange(value)} aria-pressed={active} disabled={disabled || count === 0}
            className={`inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${active ? "border-cta bg-orange-50 text-cta" : "border-slate-200 bg-white text-slate-700 hover:border-cta hover:text-cta"}`}>
            {value && <Star className="h-3.5 w-3.5 fill-star text-star" aria-hidden="true" />}
            {label} ({count.toLocaleString("vi-VN")})
          </button>
        );
      })}
    </div>
  );
}

// Phân trang danh sách đánh giá bằng nút, dùng chung cách tính trang lân cận với phân trang sản phẩm shop.
function ReviewPagination({ page, totalPages, onChange, disabled }: { page: number; totalPages: number; onChange: (page: number) => void; disabled: boolean }) {
  if (totalPages <= 1) return null;
  const pageClass = "flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm text-main transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang đánh giá">
      <button type="button" onClick={() => onChange(page - 1)} disabled={disabled || page <= 1} aria-label="Trang trước" className={pageClass}><ChevronLeft className="size-4" /></button>
      {getNearbySellerPages(page, totalPages).map((value) => (
        <button key={value} type="button" onClick={() => onChange(value)} disabled={disabled} aria-label={`Trang ${value}`} aria-current={value === page ? "page" : undefined}
          className={value === page ? "flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground" : pageClass}>
          {value}
        </button>
      ))}
      <button type="button" onClick={() => onChange(page + 1)} disabled={disabled || page >= totalPages} aria-label="Trang sau" className={pageClass}><ChevronRight className="size-4" /></button>
    </nav>
  );
}

// Card đánh giá sản phẩm: tổng quan số sao, danh sách đánh giá và tải thêm theo trang; lỗi API thì ẩn cả card.
export function ProductReviews({ productId }: { productId: number }) {
  const { summary, isLoading, isError, rating, changeRating, page, setPage, reviews, isListLoading, isListError } =
    useProductReviewSection(productId);
  const items = reviews?.items ?? [];
  if (isError || (!isLoading && !summary)) return null;

  return (
    <section className="rounded-xl border border-surface-border bg-white" aria-labelledby="product-reviews-title" aria-busy={isLoading}>
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <h2 id="product-reviews-title" className="text-base font-bold text-main">Đánh giá sản phẩm</h2>
        {summary && <span className="text-xs text-muted-foreground">{summary.reviewCount.toLocaleString("vi-VN")} đánh giá</span>}
      </div>
      <div className="space-y-6 p-6">
        {!summary ? (
          <div className="h-32 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          <>
            {/* Tổng quan: điểm trung bình và phân bổ theo từng mức sao; chưa có đánh giá thì không hiện. */}
            {summary.reviewCount > 0 && (
            <div className="flex flex-col gap-6 rounded-xl bg-gradient-to-br from-star-light to-amber-50 p-5 sm:flex-row sm:items-center">
              <div className="flex flex-col items-center gap-1 sm:min-w-[130px]">
                <span className="text-5xl font-black text-star">{summary.ratingAverage.toFixed(1)}</span>
                <StarRow rating={summary.ratingAverage} size="h-4 w-4" />
                <span className="text-xs text-muted-foreground">{summary.reviewCount.toLocaleString("vi-VN")} đánh giá</span>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                {summary.ratingCounts.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="flex w-14 items-center gap-1 text-xs font-medium text-slate-600">{rating} <Star className="h-3 w-3 fill-star text-star" aria-hidden="true" /></span>
                    <div className="flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-star transition-all duration-700"
                        style={{ width: `${(count / summary.reviewCount) * 100}%` }} />
                    </div>
                    <span className="w-10 text-right text-xs text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            )}

            {summary.reviewCount > 0 && <RatingFilter summary={summary} rating={rating} onChange={changeRating} disabled={isListLoading} />}

            {/* Lỗi khi tải danh sách theo bộ lọc thì ẩn danh sách, giữ tổng quan. */}
            {isListError ? null : !reviews ? (
              <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <MessageSquareText className="h-8 w-8 text-slate-300" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">{rating ? `Chưa có đánh giá ${rating} sao.` : "Chưa có đánh giá nào cho sản phẩm này."}</p>
              </div>
            ) : (
              <>
                <div className={`divide-y divide-slate-100 transition-opacity ${isListLoading ? "opacity-50" : ""}`} aria-busy={isListLoading}>
                  {items.map((review) => <ReviewItem key={review.id} review={review} />)}
                </div>
                <ReviewPagination page={page} totalPages={reviews.totalPages} onChange={setPage} disabled={isListLoading} />
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// Điểm và số đánh giá ở phần đầu trang, dùng chung cache với card đánh giá; đang tải hoặc API lỗi thì hiện "—".
export function ProductRatingSummary({ productId }: { productId: number }) {
  const { summary, isError } = useProductReviews(productId);
  // Chưa có đánh giá vẫn hiện điểm mặc định BE trả (5.0) như sản phẩm bình thường.
  const data = isError ? null : summary;

  return (
    <>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-bold text-star">{data ? data.ratingAverage.toFixed(1) : "—"}</span>
        <StarRow rating={data?.ratingAverage ?? 0} />
      </div>
      <span className="h-4 w-px bg-slate-200" />
      <span className="text-sm text-muted-foreground">
        <span className="font-semibold text-main">{data ? data.reviewCount.toLocaleString("vi-VN") : "—"}</span> Đánh giá
      </span>
      <span className="h-4 w-px bg-slate-200" />
    </>
  );
}
