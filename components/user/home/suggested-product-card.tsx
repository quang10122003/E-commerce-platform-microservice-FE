import type { ProductCatalogItem } from "@/types/user/product";
import { SearchProductCard } from "../search/SearchProductCard";

// Home dùng cùng thẻ và dữ liệu catalog với trang tìm kiếm.
export function SuggestedProductCard({ product }: { product: ProductCatalogItem }) {
  return <SearchProductCard product={product} />;
}
