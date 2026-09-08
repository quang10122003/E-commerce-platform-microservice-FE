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
import { Button } from "@/components/ui";

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
    highlight: "Giảm Đến 50%",
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
    highlight: "Freeship Extra 0Đ",
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
    highlight: "Đồng Giá Từ 99k",
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
      {/* 1. MAIN HERO BANNER (8 COLS) */}
      <div
        className="lg:col-span-8 relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-3d hover:shadow-3d-hover transition-all duration-300 group min-h-[320px] sm:min-h-[360px] lg:min-h-[380px]"
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
              } p-6 sm:p-8 lg:p-10 text-white flex items-center justify-between ${
                isActive ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-98 pointer-events-none"
              }`}
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/15 rounded-full blur-3xl pointer-events-none"></div>

              {/* Left Content Area */}
              <div className="max-w-md space-y-3 sm:space-y-4 relative z-10">
                {/* Tag Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-white/20 border border-white/30 shadow-xs">
                  {s.tagIcon}
                  <span>{s.tag}</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  {s.title} <br />
                  <span className="text-amber-300 drop-shadow-md">
                    {s.highlight}
                  </span>
                </h1>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed line-clamp-2">
                  {s.description}
                </p>

                {/* Perks list */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-200">
                  {s.perks.map((perk, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-1.5">
                      {perk.icon}
                      <span>{perk.text}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Link href={s.ctaLink}>
                    <Button
                      variant={s.ctaVariant}
                      size="md"
                      className="rounded-xl px-5 font-bold shadow-glow-cta gap-2"
                    >
                      <span>{s.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Hero Product Image */}
              <div className="hidden sm:block relative z-10 w-48 sm:w-60 lg:w-72 aspect-square shrink-0">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-300">
                  <img
                    src={s.imageUrl}
                    alt={s.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold text-white">
                    <span className="bg-cta px-2 py-0.5 rounded-md shadow-xs">TOP DEAL</span>
                    <span className="backdrop-blur-md bg-black/40 px-2 py-0.5 rounded-md">HOT 2026</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-md cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 2. RIGHT SIDE SUB-BANNERS (4 COLS - 2 ROWS) */}
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5 sm:gap-4">
        {/* Sub-banner 1: Voucher Hoàn Xu */}
        <Link
          href="/vouchers"
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white shadow-3d hover:shadow-3d-hover hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between min-h-[150px] sm:min-h-[180px]"
        >
          <div className="space-y-1.5 relative z-10 max-w-[65%]">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/25 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
              <Flame className="w-3 h-3 text-yellow-200 fill-yellow-200" />
              HOT VOUCHER
            </div>
            <h3 className="text-base sm:text-lg font-black leading-tight group-hover:text-yellow-100 transition-colors">
              Mã Giảm 100K <br />Toàn Sàn
            </h3>
            <p className="text-[11px] text-white/90">Áp dụng cho mọi đơn từ 500k</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-200 pt-1">
              Lưu mã ngay <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/30 shrink-0 transform group-hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&auto=format&fit=crop&q=80"
              alt="Voucher banner"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        {/* Sub-banner 2: Freeship Extra */}
        <Link
          href="/freeship"
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 text-white shadow-3d hover:shadow-3d-hover hover:-translate-y-1 transition-all duration-300 group flex items-center justify-between min-h-[150px] sm:min-h-[180px]"
        >
          <div className="space-y-1.5 relative z-10 max-w-[65%]">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/25 text-[10px] font-black uppercase tracking-wider backdrop-blur-xs">
              <Truck className="w-3 h-3 text-cyan-200" />
              FREESHIP XTRA
            </div>
            <h3 className="text-base sm:text-lg font-black leading-tight group-hover:text-teal-100 transition-colors">
              Giao 0Đ Siêu Tốc <br />Toàn Quốc
            </h3>
            <p className="text-[11px] text-white/90">Không giới hạn số lần dùng</p>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-200 pt-1">
              Khám phá ngay <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/30 shrink-0 transform group-hover:scale-105 transition-transform">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80"
              alt="Freeship banner"
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
