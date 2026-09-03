"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  Truck,
  ShieldCheck,
  Flame,
  ArrowRight,
  Gift,
  Tag,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";

interface SlideData {
  id: number;
  tag: string;
  tagIcon: React.ReactNode;
  tagColor: string;
  title: string;
  highlight: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaVariant: "cta" | "primary" | "perk";
  secondaryText?: string;
  secondaryLink?: string;
  bgGradient: string;
  accentBg: string;
  perks: { icon: React.ReactNode; text: string }[];
  floatingCard: {
    title: string;
    value: string;
    sub: string;
    icon: React.ReactNode;
  };
}

const slides: SlideData[] = [
  {
    id: 1,
    tag: "Siêu Hội Công Nghệ 2026",
    tagIcon: <Sparkles className="w-3.5 h-3.5" />,
    tagColor: "bg-white/20 text-white border-white/30",
    title: "Thiết Bị Thông Minh",
    highlight: "Giảm Đến 50%",
    description:
      "Ưu đãi độc quyền hôm nay: Tặng voucher 200k cho đơn từ 1 triệu + Miễn phí vận chuyển toàn quốc.",
    ctaText: "Săn Deal Ngay",
    ctaLink: "/flash-sale",
    ctaVariant: "cta",
    secondaryText: "Xem Danh Mục",
    secondaryLink: "/categories",
    bgGradient: "from-primary via-indigo-700 to-indigo-900",
    accentBg: "bg-indigo-500/20",
    perks: [
      { icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />, text: "100% Chính Hãng" },
      { icon: <Truck className="w-4 h-4 text-cyan-300" />, text: "Giao Nhanh 2H" },
    ],
    floatingCard: {
      title: "Flash Sale Độc Quyền",
      value: "-50% OFF",
      sub: "Chỉ còn 300 suất",
      icon: <Flame className="w-5 h-5 text-cta" />,
    },
  },
  {
    id: 2,
    tag: "Đại Tiệc Mua Sắm",
    tagIcon: <Gift className="w-3.5 h-3.5" />,
    tagColor: "bg-orange-400/20 text-orange-100 border-orange-300/30",
    title: "Voucher Hoàn Xu 20%",
    highlight: "Freeship Extra 0Đ",
    description:
      "Hàng triệu mã giảm giá hấp dẫn đang chờ bạn. Thu thập voucher và áp dụng ngay tại bước thanh toán.",
    ctaText: "Thu Thập Mã Ngay",
    ctaLink: "/vouchers",
    ctaVariant: "cta",
    secondaryText: "Tìm Hiểu Thêm",
    secondaryLink: "/help",
    bgGradient: "from-orange-600 via-amber-600 to-rose-700",
    accentBg: "bg-orange-500/20",
    perks: [
      { icon: <Tag className="w-4 h-4 text-amber-300" />, text: "Giảm Đến 500k" },
      { icon: <Zap className="w-4 h-4 text-yellow-300" />, text: "Áp Dụng Toàn Sàn" },
    ],
    floatingCard: {
      title: "Mã Siêu Giảm Giá",
      value: "HOANXU20",
      sub: "Đơn từ 250k",
      icon: <Tag className="w-5 h-5 text-amber-500" />,
    },
  },
  {
    id: 3,
    tag: "Xu Hướng Thời Trang Mới",
    tagIcon: <Sparkles className="w-3.5 h-3.5" />,
    tagColor: "bg-emerald-400/20 text-emerald-100 border-emerald-300/30",
    title: "Bộ Sưu Tập Lifestyle",
    highlight: "Đồng Giá Từ 99k",
    description:
      "Cập nhật phong cách thời thượng với hàng ngàn mẫu áo quần, phụ kiện và giày sneaker năng động.",
    ctaText: "Khám Phá BST",
    ctaLink: "/fashion",
    ctaVariant: "perk",
    secondaryText: "Xem Xu Hướng",
    secondaryLink: "/trends",
    bgGradient: "from-emerald-700 via-teal-800 to-slate-900",
    accentBg: "bg-teal-500/20",
    perks: [
      { icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />, text: "Đổi Trả 15 Ngày" },
      { icon: <Truck className="w-4 h-4 text-cyan-300" />, text: "Freeship Đơn 99k" },
    ],
    floatingCard: {
      title: "Bộ Sưu Tập Mới",
      value: "NEW 2026",
      sub: "Hơn 1.500+ mẫu",
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />,
    },
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  // Auto-play timer (4.5s)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 1. SLIDES CONTAINER */}
      <div className="relative min-h-[360px] sm:min-h-[400px] lg:min-h-[420px] flex items-center">
        {slides.map((s, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out bg-gradient-to-r ${
                s.bgGradient
              } p-6 sm:p-10 lg:p-12 text-white flex items-center justify-between ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Decorative Ambient Light Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-black/15 rounded-full blur-2xl pointer-events-none"></div>

              {/* Left Content Area */}
              <div className="max-w-xl space-y-4 sm:space-y-5 relative z-10">
                {/* Tag Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-xs">
                  {s.tagIcon}
                  <span>{s.tag}</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {s.title} <br />
                  <span className="text-amber-300 drop-shadow-sm">
                    {s.highlight}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-sm lg:text-base text-slate-100/90 leading-relaxed line-clamp-2 max-w-lg">
                  {s.description}
                </p>

                {/* Perks list */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200 pt-1">
                  {s.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5">
                      {perk.icon}
                      <span>{perk.text}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
                  <Link href={s.ctaLink}>
                    <Button
                      variant={s.ctaVariant}
                      size="lg"
                      className="rounded-xl px-6 font-bold shadow-md shadow-black/20 gap-2"
                    >
                      <span>{s.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  {s.secondaryText && (
                    <Link href={s.secondaryLink || "#"}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="rounded-xl px-5 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-xs"
                      >
                        {s.secondaryText}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Decorative Floating Card (Desktop Only) */}
              <div className="hidden lg:flex flex-col items-center justify-center relative z-10 pr-8">
                <div className="relative p-6 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/20 shadow-2xl space-y-3 w-72 text-center transform hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-white text-main flex items-center justify-center mx-auto shadow-md">
                    {s.floatingCard.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                      {s.floatingCard.title}
                    </span>
                    <div className="text-2xl font-black text-white mt-0.5 tracking-tight">
                      {s.floatingCard.value}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      {s.floatingCard.sub}
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-block w-full py-1.5 px-3 rounded-lg bg-white text-main font-bold text-xs shadow-xs">
                      Áp dụng tự động
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. NAVIGATION ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* 3. INDICATOR DOTS & PROGRESS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md">
        {slides.map((_, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActive ? "w-7 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}

