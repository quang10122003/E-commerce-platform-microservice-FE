import { FlashSaleSection } from "@/components/user/home/flash-sale-section";
import { HeroCarousel } from "@/components/user/home/hero-carousel";
import { PersonalizedSuggestions } from "@/components/user/home/personalized-suggestions";
import { SuggestedCategories } from "@/components/user/home/suggested-categories";
import { TrustPerks, VoucherStrip } from "@/components/user/home/home-promotions";

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
