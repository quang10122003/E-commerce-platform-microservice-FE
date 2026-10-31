"use client";

import { usePersonalizedSuggestions } from "@/hooks/user/home/usePersonalizedSuggestions";
import { SuggestedProductCard } from "./suggested-product-card";
import { SuggestedProductsSkeleton } from "./suggested-products-skeleton";
import { Button } from "@/components/ui";

export function PersonalizedSuggestions({ showHeading = true }: { showHeading?: boolean }) {
  const {
    products,
    isLoading,
    isError,
    handleViewMore,
  } = usePersonalizedSuggestions();

  return (
    <div className="space-y-4">
      {showHeading && <h2 className="text-lg font-bold text-main sm:text-xl">Sản phẩm dành cho bạn</h2>}

      {/* Lưới sản phẩm thật và skeleton giữ bố cục trong lúc tải. */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3.5 sm:gap-4" aria-busy={isLoading}>
        {!isLoading && products.map((product) => <SuggestedProductCard key={product.id} product={product} />)}
        {isLoading && <SuggestedProductsSkeleton />}
      </div>

      {isError && !isLoading && (
        <div className="rounded-xl border border-surface-border bg-surface-card p-6 text-center">
          <p className="text-sm text-muted-foreground">Sản phẩm gợi ý đang được cập nhật.</p>
        </div>
      )}

      {!isLoading && !isError && products.length === 0 && (
        <p className="rounded-xl border border-surface-border bg-surface-card p-6 text-center text-sm text-muted-foreground">
          Chưa có sản phẩm gợi ý. Bạn hãy quay lại sau nhé.
        </p>
      )}

      {/* Home chỉ mở trang gợi ý, không tải thêm sản phẩm tại chỗ. */}
      {!isLoading && (
        <div className="text-center pt-5 pb-2">
          <Button
            variant="outline"
            size="lg"
            onClick={handleViewMore}
            className="rounded-lg px-10 text-xs sm:text-sm font-bold border-slate-300 text-main hover:border-primary hover:text-primary hover:bg-primary-light/40"
          >
            Xem Thêm Sản Phẩm Gợi Ý
          </Button>
        </div>
      )}
    </div>
  );
}
