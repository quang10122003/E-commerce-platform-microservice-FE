type SearchResultHeaderProps = {
  keyword: string;
  categoryId?: number;
};

// Hiển thị từ khóa hoặc danh mục làm ngữ cảnh của kết quả tìm kiếm.
export function SearchResultHeader({ keyword, categoryId }: SearchResultHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 py-1">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-main sm:text-2xl">Kết quả tìm kiếm</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {keyword && <>Từ khóa <span className="font-semibold text-cta">“{keyword}”</span></>}
          {categoryId !== undefined && <>{keyword ? " · " : ""}Danh mục <span className="font-semibold text-cta">#{categoryId}</span></>}
        </p>
      </div>
    </div>
  );
}
