import { ChevronDown } from "lucide-react";
import administrativeUnits from "@/data/vietnam-administrative-units.json";
import type { ProductBrandOption } from "@/types/product";

const provinces = Object.entries(administrativeUnits.provinceNameMap);

type ChoiceFilterProps = {
  mobile: boolean;
  isPending: boolean;
  className: string;
  checkboxClassName: string;
};

export function BrandFilter({ mobile, isPending, className, checkboxClassName, brands, selectedIds, onChange, onClear }: ChoiceFilterProps & {
  brands: ProductBrandOption[];
  selectedIds: number[];
  onChange: (id: number) => void;
  onClear: () => void;
}) {
  const sectionClass = mobile ? "border-t border-slate-200 pt-4 space-y-2" : "border-t border-slate-200/90 pt-4";
  const textClass = mobile ? "text-xs font-bold text-slate-800 uppercase tracking-wide" : "text-xs font-medium text-slate-700";
  return (
    <div className={sectionClass}>
      <p className={textClass}>Thương hiệu</p>
      <div className={mobile ? "space-y-1" : "mt-2 space-y-1"}>
        <button type="button" onClick={onClear} disabled={isPending} className={`flex w-full items-center justify-between rounded-xs text-left text-xs transition disabled:cursor-not-allowed disabled:opacity-60 ${mobile ? "px-2.5 py-2" : "px-2 py-1.5"} ${selectedIds.length === 0 ? "bg-cta/10 font-semibold text-cta" : "text-slate-600 hover:bg-slate-100"}`}>Tất cả thương hiệu</button>
        {brands.length ? brands.map((brand) => (
          <label key={brand.id} className={className}><input type="checkbox" checked={selectedIds.includes(brand.id)} onChange={() => onChange(brand.id)} disabled={isPending} className={checkboxClassName} /><span className="truncate">{brand.name}</span></label>
        )) : <p className={mobile ? "px-2.5 py-2 text-xs text-slate-400" : "px-2 py-1.5 text-xs text-slate-400"}>Chưa có thương hiệu phù hợp</p>}
      </div>
    </div>
  );
}

export function ProvinceFilter({ mobile, isPending, className, checkboxClassName, locations, onChange }: ChoiceFilterProps & {
  locations: string[];
  onChange: (location: string) => void;
}) {
  const sectionClass = mobile ? "border-t border-slate-200 pt-4 space-y-2" : "border-t border-slate-200/90 pt-4";
  const renderProvince = ([name, value]: [string, string]) => (
    <label key={name} className={className}><input type="checkbox" value={value} checked={locations.includes(value)} onChange={() => onChange(value)} disabled={isPending} className={checkboxClassName} /><span className="truncate">{name}</span></label>
  );
  return (
    <div className={sectionClass}>
      <p className={mobile ? "text-xs font-bold text-slate-800 uppercase tracking-wide" : "text-xs font-medium text-slate-700"}>Tỉnh / Thành phố</p>
      <div className={mobile ? "space-y-1" : "mt-2 space-y-1"}>
        {provinces.slice(0, 7).map(renderProvince)}
        <details className="group flex flex-col"><div className="space-y-1">{provinces.slice(7).map(renderProvince)}</div><summary className="order-last flex cursor-pointer list-none items-center gap-1 px-2 py-1.5 text-[11px] font-medium text-slate-500 transition hover:text-slate-700"><span className="group-open:hidden">Xem thêm</span><span className="hidden group-open:inline">Thu nhỏ</span><ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" /></summary></details>
      </div>
    </div>
  );
}
