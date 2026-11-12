import React from "react";
import { SellerLayoutShell } from "@/components/shop/layout/shop-layout-shell";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { getMyShopProfile } from "@/lib/service/shopService";
import type { SellerShopProfile } from "@/types/shop/profile";

// Tải hồ sơ shop một lần ở layout để topbar hiện tên/logo shop; lỗi thì topbar fallback về thông tin tài khoản.
export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let shop: SellerShopProfile | null = null;
  try {
    shop = await getMyShopProfile();
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }

  return <SellerLayoutShell shop={shop}>{children}</SellerLayoutShell>;
}
