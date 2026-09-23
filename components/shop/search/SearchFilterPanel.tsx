"use client";

import type { ProductBrandOption } from "@/types/product";

type SearchFilterPanelProps = {
  matchedBrands: ProductBrandOption[];
  brandIds: number[];
  isPending: boolean;
  minPriceInput: string;
  maxPriceInput: string;
  priceError: string | null;
  hasActiveFilters: boolean;
  // mobile=true dùng size lớn hơn để dễ thao tác trên thiết bị cảm ứng.
  mobile?: boolean;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onPriceSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBrandChange: (id: number) => void;
  onClearBrands: () => void;
  onClearFilters: () => void;
};

// Nội dung bộ lọc dùng chung cho sidebar desktop và drawer mobile.
export function SearchFilterPanel({
  matchedBrands,
  brandIds,
  isPending,
  minPriceInput,
  maxPriceInput,
  priceError,
  hasActiveFilters,
  mobile = false,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceSubmit,
  onBrandChange,
  onClearBrands,
  onClearFilters,
}: SearchFilterPanelProps) {
  // Lớp CSS input và nút thay đổi theo ngữ cảnh desktop/mobile.
  const inputCls = mobile
    ? "h-9 w-full rounded-xs border border-slate-300 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-cta"
    : "h-8 w-full rounded-xs border border-slate-300 bg-white px-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-cta";
  const submitCls = mobile
    ? "h-9 w-full rounded-xs bg-cta text-xs font-bold uppercase tracking-wide text-white transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
    : "h-8 w-full rounded-xs bg-cta text-xs font-bold uppercase tracking-wide text-white transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60";
  const brandItemCls = mobile
    ? "flex cursor-pointer items-center gap-2.5 rounded-xs px-2.5 py-2 text-xs text-slate-700 transition hover:bg-slate-100"
    : "flex cursor-pointer items-center gap-2 rounded-xs px-2 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100";
  const checkboxCls = mobile ? "h-4 w-4 accent-cta" : "h-3.5 w-3.5 accent-cta";

  return (
    <div className="space-y-4">
      {/* Form nhập khoảng giá với nút áp dụng riêng. */}
      <form onSubmit={onPriceSubmit} className="space-y-3">
        <p className={mobile ? "text-xs font-bold text-slate-800 uppercase tracking-wide" : "text-xs font-medium text-slate-700"}>
          Khoảng Giá
        </p>
        <div className="flex items-center gap-1.5">
          {!mobile && (
            <label className="sr-only" htmlFor="search-min-price">Giá tối thiểu</label>
          )}
          <input
            id={mobile ? undefined : "search-min-price"}
            type="number"
            min="0"
            inputMode="numeric"
            value={minPriceInput}
            onChange={(event) => onMinPriceChange(event.target.value)}
            placeholder="₫ TỪ"
            className={inputCls}
          />
          <span className="text-xs font-bold text-slate-400">-</span>
          {!mobile && (
            <label className="sr-only" htmlFor="search-max-price">Giá tối đa</label>
          )}
          <input
            id={mobile ? undefined : "search-max-price"}
            type="number"
            min="0"
            inputMode="numeric"
            value={maxPriceInput}
            onChange={(event) => onMaxPriceChange(event.target.value)}
            placeholder="₫ ĐẾN"
            className={inputCls}
          />
        </div>
        {priceError && (
          <p className="text-[11px] font-semibold text-danger">{priceError}</p>
        )}
        <button type="submit" disabled={isPending} className={submitCls}>
          {mobile ? "Áp dụng khoảng giá" : "Áp dụng"}
        </button>

        {/* Nút xóa tất cả bộ lọc — chỉ hiện trên desktop sidebar. */}
        {!mobile && hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            disabled={isPending}
            className="w-full text-center text-xs font-medium uppercase text-cta transition hover:underline disabled:cursor-not-allowed disabled:opacity-60"
          >
            Xóa tất cả
          </button>
        )}
      </form>

      {/* Danh sách thương hiệu có trong tập kết quả hiện tại. */}
      <div className={mobile ? "border-t border-slate-200 pt-4 space-y-2" : "border-t border-slate-200/90 pt-4"}>
        <p className={mobile ? "text-xs font-bold text-slate-800 uppercase tracking-wide" : "text-xs font-medium text-slate-700"}>
          Thương hiệu
        </p>
        <div className={mobile ? "space-y-1" : "mt-2 space-y-1"}>
          {/* Nút chọn tất cả thương hiệu — xóa bộ lọc brand. */}
          <button
            type="button"
            onClick={onClearBrands}
            disabled={isPending}
            className={`flex w-full items-center justify-between rounded-xs text-left text-xs transition disabled:cursor-not-allowed disabled:opacity-60 ${
              mobile ? "px-2.5 py-2" : "px-2 py-1.5"
            } ${
              brandIds.length === 0
                ? mobile ? "bg-cta/10 font-bold text-cta" : "bg-cta/10 font-semibold text-cta"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <span>Tất cả thương hiệu</span>
          </button>

          {matchedBrands.length > 0 ? (
            matchedBrands.map((brand) => (
              <label key={brand.id} className={brandItemCls}>
                <input
                  type="checkbox"
                  checked={brandIds.includes(brand.id)}
                  onChange={() => onBrandChange(brand.id)}
                  disabled={isPending}
                  className={checkboxCls}
                />
                <span className="truncate">{brand.name}</span>
              </label>
            ))
          ) : (
            <p className={mobile ? "px-2.5 py-2 text-xs text-slate-400" : "px-2 py-1.5 text-xs text-slate-400"}>
              Chưa có thương hiệu phù hợp
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
