import "server-only";
import { FlashSaleApiError, getShopFlashSaleProducts, getShopFlashSaleCampaignDetail } from "@/lib/service/flashSaleService";
import { ShopFlashSaleRegistrationForm } from "./shop-flash-sale-registration-form";

// Tải hai nguồn song song, giữ kết quả thành công dù nguồn còn lại thất bại.
export async function ShopFlashSaleRegistrationContent({ campaignId, isModal = false }: { campaignId: string; isModal?: boolean }) {
  const [productsResult, campaignResult] = await Promise.allSettled([
    getShopFlashSaleProducts(), getShopFlashSaleCampaignDetail(campaignId),
  ]);
  const products = productsResult.status === "fulfilled" ? productsResult.value : [];
  const campaign = campaignResult.status === "fulfilled" ? campaignResult.value.data : undefined;
  const error = productsResult.status === "rejected"
    ? productsResult.reason instanceof FlashSaleApiError ? productsResult.reason.message : "Không thể tải sản phẩm. Vui lòng thử lại."
    : undefined;
  const campaignError = campaignResult.status === "rejected"
    ? campaignResult.reason instanceof FlashSaleApiError ? campaignResult.reason.message : "Không thể tải thông tin chương trình. Vui lòng thử lại."
    : undefined;
  return <ShopFlashSaleRegistrationForm campaignId={campaignId} products={products} error={error} campaign={campaign}
    campaignError={campaignError} now={campaignResult.status === "fulfilled" ? campaignResult.value.now : 0} isModal={isModal} />;
}

