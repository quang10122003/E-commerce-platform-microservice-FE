"use client";

import React, { useRef, useState } from "react";
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

const categories = [
  {
    id: "cat-1",
    name: "Điện Thoại & Phụ Kiện",
    icon: Smartphone,
    count: "14.2k sp",
    tag: "Hot",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "cat-2",
    name: "Máy Tính & Laptop",
    icon: Laptop,
    count: "5.8k sp",
    gradient: "from-indigo-500 to-purple-600",
  },
  {
    id: "cat-3",
    name: "Thời Trang Nam",
    icon: Shirt,
    count: "28.1k sp",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    id: "cat-4",
    name: "Thời Trang Nữ",
    icon: ShoppingBag,
    count: "42.6k sp",
    tag: "Sale",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "cat-5",
    name: "Âm Thanh & Tai Nghe",
    icon: Headphones,
    count: "7.2k sp",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "cat-6",
    name: "Đồng Hồ Thông Minh",
    icon: Watch,
    count: "4.4k sp",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "cat-7",
    name: "Gaming & Console",
    icon: Gamepad2,
    count: "3.9k sp",
    tag: "New",
    gradient: "from-purple-600 to-violet-700",
  },
  {
    id: "cat-8",
    name: "Máy Ảnh & Quay Phim",
    icon: Camera,
    count: "2.1k sp",
    gradient: "from-slate-700 to-zinc-800",
  },
  {
    id: "cat-9",
    name: "Nhà Cửa & Đời Sống",
    icon: Home,
    count: "21.3k sp",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    id: "cat-10",
    name: "Sức Khỏe & Làm Đẹp",
    icon: HeartPulse,
    count: "18.7k sp",
    tag: "Hot",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: "cat-11",
    name: "Giày Dép & Sneaker",
    icon: Footprints,
    count: "11.6k sp",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "cat-12",
    name: "Phụ Kiện & Mắt Kính",
    icon: Glasses,
    count: "6.1k sp",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "cat-13",
    name: "Bách Hóa & Đồ Ăn",
    icon: Coffee,
    count: "8.9k sp",
    gradient: "from-yellow-500 to-amber-600",
  },
  {
    id: "cat-14",
    name: "Sách & Văn Phòng",
    icon: BookOpen,
    count: "5.3k sp",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: "cat-15",
    name: "Phụ Kiện Xe Máy & Ô Tô",
    icon: Car,
    count: "4.8k sp",
    gradient: "from-zinc-600 to-slate-800",
  },
  {
    id: "cat-16",
    name: "Siêu Deal Độc Quyền",
    icon: Sparkles,
    count: "Gợi ý",
    tag: "-50%",
    gradient: "from-orange-500 to-cta-flame",
  },
];

export function SuggestedCategories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

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
    const walk = (x - startX) * 1.8;
    if (Math.abs(walk) > 4) {
      setHasMoved(true);
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Card variant="3d" className="overflow-hidden border-slate-200/90 bg-white shadow-3d">
      {/* 1. HEADER */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 rounded-full bg-gradient-to-b from-primary to-indigo-700 shadow-xs" />
          <h2 className="text-base sm:text-lg font-black text-main uppercase tracking-tight flex items-center gap-2">
            Danh Mục Ngành Hàng
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <MoveHorizontal className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Giữ chuột kéo sang ngang để xem thêm</span>
          <span className="sm:hidden">Vuốt ngang xem thêm</span>
        </div>
      </div>

      {/* 2. DRAG-TO-SCROLL 2-ROW GRID */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`p-3.5 sm:p-5 overflow-x-auto select-none scrollbar-none transition-colors ${
          isDown ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div className="grid grid-rows-2 grid-flow-col auto-cols-[120px] sm:auto-cols-[140px] md:auto-cols-[150px] gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                onClick={handleLinkClick}
                draggable={false}
                className="group relative flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-primary/50 hover:shadow-3d hover:-translate-y-1.5 transition-all duration-300 text-center select-none cursor-pointer"
              >
                {/* Floating Tag */}
                {cat.tag && (
                  <span
                    className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs pointer-events-none ${
                      cat.tag === "Hot" || cat.tag === "-50%"
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white animate-pulse"
                        : "bg-primary text-white"
                    }`}
                  >
                    {cat.tag}
                  </span>
                )}

                {/* 3D-Styled Icon Wrapper */}
                <div
                  className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center mb-2.5 shadow-md shadow-slate-900/10 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 pointer-events-none`}
                >
                  <Icon className="w-6 h-6 drop-shadow-sm" />
                </div>

                {/* Category Title */}
                <h3 className="text-xs font-bold text-main line-clamp-2 leading-tight group-hover:text-primary transition-colors pointer-events-none min-h-[30px] flex items-center justify-center">
                  {cat.name}
                </h3>

                {/* Item Count Subtitle */}
                <span className="text-[10px] text-muted-foreground font-medium mt-1 pointer-events-none">
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
