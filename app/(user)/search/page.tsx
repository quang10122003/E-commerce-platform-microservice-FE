import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { PAGE_SIZE } from "@/lib/constants";
import { ProductSearchResultsView } from "@/components/user/search/product-search-results-view";
import { getProductCatalog } from "@/lib/service/productService";
import type { ProductCatalogPage } from "@/types/user/product";

type SearchPageProps = {
  searchParams: Promise<{
    keyword?: string;
    categoryId?: string;
    sort?: string;
    brandIds?: string | string[];
    brandId?: string;
    minPrice?: string;
    maxPrice?: string;
    locations?: string | string[];
  }>;
};

// Chuẩn hóa giá trị giá từ query string trước khi gửi đến backend.
function parsePriceParam(value?: string): number | undefined {
  if (!value?.trim()) return undefined;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : undefined;
}

// Chuẩn hóa brandId từ query string trước khi gửi đến backend.
function parseBrandParams(value?: string | string[]): number[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(
    values
      .flatMap((item) => item.split(","))
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item) && item > 0),
  )];
}
// Chuẩn hóa danh sách tỉnh/thành từ query string trước khi gửi đến backend.
function parseLocationParams(value?: string | string[]): string[] {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return [...new Set(
    values
      .flatMap((item) => item.split(","))
      .map((item) => item.trim())
      .filter(Boolean),
  )];
}

// Hiển thị batch đầu từ server để trang tìm kiếm tải nhanh và có thể lập chỉ mục.
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { keyword = "", categoryId, sort, brandIds, brandId, minPrice, maxPrice, locations } = await searchParams;
  const normalizedKeyword = keyword.trim();
  // Chỉ gửi mã danh mục là số nguyên dương an toàn, không nhận query sai định dạng.
  const parsedCategoryId = categoryId && /^\d+$/.test(categoryId) ? Number(categoryId) : undefined;
  const normalizedCategoryId = parsedCategoryId !== undefined && Number.isSafeInteger(parsedCategoryId) && parsedCategoryId > 0
    ? parsedCategoryId : undefined;
  const normalizedSort = sort === "MOST_SOLD" ? "MOST_SOLD" : "RELEVANCE";
  const normalizedBrandIds = parseBrandParams(brandIds ?? brandId);
  const normalizedLocations = parseLocationParams(locations);
  const normalizedMinPrice = parsePriceParam(minPrice);
  const normalizedMaxPrice = parsePriceParam(maxPrice);
  // Giá trị dự phòng giúp UI vẫn hiển thị khi Elasticsearch tạm thời không phản hồi.
  let initialPage: ProductCatalogPage = {
    items: [],
    nextCursor: null,
    hasNext: false,
    brands: [],
  };

  if (normalizedKeyword || normalizedCategoryId !== undefined) {
    try {
      initialPage = await getProductCatalog({
        keyword: normalizedKeyword,
        categoryId: normalizedCategoryId,
        sort: normalizedSort,
        brandIds: normalizedBrandIds,
        locations: normalizedLocations,
        minPrice: normalizedMinPrice,
        maxPrice: normalizedMaxPrice,
        size: PAGE_SIZE.PRODUCT_SEARCH,
      });
    } catch (error) {
      rethrowSessionRefreshRequired(error);
    // Giữ dữ liệu dự phòng để Client Component hiển thị trạng thái rỗng an toàn.
    }
  }

  return (
    <ProductSearchResultsView
      initialPage={initialPage}
      keyword={normalizedKeyword}
      categoryId={normalizedCategoryId}
      sort={normalizedSort}
      brandIds={normalizedBrandIds}
      locations={normalizedLocations}
      minPrice={normalizedMinPrice}
      maxPrice={normalizedMaxPrice}
    />
  );
}
