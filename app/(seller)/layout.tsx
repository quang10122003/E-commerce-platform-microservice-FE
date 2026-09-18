import React from "react";
import { SellerLayoutShell } from "@/components/seller/seller-layout-shell";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SellerLayoutShell>{children}</SellerLayoutShell>;
}