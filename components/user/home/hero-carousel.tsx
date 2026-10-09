"use client";

import React from "react";
import { slides } from "./hero-carousel-data";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { useHeroCarousel } from "@/hooks/user/home/useHeroCarousel";


export function HeroCarousel() {
  const { currentSlide, nextSlide, prevSlide, selectSlide, setIsAutoPlaying } = useHeroCarousel(slides.length);

  return (
    <div
      className="group relative min-h-[350px] w-full overflow-hidden rounded-xl border border-slate-200/70 sm:min-h-[420px] lg:min-h-[450px]"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {slides.map((s, index) => {
        const isActive = index === currentSlide;
        const SlideHeading = isActive ? "h1" : "h2";
        return (
          <div
            key={s.id}
            aria-hidden={!isActive}
            inert={!isActive}
            className={`absolute inset-0 grid h-full w-full grid-cols-1 bg-slate-950 text-white transition-opacity duration-500 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] ${
              isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
          >
            {/* Khu vực nội dung bên trái */}
            <div className={`relative z-10 flex flex-col justify-center space-y-4 bg-gradient-to-br p-6 sm:p-10 lg:p-14 ${s.bgGradient}`}>
              {/* Nhãn sự kiện */}
              <div className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/10 px-2.5 py-1.5 text-xs font-semibold font-heading">
                {s.tagIcon}
                <span>{s.tag}</span>
              </div>

              {/* Tiêu đề chính sử dụng font nghệ thuật cách tân */}
              <SlideHeading className={cn("text-2xl leading-tight sm:text-4xl lg:text-5xl", s.titleFont || "font-heading font-bold tracking-tight")}>
                {s.title} <br />
                <span className={cn("text-amber-200", s.highlightFont)}>
                  {s.highlight}
                </span>
              </SlideHeading>

              {/* Mô tả chi tiết */}
              <p className="max-w-lg font-sans text-sm leading-relaxed text-slate-100/90 sm:text-base">
                {s.description}
              </p>

              {/* Danh sách quyền lợi nổi bật */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-heading text-xs font-medium text-slate-100 sm:text-sm">
                {s.perks.map((perk, pIdx) => (
                  <div key={pIdx} className="flex items-center gap-2">
                    {perk.icon}
                    <span>{perk.text}</span>
                  </div>
                ))}
              </div>

              {/* Nút kêu gọi hành động CTA */}
              <div className="pt-1">
                <Link href={s.ctaLink}>
                  <Button
                    variant={s.ctaVariant}
                    size="lg"
                    className="gap-2 rounded-md px-6 font-semibold font-heading text-sm transition-colors sm:text-base"
                  >
                    <span>{s.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hình ảnh sản phẩm nổi bật bên phải của Hero Banner */}
            <div className="relative z-10 hidden min-h-full overflow-hidden sm:block">
              <Image
                fill
                src={s.imageUrl}
                alt={s.title}
                sizes="(min-width: 1024px) 45vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-slate-950/25 via-transparent to-transparent" />
            </div>
          </div>
        );
      })}

      {/* Nút điều hướng trái/phải */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/30 bg-black/25 text-white transition-colors hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Slide trước"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/30 bg-black/25 text-white transition-colors hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label="Slide tiếp theo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dải chấm chỉ báo chuyển slide */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-md border border-white/20 bg-black/25 px-2.5 py-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => selectSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/45 hover:bg-white/80"
            }`}
            aria-label={`Đến chương trình ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
