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

// Quản lý dữ liệu và tải thêm khi người dùng xem khoảng 70% danh sách.
export function useProductSearch({ initialPage, query }: UseProductSearchOptions) {
  // Lưu toàn bộ sản phẩm đã tải của phiên tìm kiếm hiện tại.
  const [products, setProducts] = useState<ProductCatalogItem[]>(
    initialPage.items ?? [],
  );
  // Lưu cursor để yêu cầu batch kết quả kế tiếp.
  const [nextCursor, setNextCursor] = useState<string | null>(initialPage.nextCursor);
  // Lưu trạng thái còn dữ liệu phía Elasticsearch hay không.
  const [hasNext, setHasNext] = useState(initialPage.hasNext);
  // Theo dõi điểm kích hoạt tải sớm trong lưới sản phẩm.
  const prefetchRef = useRef<HTMLSpanElement>(null);
  // Ghi nhớ cursor đã yêu cầu để tránh gửi trùng cùng một batch.
  const requestedCursorRef = useRef<string | null>(null);
  // Chặn nhiều yêu cầu tải thêm chạy đồng thời.
  const isRequestingRef = useRef(false);
  const [getProductCatalog, { error, isFetching }] = useLazyGetProductCatalogQuery();

  // Tải batch kế tiếp bằng cursor từ batch trước.
  const loadMore = useCallback(async (retry = false) => {
    if (!hasNext || !nextCursor || isFetching || isRequestingRef.current || (!retry && requestedCursorRef.current === nextCursor)) return;

    requestedCursorRef.current = nextCursor;
    isRequestingRef.current = true;
    try {
      const page = await getProductCatalog({ ...query, cursor: nextCursor }).unwrap();
      setProducts((currentProducts) => [
        ...currentProducts,
        ...(page.items ?? []),
      ]);
      setNextCursor(page.nextCursor);
      setHasNext(page.hasNext);
    } catch {
      // Giữ cursor lỗi để điểm quan sát không tự gọi lại liên tục.
    } finally {
      isRequestingRef.current = false;
    }
  }, [getProductCatalog, hasNext, isFetching, nextCursor, query]);

  // Thử lại batch lỗi khi người dùng chủ động yêu cầu.
  const retryLoadMore = useCallback(() => {
    void loadMore(true);
  }, [loadMore]);

  // Quan sát mốc 70% của lưới để tải batch kế tiếp trước khi cuộn hết.
  useEffect(() => {
    const prefetchPoint = prefetchRef.current;
    if (!prefetchPoint || !hasNext) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore();
      },
      { threshold: 0 },
    );

    observer.observe(prefetchPoint);
    return () => observer.disconnect();
  }, [hasNext, loadMore]);

  return { error, hasNext, isFetching, prefetchRef, products, retryLoadMore };
}
