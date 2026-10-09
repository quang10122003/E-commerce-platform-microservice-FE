type SearchResultHeaderProps = {
  keyword: string;
};

// Tiêu đề kết quả tìm kiếm với icon bóng đèn — render phía server.
export function SearchResultHeader({ keyword }: SearchResultHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 py-1">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-main sm:text-2xl">Kết quả tìm kiếm</h1>
        <p className="mt-1 text-sm text-muted-foreground">Từ khóa <span className="font-semibold text-cta">“{keyword}”</span></p>
      </div>
    </div>
  );
}
