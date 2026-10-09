import Image from "next/image";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FlashSaleCategory } from "@/types/user/flash-sale";

type FlashSaleCategoriesProps = {
  categories: FlashSaleCategory[];
  selectedId?: number;
  onSelect: (id?: number) => void;
  isLoading: boolean;
  hasError: boolean;
};

// Dải danh mục cuộn ngang giữ lựa chọn dễ chạm trên cả desktop và mobile.
export function FlashSaleCategories({ categories, selectedId, onSelect, isLoading, hasError }: FlashSaleCategoriesProps) {
  return (
    <section className="rounded-xl border border-surface-border bg-surface-card" aria-label="Lọc sale theo danh mục">
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
        <h2 className="font-heading text-sm font-semibold">Săn sale theo danh mục</h2>
        <p className="text-xs text-muted-foreground">Chọn ngành hàng bạn quan tâm</p>
      </div>
      {/* Lựa chọn tất cả luôn khả dụng kể cả khi API danh mục lỗi. */}
      <div className="flex gap-2 overflow-x-auto p-4 sm:gap-3 sm:px-5">
        {[{ id: undefined, name: "Tất cả", imageUrl: null }, ...categories].map((category) => (
          <button key={category.id ?? "all"} type="button" aria-pressed={selectedId === category.id}
            onClick={() => onSelect(category.id)}
            className={cn("flex min-h-12 shrink-0 items-center gap-2.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              selectedId === category.id ? "border-primary bg-primary-light text-primary" : "border-surface-border text-main hover:border-primary/40 hover:bg-surface-subtle")}>
            {category.imageUrl ? <Image src={category.imageUrl} alt="" width={32} height={32} unoptimized className="size-8 rounded object-cover" /> : <LayoutGrid className="size-5 shrink-0" aria-hidden="true" />}
            {category.name}
          </button>
        ))}
        {isLoading && <span className="self-center text-sm text-muted-foreground" role="status">Đang tải danh mục…</span>}
      </div>
      {hasError && <p className="px-4 pb-4 text-sm text-danger" role="status">Chưa tải được danh mục. Bạn vẫn có thể xem tất cả sản phẩm và thử tải lại.</p>}
    </section>
  );
}
