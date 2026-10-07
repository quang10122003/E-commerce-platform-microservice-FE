"use client";

import { useState } from "react";
import { Star, ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

// Dữ liệu đánh giá cứng để hiển thị demo trang product detail.
const REVIEWS = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    avatar: "https://i.pravatar.cc/40?img=1",
    rating: 5,
    date: "15/09/2026",
    variant: "Màu: Đen huyền | Phiên bản: Pro Max",
    content:
      "Sản phẩm cực kỳ chất lượng, đóng gói cẩn thận, giao hàng nhanh hơn dự kiến. Dùng thử 1 tuần rồi, hoàn toàn hài lòng. Shop uy tín, sẽ ủng hộ dài dài!",
    likes: 24,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&q=75",
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=120&q=75",
    ],
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    avatar: "https://i.pravatar.cc/40?img=5",
    rating: 4,
    date: "10/09/2026",
    variant: "Màu: Bạc ánh kim | Phiên bản: Pro",
    content:
      "Sản phẩm đẹp, đúng mô tả, chỉ tiếc giao hàng hơi chậm một chút so với dự kiến. Nhưng nhìn chung vẫn rất ổn, sẽ mua lại lần sau.",
    likes: 12,
    images: [],
  },
  {
    id: 3,
    name: "Phạm Minh Cường",
    avatar: "https://i.pravatar.cc/40?img=8",
    rating: 5,
    date: "02/09/2026",
    variant: "Màu: Vàng gold | Phiên bản: Ultra",
    content:
      "Wow tuyệt vời! Vượt xa kỳ vọng. Chất liệu cao cấp, từng chi tiết hoàn thiện tốt. Xứng đáng 5 sao không còn gì để chê cả.",
    likes: 37,
    images: [
      "https://images.unsplash.com/photo-1542496658-e33a6d0d4f17?w=120&q=75",
    ],
  },
];

// Thống kê phân bổ số sao để hiển thị thanh tiến độ.
const RATING_DISTRIBUTION = [
  { stars: 5, count: 842, percentage: 84 },
  { stars: 4, count: 120, percentage: 12 },
  { stars: 3, count: 28, percentage: 3 },
  { stars: 2, count: 8, percentage: 1 },
  { stars: 1, count: 2, percentage: 0 },
];

// Hiển thị ngôi sao đánh giá.
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-star text-star" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </div>
  );
}

// Tab phần đánh giá sản phẩm với thống kê và danh sách nhận xét.
export function ProductReviews() {
  // Số lượng đánh giá hiển thị, mặc định hiện 2 bình luận đầu.
  const [visibleCount, setVisibleCount] = useState(2);

  const visibleReviews = REVIEWS.slice(0, visibleCount);
  const hasMore = visibleCount < REVIEWS.length;

  return (
    <div className="space-y-6">
      {/* Tổng quan đánh giá: điểm trung bình và phân bổ sao. */}
      <div className="flex flex-col gap-6 rounded-xl bg-gradient-to-br from-star-light to-amber-50 p-5 sm:flex-row sm:items-center">
        {/* Điểm tổng và nhận xét ngắn. */}
        <div className="flex flex-col items-center gap-1 sm:min-w-[130px]">
          <span className="text-5xl font-black text-star">4.9</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-star text-star" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">1.000 đánh giá</span>
        </div>

        {/* Thanh phân bổ theo từng mức sao. */}
        <div className="flex flex-1 flex-col gap-2">
          {RATING_DISTRIBUTION.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="flex w-14 items-center gap-1 text-xs font-medium text-slate-600">
                {stars} <Star className="h-3 w-3 fill-star text-star" />
              </span>
              <div className="flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-star transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danh sách đánh giá của người mua. */}
      <div className="divide-y divide-slate-100">
        {visibleReviews.map((review) => (
          <div key={review.id} className="py-5">
            {/* Thông tin người đánh giá và thời gian. */}
            <div className="flex items-start gap-3">
              <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-slate-200">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  fill
                  unoptimized
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-main">{review.name}</span>
                  <StarRow rating={review.rating} />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                  <span>{review.date}</span>
                  <span className="hidden sm:inline">·</span>
                  <span className="truncate">{review.variant}</span>
                </div>
              </div>
            </div>

            {/* Nội dung nhận xét. */}
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.content}</p>

            {/* Ảnh đính kèm của đánh giá nếu có. */}
            {review.images.length > 0 && (
              <div className="mt-3 flex gap-2">
                {review.images.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 sm:h-20 sm:w-20"
                  >
                    <Image
                      src={src}
                      alt={`Ảnh đánh giá ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Nút thích đánh giá. */}
            <button className="mt-3 flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-slate-300 hover:bg-slate-50 active:scale-95">
              <ThumbsUp className="h-3.5 w-3.5" />
              Hữu ích ({review.likes})
            </button>
          </div>
        ))}
      </div>

      {/* Nút xem thêm / rút gọn đánh giá. */}
      {REVIEWS.length > 2 && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount(hasMore ? REVIEWS.length : 2)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary-light active:scale-95"
          >
            {hasMore ? (
              <>
                Xem thêm đánh giá <ChevronDown className="h-4 w-4" />
              </>
            ) : (
              <>
                Thu gọn <ChevronUp className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
