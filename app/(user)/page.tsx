import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { getCategories } from "@/lib/service/categoryService";
import { FlashSaleSection } from "@/components/user/home/flash-sale-section";
import { HeroCarousel } from "@/components/user/home/hero-carousel";
import { PersonalizedSuggestions } from "@/components/user/home/personalized-suggestions";
import { SuggestedCategories } from "@/components/user/home/suggested-categories";
import { TrustPerks, VoucherStrip } from "@/components/user/home/home-promotions";

// Tải danh mục từ server; lỗi chỉ ẩn khu vực tương ứng.
export default async function ShopHomePage() {
  const [categories] = await Promise.allSettled([
    getCategories(),
  ]);
  // Giữ recovery phiên chung trước khi chuyển lỗi thành UI dự phòng.
  for (const result of [categories]) {
    if (result.status === "rejected") {
      rethrowSessionRefreshRequired(result.reason);
    }
  }
  return (
    <div className="space-y-6 sm:space-y-8">
      <HeroCarousel />
      <SuggestedCategories categories={categories.status === "fulfilled" ? categories.value : []} />
      <FlashSaleSection />
      <VoucherStrip />
      <TrustPerks />
      <PersonalizedSuggestions />
    </div>
  );
}
