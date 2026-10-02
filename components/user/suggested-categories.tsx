"use client";

import React from "react";
import { categories } from "./suggested-categories.data";
import Link from "next/link";
import { MoveHorizontal } from "lucide-react";
import { Card } from "@/components/ui";
import { useSuggestedCategories } from "@/hooks/useSuggestedCategories";


export function SuggestedCategories() {
  const {
    handleLinkClick,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    isDown,
    scrollRef,
  } = useSuggestedCategories();

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
