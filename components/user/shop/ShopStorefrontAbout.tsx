import { CalendarDays } from "lucide-react";
import type { ShopOverviewResponse } from "@/types/user/shop";
import { ShopMembershipDuration } from "./ShopMembershipDuration";
import { ShopRichTextDescription } from "./ShopRichTextDescription";

// Giới thiệu dùng chung response overview với hồ sơ shop, không gọi thêm API hoặc giữ nội dung mock.
export function ShopStorefrontAbout({ shop }: { shop: ShopOverviewResponse | null }) {
  if (!shop) return null;

  return (
    <section className="rounded-xl border border-surface-border bg-surface-card p-5 sm:p-6">
      {/* Tên shop giữ bố cục tiêu đề của bản mock. */}
      <h2 className="font-heading text-lg font-bold text-main wrap-anywhere">Về {shop.shopName || "shop"}</h2>
      {/* Hiển thị rich text an toàn hoặc thông báo cập nhật khi mô tả trống. */}
      <div className="mt-3 max-w-3xl"><ShopRichTextDescription value={shop.shopDescription} /></div>
      {/* Tách thông tin tham gia khỏi nội dung rich text bằng vùng metadata riêng. */}
      <dl className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-surface-border pt-4 text-xs">
        <dt className="flex items-center gap-1.5 text-muted-foreground"><CalendarDays className="size-3.5" aria-hidden="true" />Thời gian tham gia</dt>
        <dd className="font-semibold text-primary"><ShopMembershipDuration createdAt={shop.shopCreatedAt} /></dd>
      </dl>
    </section>
  );
}
