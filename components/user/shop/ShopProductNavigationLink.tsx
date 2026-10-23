"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { useShopProductNavigation } from "@/hooks/user/shop/useShopProductNavigation";

// Giữ Link và đánh dấu pending để lưới server hiện skeleton mà không cần thêm state dùng chung.
export function ShopProductNavigationLink(props: ComponentProps<typeof Link> & { href: string }) {
  const { isPending, handleClick } = useShopProductNavigation(props.href);
  return <Link {...props} onClick={handleClick} data-shop-products-pending={isPending || undefined} aria-busy={isPending} />;
}
