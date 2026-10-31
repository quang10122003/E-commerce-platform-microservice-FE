import { Suspense } from "react";
import { RecommendationsPageView } from "@/components/user/home/recommendations-page-view";
import { SuggestedProductsSkeleton } from "@/components/user/home/suggested-products-skeleton";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { getProductRecommendations } from "@/lib/service/productService";
import { parseRecommendationsQuery } from "@/utils/recommendations.utils";
import type { ProductRecommendationsPageQuery } from "@/types/user/product";

async function RecommendationsResults({ query }: { query: ProductRecommendationsPageQuery }) {
  let data = null;
  try {
    data = await getProductRecommendations(query);
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }
  return <RecommendationsPageView data={data} />;
}

export default async function RecommendationsPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseRecommendationsQuery(await searchParams);
  return (
    <section className="space-y-4">
      <h1 className="text-lg font-bold text-main sm:text-xl">Sản phẩm dành cho bạn</h1>
      <Suspense key={`${query.page}:${query.size}`} fallback={
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6"><SuggestedProductsSkeleton /></div>
      }>
        <RecommendationsResults query={query} />
      </Suspense>
    </section>
  );
}
