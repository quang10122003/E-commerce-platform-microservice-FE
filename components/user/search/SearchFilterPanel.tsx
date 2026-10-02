import type { ProductBrandOption } from "@/types/product";
import { BrandFilter, ProvinceFilter } from "./SearchChoiceFilters";

type SearchFilterPanelProps = {
  matchedBrands: ProductBrandOption[];
  brandIds: number[];
  locations: string[];
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
  onLocationChange: (location: string) => void;
  onClearFilters: () => void;
};

// Nội dung bộ lọc dùng chung cho sidebar desktop và drawer mobile.
export function SearchFilterPanel({
  matchedBrands, brandIds, locations, isPending, minPriceInput, maxPriceInput,
  priceError, hasActiveFilters, mobile = false, onMinPriceChange, onMaxPriceChange,
  onPriceSubmit, onBrandChange, onClearBrands, onLocationChange, onClearFilters,
}: SearchFilterPanelProps) {
  // Lớp CSS input và nút thay đổi theo ngữ cảnh desktop/mobile.
  const inputCls = mobile
    ? "h-9 w-full rounded-xs border border-slate-300 bg-white px-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-cta"
    : "h-8 w-full rounded-xs border border-slate-300 bg-white px-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-cta";
  const submitCls = mobile
    ? "h-9 w-full rounded-xs bg-cta text-xs font-bold uppercase tracking-wide text-white transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60"
    : "h-8 w-full rounded-xs bg-cta text-xs font-bold uppercase tracking-wide text-white transition hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-60";
  const choiceClass = mobile
    ? "flex cursor-pointer items-center gap-2.5 rounded-xs px-2.5 py-2 text-xs text-slate-700 transition hover:bg-slate-100"
    : "flex cursor-pointer items-center gap-2 rounded-xs px-2 py-1.5 text-xs text-slate-600 transition hover:bg-slate-100";
  const checkboxClass = mobile ? "h-4 w-4 accent-cta" : "h-3.5 w-3.5 accent-cta";

  return (
    <div className="space-y-4">
      {/* Form nhập khoảng giá với nút áp dụng riêng. */}
      <form onSubmit={onPriceSubmit} className="space-y-3">
        <p className={mobile ? "text-xs font-bold text-slate-800 uppercase tracking-wide" : "text-xs font-medium text-slate-700"}>Khoảng Giá</p>
        <div className="flex items-center gap-1.5">
          {!mobile && <label className="sr-only" htmlFor="search-min-price">Giá tối thiểu</label>}
          <input id={mobile ? undefined : "search-min-price"} type="number" min="0" inputMode="numeric" value={minPriceInput} onChange={(event) => onMinPriceChange(event.target.value)} placeholder="₫ TỪ" className={inputCls} />
          <span className="text-xs font-bold text-slate-400">-</span>
          {!mobile && <label className="sr-only" htmlFor="search-max-price">Giá tối đa</label>}
          <input id={mobile ? undefined : "search-max-price"} type="number" min="0" inputMode="numeric" value={maxPriceInput} onChange={(event) => onMaxPriceChange(event.target.value)} placeholder="₫ ĐẾN" className={inputCls} />
        </div>
        {priceError && <p className="text-[11px] font-semibold text-danger">{priceError}</p>}
        <button type="submit" disabled={isPending} className={submitCls}>{mobile ? "Áp dụng khoảng giá" : "Áp dụng"}</button>
        {!mobile && hasActiveFilters && <button type="button" onClick={onClearFilters} disabled={isPending} className="w-full text-center text-xs font-medium uppercase text-cta transition hover:underline disabled:cursor-not-allowed disabled:opacity-60">Xóa tất cả</button>}
      </form>
      {/* Danh sách thương hiệu và địa điểm dùng chung cho desktop/mobile. */}
      <BrandFilter mobile={mobile} isPending={isPending} className={choiceClass} checkboxClassName={checkboxClass} brands={matchedBrands} selectedIds={brandIds} onChange={onBrandChange} onClear={onClearBrands} />
      <ProvinceFilter mobile={mobile} isPending={isPending} className={choiceClass} checkboxClassName={checkboxClass} locations={locations} onChange={onLocationChange} />
    </div>
  );
}
