import { HERO_CAROUSEL_INTERVAL_MS } from "@/lib/constants";
import { useCallback, useEffect, useRef, useState } from "react";

// Quản lý slide hiện tại và tự động chuyển slide cho hero carousel.
export function useHeroCarousel(slideCount: number) {
  // Lưu vị trí và số lượng cùng nhau để thu danh sách không làm vượt phạm vi.
  const [position, setPosition] = useState({ index: 0, count: slideCount });
  const carouselRef = useRef<HTMLElement>(null);
  const currentSlide = Math.min(position.index, Math.max(0, slideCount - 1));
  if (position.count !== slideCount) setPosition({ index: currentSlide, count: slideCount });

  // Chuyển tới slide kế tiếp và quay về đầu khi hết danh sách.
  const nextSlide = useCallback(() => {
    setPosition((previous) => ({ index: slideCount > 1 ? (previous.index + 1) % slideCount : 0, count: slideCount }));
  }, [slideCount]);

  // Chuyển về slide trước và quay về cuối khi đang ở đầu danh sách.
  const prevSlide = () => {
    setPosition((previous) => ({ index: slideCount > 1 ? (previous.index + slideCount - 1) % slideCount : 0, count: slideCount }));
  };

  // Chọn slide theo chấm chỉ báo và giới hạn chỉ số trong danh sách.
  const selectSlide = (index: number) => setPosition({ index: Math.max(0, Math.min(index, slideCount - 1)), count: slideCount });

  // Tự động chuyển slide khi người dùng không tương tác với banner.
  useEffect(() => {
    if (slideCount < 2) return;

    const timer = setInterval(() => {
      // Focus trong iframe không truyền :focus-within, nhưng iframe vẫn là activeElement của trang.
      const carousel = carouselRef.current;
      if (carousel && !carousel.matches(":hover, :active") && !carousel.contains(document.activeElement)) nextSlide();
    }, HERO_CAROUSEL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [slideCount, nextSlide]);

  return {
    carouselRef,
    currentSlide,
    nextSlide,
    prevSlide,
    selectSlide,
  };
}
