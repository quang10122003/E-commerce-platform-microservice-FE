import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type ShopFlashSaleHistorySearchProps = {
  id: string;
  keyword: string;
  onKeywordChange: (value: string) => void;
  showLabel?: boolean;
};

// Ô tìm kiếm lịch sử dùng chung cho desktop và thanh công cụ trên màn hình nhỏ.
export function ShopFlashSaleHistorySearch({ id, keyword, onKeywordChange, showLabel = true }: ShopFlashSaleHistorySearchProps) {
  return (
    <div className="min-w-0 flex-1">
      <label htmlFor={id} className={showLabel ? "mb-1.5 block text-sm font-semibold text-muted-foreground" : "sr-only"}>
        Từ khóa tìm kiếm
      </label>
      <Input
        id={id}
        type="text"
        placeholder="Tìm theo tên chương trình..."
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        leftIcon={<Search className="size-4 text-muted-foreground" />}
        rightIcon={keyword ? (
          <button type="button" onClick={() => onKeywordChange("")} aria-label="Xóa từ khóa"
            className="rounded p-0.5 text-muted-foreground hover:bg-surface-subtle hover:text-main transition">
            <X className="size-3.5" />
          </button>
        ) : undefined}
        className="h-10 text-sm bg-white"
      />
    </div>
  );
}
