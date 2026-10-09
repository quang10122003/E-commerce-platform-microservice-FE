import type { Metadata } from "next";
import { UserFlashSaleView } from "@/components/user/flash-sale/user-flash-sale-view";

export const metadata: Metadata = {
  title: "Flash Sale | ModernShop",
  description: "Khám phá sản phẩm và phân loại đang được giảm giá trong đợt Flash Sale hiện tại.",
};

// Giữ page là Server Component; chỉ vùng sale cần bộ lọc và đồng hồ phía client.
export default function FlashSalePage() {
  return <UserFlashSaleView />;
}

