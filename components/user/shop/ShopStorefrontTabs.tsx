"use client";

import { ChevronRight } from "lucide-react";
import { useShopStorefrontTabs } from "@/hooks/user/shop/useShopStorefrontTabs";
import type { ShopStorefrontTab } from "@/types/user/shop";

// Giữ radio điều khiển hiệu ứng panel, đồng thời đồng bộ lựa chọn với URL.
export function ShopStorefrontTabs({ initialTab }: { initialTab: ShopStorefrontTab }) {
  const { activeTab, selectTab } = useShopStorefrontTabs(initialTab);
  return (
    <fieldset className="flex min-w-0 overflow-x-auto border-t border-surface-border px-2 sm:px-6">
      <legend className="sr-only">Nội dung gian hàng</legend>
      {([
        { label: "Trang chủ shop", value: "home" },
        { label: "Tất cả sản phẩm", value: "products" },
        { label: "Giới thiệu", value: "about" },
      ] as const).map(({ label, value }) => (
        <label key={value} className="relative shrink-0 cursor-pointer border-b-2 border-transparent px-4 py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-primary has-checked:border-primary has-checked:text-primary has-focus-visible:outline-2 has-focus-visible:-outline-offset-4 has-focus-visible:outline-primary sm:px-6">
          <input id={`shop-tab-${value}`} type="radio" name="shop-content" value={value} checked={activeTab === value} onChange={() => selectTab(value)} aria-controls={`shop-panel-${value}`} className="sr-only" />
          {label}
        </label>
      ))}
      <ChevronRight className="my-auto ml-auto mr-2 size-4 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
    </fieldset>
  );
}
