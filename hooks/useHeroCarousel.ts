"use client";

import { useCallback, useEffect, useState } from "react";

// Quản lý slide hiện tại và tự động chuyển slide cho hero carousel.
export function useHeroCarousel(slideCount: number, intervalMs = 4500) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((previous) => (previous === slideCount - 1 ? 0 : previous + 1));
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((previous) => (previous === 0 ? slideCount - 1 : previous - 1));
  }, [slideCount]);

  // Chuyển trực tiếp đến slide được chọn từ indicator.
  const selectSlide = (index: number) => setCurrentSlide(index);

  // Tự động chuyển slide khi người dùng không tương tác với banner.
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(nextSlide, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs, isAutoPlaying, nextSlide]);

  return {
    currentSlide,
    isAutoPlaying,
    nextSlide,
    prevSlide,
    selectSlide,
    setIsAutoPlaying,
  };
}
