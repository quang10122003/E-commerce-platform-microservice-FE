import { SUGGESTIONS_INITIAL_COUNT } from "@/lib/constants";
import type { ProductRecommendationsPageQuery } from "@/types/user/product";

export function parseRecommendationsQuery(params: Record<string, string | string[] | undefined>): ProductRecommendationsPageQuery {
  const page = typeof params.page === "string" && /^\d+$/.test(params.page) ? Number(params.page) : NaN;
  const size = typeof params.size === "string" && /^\d+$/.test(params.size) ? Number(params.size) : NaN;
  return {
    // Mặc định bỏ qua page 1 đã có ở Home, nhưng vẫn cho phép truy vấn rõ page=1.
    page: Number.isSafeInteger(page) && page > 0 ? page : 2,
    size: Number.isSafeInteger(size) && size > 0 ? Math.min(size, 50) : SUGGESTIONS_INITIAL_COUNT,
  };
}

export function getRecommendationsUrl(page: number, size: number): string {
  return `/recommendations?${new URLSearchParams({ page: String(page), size: String(size) })}`;
}
