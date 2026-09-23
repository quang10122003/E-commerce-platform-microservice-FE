import { Lightbulb } from "lucide-react";

type SearchResultHeaderProps = {
  keyword: string;
};

// Tiêu đề kết quả tìm kiếm với icon bóng đèn — render phía server.
export function SearchResultHeader({ keyword }: SearchResultHeaderProps) {
  return (
    <div className="flex items-center gap-2 py-1 text-sm text-slate-600">
      <Lightbulb className="h-4 w-4 text-amber-500 shrink-0" />
      <span>
        Kết quả tìm kiếm cho từ khoá &apos;
        <span className="font-bold text-cta">{keyword}</span>
        &apos;
      </span>
    </div>
  );
}
