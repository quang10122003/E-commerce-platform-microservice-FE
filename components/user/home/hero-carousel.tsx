"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHeroCarousel } from "@/hooks/user/home/useHeroCarousel";
import { useBannerDocument } from "@/hooks/user/home/useBannerDocument";

// HTML admin được hiển thị trong sandbox không cấp quyền chạy script.
function BannerSlide({ html, index, active }: {
  html: string;
  index: number;
  active: boolean;
}) {
  const frameRef = useBannerDocument(html);
  return (
    <div aria-hidden={!active} inert={!active} className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${active ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}`}>
      {/* HTML có ảnh và SVG riêng; sandbox giữ chúng tách khỏi DOM của ứng dụng. */}
      <iframe ref={frameRef} title={`Chương trình ${index + 1}`} sandbox="allow-same-origin allow-top-navigation-by-user-activation" className="block h-full w-full border-0" />
    </div>
  );
}

// Render banner và điều hướng theo đúng số phần tử API đang trả về.
export function HeroCarousel({ slides }: { slides: string[] }) {
  const { carouselRef, currentSlide, nextSlide, prevSlide, selectSlide } = useHeroCarousel(slides.length);
  if (slides.length === 0) return null;

  return (
    <section
      ref={carouselRef}
      aria-label="Chương trình ưu đãi"
      aria-roledescription="carousel"
      className="group relative h-[350px] w-full overflow-hidden rounded-xl border border-slate-200/70 sm:h-[420px] lg:h-[450px]"
    >
      {/* Giữ thứ tự API, kể cả khi các banner có cùng nội dung. */}
      {slides.map((html, index) => <BannerSlide key={index} html={html} index={index} active={index === currentSlide} />)}

      {/* Chỉ hiện điều hướng khi có nhiều hơn một banner. */}
      {slides.length > 1 && <>
        <button type="button" onClick={prevSlide} className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/30 bg-black/25 text-white transition-colors hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Slide trước">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button type="button" onClick={nextSlide} className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/30 bg-black/25 text-white transition-colors hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Slide tiếp theo">
          <ChevronRight className="w-6 h-6" />
        </button>
        {/* Dải chấm cho phép chọn slide và cuộn khi danh sách dài. */}
        <div className="absolute bottom-4 left-1/2 z-20 flex max-w-[80%] -translate-x-1/2 items-center gap-2 overflow-x-auto rounded-md border border-white/20 bg-black/25 px-2.5 py-1.5">
          {slides.map((_, index) => (
            <button key={index} type="button" onClick={() => selectSlide(index)} className={`h-2 shrink-0 cursor-pointer rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/45 hover:bg-white/80"}`} aria-label={`Đến chương trình ${index + 1}`} aria-current={index === currentSlide ? "true" : undefined} />
          ))}
        </div>
      </>}
    </section>
  );
}
