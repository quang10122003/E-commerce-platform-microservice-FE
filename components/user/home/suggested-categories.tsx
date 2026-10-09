"use client";

import React from "react";
import { categories } from "./suggested-categories.data";
import Link from "next/link";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";
import { useSuggestedCategories } from "@/hooks/user/home/useSuggestedCategories";

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
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* 1. HEADER */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-sm bg-cta" />
          <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-main sm:text-lg">
            Danh Mục Ngành Hàng
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MoveHorizontal className="h-3.5 w-3.5 text-primary" />
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
        className={`overflow-x-auto p-3.5 sm:p-5 select-none scrollbar-none transition-colors ${
          isDown ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <div className="grid grid-rows-2 grid-flow-col auto-cols-[120px] sm:auto-cols-[140px] md:auto-cols-[150px] gap-3 sm:gap-4">
          {categories.map((cat) => {
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                onClick={handleLinkClick}
                draggable={false}
                className="group relative flex cursor-pointer select-none flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary-light/20 hover:shadow-sm sm:p-3.5"
              >
                {/* Floating Tag */}
                {cat.tag && (
                  <span
                    className={`pointer-events-none absolute right-2 top-2 rounded-sm px-1.5 py-0.5 text-[9px] font-semibold ${
                      cat.tag === "Hot" || cat.tag === "-50%"
                        ? "bg-cta-light text-cta"
                        : "bg-primary-light text-primary"
                    }`}
                  >
                    {cat.tag}
                  </span>
                )}

                {/* Ảnh minh họa ngành hàng giúp nhận biết danh mục nhanh hơn. */}
                <div className="relative mb-2.5 aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-100">
                  <Image
                    src={cat.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 120px, 150px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                </div>

                {/* Category Title */}
                <h3 className="pointer-events-none flex min-h-[30px] items-center justify-center text-xs font-medium leading-tight text-main transition-colors line-clamp-2 group-hover:text-primary">
                  {cat.name}
                </h3>

                {/* Item Count Subtitle */}
                <span className="pointer-events-none mt-1 text-[10px] font-medium text-muted-foreground">
                  {cat.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
