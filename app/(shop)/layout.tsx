import React from "react";
import { SellerLayoutShell } from "@/components/shop/shop-layout-shell";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SellerLayoutShell>{children}</SellerLayoutShell>;
}
