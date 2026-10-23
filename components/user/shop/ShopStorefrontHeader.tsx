import Image from "next/image";
import { CalendarDays, Package, Star, Store } from "lucide-react";
import { formatCompactNumber } from "@/lib/utils";
import type { ShopOverviewResponse, ShopStorefrontTab } from "@/types/user/shop";
import { ShopMembershipDuration } from "./ShopMembershipDuration";
import { ShopStorefrontTabs } from "./ShopStorefrontTabs";

// Thông tin shop từ API; lỗi chỉ ẩn hồ sơ, giữ điều hướng để các tab còn sử dụng được.
export function ShopStorefrontHeader({ shop, initialTab }: { shop: ShopOverviewResponse | null; initialTab: ShopStorefrontTab }) {
  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-card" aria-label="Thông tin gian hàng">
      {shop ? <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-8">
        {/* Avatar và tên nhận diện của shop. */}
        <div className="flex items-center gap-4 lg:border-r lg:border-surface-border lg:pr-8">
          <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-light sm:size-24">
            {shop.shopLogoUrl ? <Image src={shop.shopLogoUrl} alt={shop.shopName || "Logo shop"} fill unoptimized sizes="96px" className="object-cover" /> : <Store className="size-9 text-primary" aria-hidden="true" />}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-xl font-bold text-main wrap-anywhere sm:text-2xl">{shop.shopName || "Shop"}</h1>
          </div>
        </div>

        {/* Số sản phẩm và ngày tham gia từ API; đánh giá chưa có dữ liệu nên giữ mock. */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 self-center text-xs sm:text-sm">
          {[
            { icon: Package, label: "Sản phẩm", value: formatCompactNumber(shop.productCount) },
            { icon: Star, label: "Đánh giá", value: "4.9 / 5 (8,2k)" },
            { icon: CalendarDays, label: "Tham gia", value: <ShopMembershipDuration createdAt={shop.shopCreatedAt} /> },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <dt className="flex items-center gap-1.5 text-muted-foreground"><Icon className="size-3.5 shrink-0" />{label}</dt>
              <dd className="font-semibold text-primary">{value}</dd>
            </div>
          ))}
        </dl>
      </div> : null}

      {/* Điều hướng tab đồng bộ URL, giữ phần hồ sơ là Server Component. */}
      <ShopStorefrontTabs initialTab={initialTab} />
    </section>
  );
}
