"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  Truck,
  ShieldCheck,
  ArrowRight,
  Gift,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useHeroCarousel } from "@/hooks/useHeroCarousel";

interface SlideData {
  id: number;
  tag: string;
  tagIcon: React.ReactNode;
  tagColor: string;
  title: string;
  highlight: string;
  titleFont?: string;
  highlightFont?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaVariant: "gradient-cta" | "gradient-primary" | "perk";
  bgGradient: string;
  imageUrl: string;
  perks: { icon: React.ReactNode; text: string }[];
}

const slides: SlideData[] = [
  {
    id: 1,
    tag: "Siêu Hội Công Nghệ 2026",
    tagIcon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
    tagColor: "bg-white/20 text-white border-white/30",
    title: "Thiết Bị Thông Minh",
    highlight: "GIẢM ĐẾN 50%",
    titleFont: "font-display font-extrabold tracking-tight",
    highlightFont: "font-display font-black tracking-normal",
    description:
      "Ưu đãi độc quyền hôm nay: Tặng voucher 200k cho đơn từ 1 triệu + Miễn phí vận chuyển toàn quốc.",
    ctaText: "Săn Deal Ngay",
    ctaLink: "/flash-sale",
    ctaVariant: "gradient-cta",
    bgGradient: "from-primary via-indigo-700 to-slate-900",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    perks: [
      { icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />, text: "100% Chính Hãng" },
      { icon: <Truck className="w-4 h-4 text-cyan-300" />, text: "Giao Nhanh 2H" },
    ],
  },
  {
    id: 2,
    tag: "Đại Tiệc Mua Sắm",
    tagIcon: <Gift className="w-3.5 h-3.5 text-yellow-300" />,
    tagColor: "bg-orange-400/20 text-orange-100 border-orange-300/30",
    title: "Voucher Hoàn Xu 20%",
    highlight: "FREESHIP EXTRA 0Đ",
    titleFont: "font-display font-extrabold tracking-tight",
    highlightFont: "font-display font-black tracking-normal",
    description:
      "Hàng triệu mã giảm giá hấp dẫn đang chờ bạn. Áp dụng đồng thời nhiều voucher khi thanh toán.",
    ctaText: "Thu Thập Mã Ngay",
    ctaLink: "/vouchers",
    ctaVariant: "gradient-cta",
    bgGradient: "from-orange-600 via-rose-600 to-purple-900",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    perks: [
      { icon: <Tag className="w-4 h-4 text-amber-300" />, text: "Giảm Đến 500k" },
      { icon: <Zap className="w-4 h-4 text-yellow-300" />, text: "Áp Dụng Toàn Sàn" },
    ],
  },
  {
    id: 3,
    tag: "Xu Hướng Thời Trang Mới",
    tagIcon: <Sparkles className="w-3.5 h-3.5 text-emerald-300" />,
    tagColor: "bg-emerald-400/20 text-emerald-100 border-emerald-300/30",
    title: "Bộ Sưu Tập Lifestyle",
    highlight: "ĐỒNG GIÁ TỪ 99K",
    titleFont: "font-serif italic font-bold tracking-normal",
    highlightFont: "font-display font-black not-italic tracking-normal",
    description:
      "Cập nhật phong cách thời thượng với hàng ngàn mẫu áo quần, giày sneaker năng động xu hướng mới.",
    ctaText: "Khám Phá BST",
    ctaLink: "/fashion",
    ctaVariant: "gradient-primary",
    bgGradient: "from-emerald-700 via-teal-800 to-slate-900",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    perks: [
      { icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />, text: "Đổi Trả 15 Ngày" },
      { icon: <Truck className="w-4 h-4 text-cyan-300" />, text: "Freeship Đơn 99k" },
    ],
  },
];

export function HeroCarousel() {
  const { currentSlide, nextSlide, prevSlide, selectSlide, setIsAutoPlaying } = useHeroCarousel(slides.length);

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-3d hover:shadow-3d-hover transition-all duration-300 group min-h-[350px] sm:min-h-[420px] lg:min-h-[450px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((s, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out bg-gradient-to-r ${
              s.bgGradient
            } p-6 sm:p-10 lg:p-14 text-white flex flex-col sm:flex-row items-center justify-between gap-6 ${
              isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-98 pointer-events-none"
            }`}
          >
            {/* Vùng ánh sáng môi trường tạo chiều sâu cho banner lớn */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Khu vực nội dung bên trái */}
            <div className="max-w-xl lg:max-w-2xl space-y-3.5 sm:space-y-4.5 relative z-10">
              {/* Nhãn sự kiện */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold font-heading backdrop-blur-md bg-white/20 border border-white/30 shadow-xs">
                {s.tagIcon}
                <span>{s.tag}</span>
              </div>

              {/* Tiêu đề chính sử dụng font nghệ thuật cách tân */}
              <h1 className={cn("text-2xl sm:text-4xl lg:text-5xl leading-tight drop-shadow-sm", s.titleFont || "font-heading font-black tracking-tight")}>
                {s.title} <br />
                <span className={cn("bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent drop-shadow-md", s.highlightFont)}>
                  {s.highlight}
                </span>
              </h1>

              {/* Mô tả chi tiết */}
              <p className="text-xs sm:text-sm lg:text-base text-slate-100/90 leading-relaxed max-w-lg font-sans">
                {s.description}
              </p>

              {/* Danh sách quyền lợi nổi bật */}
              <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm font-semibold font-heading text-slate-200 pt-1">
                {s.perks.map((perk, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-white/10">
                    {perk.icon}
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>

              {/* Nút kêu gọi hành động CTA */}
              <div className="pt-2 sm:pt-3">
                <Link href={s.ctaLink}>
                  <Button
                    variant={s.ctaVariant}
                    size="lg"
                    className="rounded-xl px-6 font-bold font-heading shadow-glow-cta gap-2 text-sm sm:text-base hover:scale-105 transition-transform"
                  >
                    <span>{s.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hình ảnh sản phẩm nổi bật bên phải của Hero Banner */}
            <div className="hidden sm:block relative z-10 w-52 sm:w-64 lg:w-88 aspect-square shrink-0">
              <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-white/25 transform group-hover:scale-105 transition-transform duration-500">
                <img
                  src={s.imageUrl}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-xs font-bold font-heading text-white">
                  <span className="bg-cta px-2.5 py-1 rounded-lg shadow-md tracking-wider uppercase text-[11px]">
                    TOP DEAL
                  </span>
                  <span className="backdrop-blur-md bg-black/50 px-2.5 py-1 rounded-lg border border-white/20">
                    HOT 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Nút điều hướng trái/phải */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dải chấm chỉ báo chuyển slide */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => selectSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? "w-7 bg-white shadow-xs" : "w-2 bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
