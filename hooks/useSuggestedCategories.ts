"use client";

import { useRef, useState, type MouseEvent } from "react";

// Quản lý thao tác kéo ngang và ngăn điều hướng ngoài ý muốn của danh mục.
export function useSuggestedCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  const handleMouseDown = (event: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setHasMoved(false);
    setStartX(event.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    event.preventDefault();
    const x = event.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    if (Math.abs(walk) > 4) setHasMoved(true);
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleLinkClick = (event: MouseEvent) => {
    if (hasMoved) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return {
    handleLinkClick,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    isDown,
    scrollRef,
  };
}
