"use client";

import Image from "next/image";
import { ChevronRight, Store } from "lucide-react";
import { useProductShopOverview } from "@/hooks/user/product-detail/useProductShopOverview";
import { formatCompactNumber } from "@/lib/utils";
import { ProductDetailChatButton, ProductDetailShopLink } from "./ProductDetailInfoView";

// Hiển thị tổng quan shop thật; chỉ giữ mock đánh giá và trạng thái online chưa có API.
export function ProductShopInfoView() {
  const shop = useProductShopOverview();
  if (!shop) return null;

  return (
    <div id="product-shop-chat" className="relative rounded-xl border border-surface-border bg-white">
      {/* Toàn bộ block shop là vùng bấm trên mobile; URL tạm chưa có trang đích. */}
      <ProductDetailShopLink
        className="absolute inset-0 z-10 rounded-xl transition-colors active:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
        aria-label={`Xem shop ${shop.shopName || ""}`.trim()}
      />
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Avatar và tên shop từ API. */}
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-primary-light">
            {shop.shopLogoUrl ? (
              <Image
                src={shop.shopLogoUrl}
                alt={shop.shopName || "Logo shop"}
                fill
                unoptimized
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <Store className="h-7 w-7 text-primary" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-main wrap-anywhere">{shop.shopName || "Shop"}</div>
            {/* Trạng thái online và đánh giá vẫn giữ mock vì API chưa cung cấp. */}
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span> Online 5 phút trước</span>
              <span className="hidden sm:inline">·</span>
              <span>⭐ 4.9/5 · {formatCompactNumber(shop.productCount)} sản phẩm</span>
            </div>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
        </div>

        {/* Số lượng sản phẩm thật; đánh giá giữ mock cho đến khi có API. */}
        <div className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-2 sm:divide-x sm:divide-slate-100">
          {[
            { label: "Đánh giá", value: "4.9/5" },
            { label: "Sản phẩm", value: formatCompactNumber(shop.productCount) },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-0.5 sm:px-6 first:sm:pl-0">
              <span className="text-base font-black text-primary">{value}</span>
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Nút hành động với shop chỉ hiển thị trên tablet và desktop. */}
        <div className="hidden shrink-0 gap-2 sm:flex sm:flex-col">
          <ProductDetailShopLink className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-primary hover:bg-primary-light hover:text-primary">
            <Store className="h-3.5 w-3.5" />
            Xem Shop
          </ProductDetailShopLink>
          <ProductDetailChatButton />
        </div>
      </div>
    </div>
  );
}
