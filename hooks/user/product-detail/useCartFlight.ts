"use client";

import { useEffect, useRef } from "react";

// Điều khiển gói hàng bay tới khối giỏ trên navbar, kể cả khi bảng mobile mở.
export function useCartFlight() {
  // Giữ phần tử và animation để hủy an toàn khi rời trang.
  const flightRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => () => { animationRef.current?.cancel(); }, []);

  // Chỉ chạy chuyển động khi có đích trong viewport và người dùng cho phép.
  async function flyToCart(source: HTMLElement) {
    const parcel = flightRef.current;
    if (!parcel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-flight-target]"))
      .find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top >= 0 &&
          rect.bottom <= window.innerHeight && rect.left >= 0 && rect.right <= window.innerWidth;
      });
    if (!target || typeof parcel.animate !== "function") return;

    const start = source.getBoundingClientRect();
    const end = target.getBoundingClientRect();
    try {
      // Popover đưa gói hàng lên trên top layer của dialog, không chặn thao tác.
      if (typeof parcel.showPopover !== "function") parcel.removeAttribute("popover");
      parcel.showPopover?.();
      parcel.style.visibility = "visible";

      // Đo kích thước card thật để tâm gói hàng trùng tâm khối giỏ, không lệch khi đổi UI.
      const parcelBounds = parcel.getBoundingClientRect();
      const halfWidth = parcel.offsetWidth / 2;
      const halfHeight = parcel.offsetHeight / 2;
      // Quy đổi tọa độ viewport về CSS vì giao diện có zoom trên body.
      const scaleX = parcelBounds.width / parcel.offsetWidth;
      const scaleY = parcelBounds.height / parcel.offsetHeight;
      const x = (start.left + start.width / 2 - parcelBounds.left) / scaleX - halfWidth;
      const y = (start.top + start.height / 2 - parcelBounds.top) / scaleY - halfHeight;
      const destinationX = (end.left + end.width / 2 - parcelBounds.left) / scaleX - halfWidth;
      const destinationY = (end.top + end.height / 2 - parcelBounds.top) / scaleY - halfHeight;
      const controlX = x + (destinationX - x) * 0.25;
      const controlY = Math.max(8, Math.min(y - 18, destinationY) - 64);
      const keyframes: Keyframe[] = [
        { transform: `translate(${x}px, ${y}px) scale(0.9)`, opacity: 0, offset: 0 },
        { transform: `translate(${x}px, ${y - 18}px) scale(1)`, opacity: 1, offset: 0.1 },
      ];

      // Lấy mẫu đường cong Bézier, giữ card rõ nét suốt hành trình và chỉ thu nhỏ khi vào giỏ.
      for (let step = 1; step <= 28; step++) {
        const progress = step / 28;
        const remaining = 1 - progress;
        const frameX = remaining * remaining * x + 2 * remaining * progress * controlX +
          progress * progress * destinationX;
        const frameY = remaining * remaining * (y - 18) + 2 * remaining * progress * controlY +
          progress * progress * destinationY;
        keyframes.push({
          transform: `translate(${frameX}px, ${frameY}px) scale(${1 - progress * 0.22})`,
          opacity: 1,
          offset: 0.1 + progress * 0.76,
        });
      }
      keyframes.push(
        { transform: `translate(${destinationX}px, ${destinationY}px) scale(0.65)`, opacity: 1, offset: 0.93 },
        { transform: `translate(${destinationX}px, ${destinationY}px) scale(0.35)`, opacity: 0, offset: 1 },
      );
      const animation = parcel.animate(keyframes, {
        duration: 1200,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
      });
      animationRef.current = animation;
      await animation.finished;
    } catch {
      // Animation bị hủy hoặc không được hỗ trợ không ảnh hưởng request giỏ hàng.
    } finally {
      parcel.style.visibility = "hidden";
      if (typeof parcel.hidePopover === "function" && parcel.matches(":popover-open")) parcel.hidePopover();
      animationRef.current = null;
    }
  }

  return { flightRef, flyToCart };
}
