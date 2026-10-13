"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Zap, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Danh sách phân loại màu sắc cứng để hiển thị demo.
const COLOR_OPTIONS = [
  { id: 1, label: "Đen huyền", hex: "#1a1a1a" },
  { id: 2, label: "Bạc ánh kim", hex: "#C0C0C0" },
  { id: 3, label: "Vàng gold", hex: "#D4A017" },
  { id: 4, label: "Xanh navy", hex: "#1B2A4A" },
];

// Danh sách phân loại kích cỡ cứng để hiển thị demo.
const SIZE_OPTIONS = ["Tiêu chuẩn", "Pro", "Pro Max", "Ultra"];

// Khu vực chọn phân loại, số lượng và nút hành động mua hàng.
export function ProductActions({ mobileAction }: { mobileAction?: "cart" | "buy" }) {
  // Màu sắc đang được chọn.
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].id);
  // Kích cỡ đang được chọn.
  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  // Số lượng muốn mua.
  const [quantity, setQuantity] = useState(1);
  // Trạng thái yêu thích.
  const [isFavorite, setIsFavorite] = useState(false);

  // Giảm số lượng, không cho xuống dưới 1.
  function handleDecrement() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  // Tăng số lượng, giới hạn tối đa 99.
  function handleIncrement() {
    setQuantity((prev) => Math.min(99, prev + 1));
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Chọn phân loại màu sắc. */}
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-3">
        <span className="pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Màu sắc
        </span>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_OPTIONS.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              title={color.label}
              aria-pressed={selectedColor === color.id}
              className={`group relative flex h-9 items-center gap-2 rounded-lg border-2 px-3 text-xs font-medium transition-all duration-200 ${
                selectedColor === color.id
                  ? "border-primary bg-primary-light text-primary shadow-sm shadow-primary/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {color.label}
              {selectedColor === color.id && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[9px] font-black shadow">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chọn kích cỡ / phiên bản sản phẩm. */}
      <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-3">
        <span className="pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Phiên bản
        </span>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
              className={`rounded-lg border-2 px-4 py-2 text-xs font-medium transition-all duration-200 ${
                selectedSize === size
                  ? "border-primary bg-primary-light text-primary font-semibold shadow-sm shadow-primary/20"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Bộ điều chỉnh số lượng và tồn kho. */}
      <div className="flex items-center gap-4 max-sm:flex-wrap md:max-lg:flex-wrap md:max-lg:gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Số lượng
        </span>
        <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-white">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className="flex h-9 w-9 items-center justify-center border-r border-slate-200 text-slate-500 transition hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-12 text-center text-sm font-bold text-main">{quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= 99}
            className="flex h-9 w-9 items-center justify-center border-l border-slate-200 text-slate-500 transition hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          <span className="font-semibold text-perk">1.243</span> sản phẩm có sẵn
        </span>
      </div>

      {/* Nút mua trên màn hình lớn; bảng mobile hiện nút theo thao tác đã chọn. */}
      <div className={`${mobileAction ? "flex" : "hidden"} gap-3 sm:flex sm:flex-row md:max-lg:flex-col`}>
        <Button
          variant="cta-outline"
          size="lg"
          className={`flex-1 md:max-lg:flex-none ${mobileAction === "cart" ? "max-sm:flex-none max-sm:w-full" : "max-sm:hidden"}`}
          leftIcon={<ShoppingCart className="h-4 w-4" />}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          variant="gradient-cta"
          size="lg"
          className={`flex-1 md:max-lg:flex-none ${mobileAction === "buy" ? "max-sm:flex-none max-sm:w-full" : "max-sm:hidden"}`}
          leftIcon={mobileAction ? undefined : <Zap className="h-4 w-4" />}
        >
          Mua ngay
        </Button>
      </div>

      {/* Nút phụ yêu thích và chia sẻ. */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
        <button
          onClick={() => setIsFavorite((prev) => !prev)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
            isFavorite
              ? "text-danger"
              : "text-muted-foreground hover:text-danger"
          }`}
        >
          <Heart
            className={`h-4 w-4 transition-all ${isFavorite ? "fill-danger text-danger" : ""}`}
          />
          {isFavorite ? "Đã yêu thích" : "Yêu thích"}
          <span className="text-muted-foreground">(2.4k)</span>
        </button>
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-main">
          <Share2 className="h-4 w-4" />
          Chia sẻ
        </button>
      </div>
    </div>
  );
}
