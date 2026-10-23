"use client";

import { Loader2, Search } from "lucide-react";
import type { ShopProductQuery } from "@/types/user/shop";
import { useShopProductSearch } from "@/hooks/user/shop/useShopProductSearch";

// Tìm sản phẩm trong đúng shop; logic điều hướng được quản lý bởi hook.
export function ShopProductSearch({ shopId, query }: { shopId: number; query: ShopProductQuery }) {
  const { keywordInput, handleKeywordChange, isPending } = useShopProductSearch(shopId, query);
  return (
    <div role="search" aria-label="Tìm sản phẩm trong shop" aria-busy={isPending} data-shop-products-pending={isPending || undefined} className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-3 focus-within:border-primary sm:w-64">
      <input value={keywordInput} onChange={(event) => handleKeywordChange(event.target.value)} type="search" placeholder="Tìm sản phẩm trong shop" aria-label="Từ khóa sản phẩm trong shop" className="min-w-0 flex-1 bg-transparent text-xs text-main outline-none placeholder:text-muted-foreground" />
      {isPending ? <Loader2 className="size-4 shrink-0 animate-spin text-primary motion-reduce:animate-none" aria-label="Đang tìm sản phẩm" /> : <Search className="size-4 shrink-0 text-primary" aria-hidden="true" />}
    </div>
  );
}
