"use client";

import React, { useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Shirt,
  Headphones,
  Watch,
  Sparkles,
  Camera,
  Gamepad2,
  Home,
  HeartPulse,
  ShoppingBag,
  Car,
  BookOpen,
  Coffee,
  Glasses,
  Footprints,
  MoveHorizontal,
} from "lucide-react";
import { Card } from "@/components/ui";

const shopeeCategories = [
  {
    id: "cat-1",
    name: "Điện Thoại & Phụ Kiện",
    icon: Smartphone,
    count: "12.5k sp",
    tag: "Hot",
    color: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
  },
  {
    id: "cat-2",
    name: "Máy Tính & Laptop",
    icon: Laptop,
    count: "4.8k sp",
    color: "bg-indigo-500/10 text-primary group-hover:bg-primary group-hover:text-white",
  },
  {
    id: "cat-3",
    name: "Thời Trang Nam",
    icon: Shirt,
    count: "24.1k sp",
    color: "bg-sky-500/10 text-sky-600 group-hover:bg-sky-600 group-hover:text-white",
  },
  {
    id: "cat-4",
    name: "Thời Trang Nữ",
    icon: ShoppingBag,
    count: "38.6k sp",
    tag: "Sale",
    color: "bg-rose-500/10 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
  },
  {
    id: "cat-5",
    name: "Âm Thanh & Tai Nghe",
    icon: Headphones,
    count: "6.2k sp",
    color: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
  },
  {
    id: "cat-6",
    name: "Đồng Hồ Thông Minh",
    icon: Watch,
    count: "3.4k sp",
    color: "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
  },
  {
    id: "cat-7",
    name: "Gaming & Console",
    icon: Gamepad2,
    count: "2.9k sp",
    tag: "New",
    color: "bg-purple-500/10 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
  },
  {
    id: "cat-8",
    name: "Máy Ảnh & Quay Phim",
    icon: Camera,
    count: "1.8k sp",
    color: "bg-slate-500/10 text-slate-700 group-hover:bg-slate-800 group-hover:text-white",
  },
  {
    id: "cat-9",
    name: "Nhà Cửa & Đời Sống",
    icon: Home,
    count: "18.3k sp",
    color: "bg-teal-500/10 text-teal-600 group-hover:bg-teal-600 group-hover:text-white",
  },
  {
    id: "cat-10",
    name: "Sức Khỏe & Làm Đẹp",
    icon: HeartPulse,
    count: "15.7k sp",
    tag: "Hot",
    color: "bg-pink-500/10 text-pink-600 group-hover:bg-pink-600 group-hover:text-white",
  },
  {
    id: "cat-11",
    name: "Giày Dép & Sneaker",
    icon: Footprints,
    count: "9.6k sp",
    color: "bg-orange-500/10 text-cta group-hover:bg-cta group-hover:text-white",
  },
  {
    id: "cat-12",
    name: "Phụ Kiện & Mắt Kính",
    icon: Glasses,
    count: "5.1k sp",
    color: "bg-violet-500/10 text-violet-600 group-hover:bg-violet-600 group-hover:text-white",
  },
  {
    id: "cat-13",
    name: "Bách Hóa & Đồ Ăn",
    icon: Coffee,
    count: "7.2k sp",
    color: "bg-yellow-500/10 text-yellow-700 group-hover:bg-yellow-600 group-hover:text-white",
  },
  {
    id: "cat-14",
    name: "Sách & Văn Phòng Phẩm",
    icon: BookOpen,
    count: "4.3k sp",
    color: "bg-cyan-500/10 text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white",
  },
  {
    id: "cat-15",
    name: "Phụ Kiện Ô Tô - Xe Máy",
    icon: Car,
    count: "3.8k sp",
    color: "bg-zinc-500/10 text-zinc-700 group-hover:bg-zinc-800 group-hover:text-white",
  },
  {
    id: "cat-16",
    name: "Deal Độc Quyền",
    icon: Sparkles,
    count: "Gợi ý",
    tag: "-50%",
    color: "bg-cta-light text-cta group-hover:bg-cta group-hover:text-white",
  },
];

export function SuggestedCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setHasMoved(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8; // Scroll speed factor
    if (Math.abs(walk) > 4) {
      setHasMoved(true);
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Prevent click on link if user was dragging
  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Card className="overflow-hidden border-surface-border/80 shadow-xs">
      {/* 1. HEADER */}
      <div className="p-4 sm:p-5 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-5 rounded-full bg-primary" />
          <h2 className="text-base sm:text-lg font-black text-main uppercase tracking-tight">
            Danh Mục Ngành Hàng
          </h2>
        </div>

        {/* Drag Hint */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MoveHorizontal className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Giữ chuột kéo sang ngang để xem thêm</span>
          <span className="sm:hidden">Vuốt sang ngang</span>
        </div>
      </div>

      {/* 2. DRAG-TO-SCROLL 2-ROW GRID */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`p-3 sm:p-4 overflow-x-auto select-none scrollbar-none transition-colors ${
          isDown ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div className="grid grid-rows-2 grid-flow-col auto-cols-[115px] sm:auto-cols-[135px] md:auto-cols-[145px] gap-2.5 sm:gap-3.5">
          {shopeeCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                onClick={handleLinkClick}
                draggable={false}
                className="group relative flex flex-col items-center justify-center p-3 rounded-xl border border-surface-border/60 bg-white hover:border-primary/40 hover:shadow-md transition-all duration-200 text-center select-none"
              >
                {/* Floating Tag (Hot/Sale) */}
                {cat.tag && (
                  <span
                    className={`absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full pointer-events-none ${
                      cat.tag === "Hot" || cat.tag === "-50%"
                        ? "bg-cta text-white"
                        : "bg-primary text-white"
                    }`}
                  >
                    {cat.tag}
                  </span>
                )}

                {/* Icon Wrapper */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-2 transition-all duration-200 pointer-events-none ${cat.color}`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                </div>

                {/* Category Title */}
                <h3 className="text-xs font-semibold text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors pointer-events-none">
                  {cat.name}
                </h3>

                {/* Item Count Subtitle */}
                <span className="text-[10px] text-muted-foreground mt-0.5 pointer-events-none">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
