"use client";

import { useSimilarProducts } from "@/hooks/user/product-detail/useSimilarProducts";
import { SuggestedProductCard } from "@/components/user/home/suggested-product-card";
import { SuggestedProductsSkeleton } from "@/components/user/home/suggested-products-skeleton";

// Khu vực sản phẩm tương tự chỉ xuất hiện khi đang tải hoặc có dữ liệu hợp lệ.
export function ProductSimilarProductsView({ productId }: { productId: number }) {
  const { products, isLoading, isError } = useSimilarProducts(productId);
  if (isError || (!isLoading && products.length === 0)) return null;

  return (
    <section className="space-y-4" aria-labelledby="similar-products-title">
      <h2 id="similar-products-title" className="text-lg font-medium text-slate-600 sm:text-xl">Có thể bạn cũng thích</h2>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6" aria-busy={isLoading}>
        {isLoading ? <SuggestedProductsSkeleton /> : products.map((product) => <SuggestedProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
