import { useCallback, useEffect, useRef, useState } from "react";

import { useLazyGetProductCatalogQuery } from "@/lib/redux/services/product-api";
import type {
  ProductCatalogItem,
  ProductCatalogPage,
  ProductCatalogQuery,
} from "@/types/product";

type UseProductSearchOptions = {
  initialPage: ProductCatalogPage;
  query: ProductCatalogQuery;
};

// Quản lý dữ liệu và tự tải thêm kết quả khi người dùng cuộn đến cuối trang.
export function useProductSearch({ initialPage, query }: UseProductSearchOptions) {
  // Lưu toàn bộ sản phẩm đã tải của phiên tìm kiếm hiện tại.
  const [products, setProducts] = useState<ProductCatalogItem[]>(
    initialPage.items ?? [],
  );
  // Lưu cursor để yêu cầu batch kết quả kế tiếp.
  const [nextCursor, setNextCursor] = useState<string | null>(initialPage.nextCursor);
  // Lưu trạng thái còn dữ liệu phía Elasticsearch hay không.
  const [hasNext, setHasNext] = useState(initialPage.hasNext);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [getProductCatalog, { error, isFetching }] = useLazyGetProductCatalogQuery();

  // Tải batch kế tiếp bằng cursor từ batch trước.
  const loadMore = useCallback(async () => {
    if (!hasNext || !nextCursor || isFetching) return;

    const page = await getProductCatalog({ ...query, cursor: nextCursor }).unwrap();
    setProducts((currentProducts) => [
      ...currentProducts,
      ...(page.items ?? []),
    ]);
    setNextCursor(page.nextCursor);
    setHasNext(page.hasNext);
  }, [getProductCatalog, hasNext, isFetching, nextCursor, query]);

  // Quan sát điểm cuối danh sách để kích hoạt infinity scroll.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore();
      },
      { rootMargin: "240px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNext, loadMore]);

  return { error, hasNext, isFetching, products, sentinelRef };
}
