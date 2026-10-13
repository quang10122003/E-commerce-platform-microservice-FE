"use client";

import React from "react";
import type { CategoryResponse } from "@/types/shared/category";
import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, MoveHorizontal } from "lucide-react";
import { useSuggestedCategories } from "@/hooks/user/home/useSuggestedCategories";

type SuggestedCategoriesProps = {
  categories: CategoryResponse[];
};

// Hiển thị danh mục từ backend và giữ thao tác kéo ngang hiện có.
export function SuggestedCategories({ categories }: SuggestedCategoriesProps) {
  const {
    gridRef,
    gridTemplateColumns,
    hasOverflow,
    rowCount,
    handleLinkClick,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    isDown,
    scrollRef,
  } = useSuggestedCategories(categories.length);

  // Ẩn toàn bộ khu vực khi không có danh mục để hiển thị.
  if (categories.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Tiêu đề và hướng dẫn duyệt danh mục. */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded-sm bg-cta" />
          <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-main sm:text-lg">
            Danh Mục Ngành Hàng
          </h2>
        </div>

        {hasOverflow && <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <MoveHorizontal className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">Giữ chuột kéo sang ngang để xem thêm</span>
          <span className="sm:hidden">Vuốt ngang xem thêm</span>
        </div>}
      </div>

      {/* Danh mục dùng một hoặc hai hàng theo sức chứa, kéo ngang khi tràn. */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`overflow-x-auto p-3.5 sm:p-5 select-none scrollbar-none transition-colors ${
          hasOverflow ? (isDown ? "cursor-grabbing" : "cursor-grab") : ""
        }`}
      >
        <div
          ref={gridRef}
          className="grid grid-flow-col auto-cols-[120px] sm:auto-cols-[140px] md:auto-cols-[150px] gap-3 sm:gap-4"
          style={{
            gridAutoFlow: gridTemplateColumns ? "row" : undefined,
            gridTemplateColumns: gridTemplateColumns || undefined,
            gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))`,
          }}
        >
          {categories.map((cat) => {
            return (
              <Link
                key={cat.id}
                href={`/search?categoryId=${cat.id}`}
                onClick={handleLinkClick}
                draggable={false}
                className="group relative flex cursor-pointer select-none flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:bg-primary-light/20 hover:shadow-sm sm:p-3.5"
              >
                {/* Ảnh minh họa ngành hàng giúp nhận biết danh mục nhanh hơn. */}
                <div className="relative mb-2.5 aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-100">
                  {cat.imageUrl ? (
                    <>
                      <Image
                        src={cat.imageUrl}
                        alt=""
                        fill
                        unoptimized
                        draggable={false}
                        sizes="(max-width: 640px) 120px, 150px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary-light/20 text-primary">
                      <LayoutGrid className="size-8" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Tên ngành hàng lấy từ backend. */}
                <h3 className="pointer-events-none flex min-h-[30px] items-center justify-center text-xs font-medium leading-tight text-main transition-colors line-clamp-2 group-hover:text-primary">
                  {cat.name}
                </h3>

              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
