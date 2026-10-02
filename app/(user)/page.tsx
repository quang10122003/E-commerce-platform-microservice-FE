import { FlashSaleSection } from "@/components/user/flash-sale-section";
import { HeroCarousel } from "@/components/user/hero-carousel";
import { PersonalizedSuggestions } from "@/components/user/personalized-suggestions";
import { SuggestedCategories } from "@/components/user/suggested-categories";
import { TrustPerks, VoucherStrip } from "@/components/user/home-promotions";

export default function ShopHomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <HeroCarousel />
      <VoucherStrip />
      <TrustPerks />
      <SuggestedCategories />
      <FlashSaleSection />
      <PersonalizedSuggestions />
    </div>
  );
}
