import type { Metadata } from "next";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { ShopProfileView } from "@/components/shop/profile/shop-profile-view";
import { getMyShopProfile } from "@/lib/service/shopService";
import type { SellerShopProfile } from "@/types/shop/profile";

export const metadata: Metadata = {
  title: "Hồ sơ shop | Kênh Người Bán",
};

// Hồ sơ shop của tài khoản đang đăng nhập, tải trên server; lỗi thì view hiện nút thử lại.
export default async function ShopProfilePage() {
  let shop: SellerShopProfile | null = null;

  try {
    shop = await getMyShopProfile();
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }

  return <ShopProfileView shop={shop} />;
}
