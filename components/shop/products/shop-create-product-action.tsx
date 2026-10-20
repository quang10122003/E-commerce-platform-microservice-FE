"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { useShopStickyProductAction } from "@/hooks/shop/products/useShopStickyProductAction";

// Giữ thao tác thêm sản phẩm ở vị trí gốc hoặc navbar theo vị trí cuộn.
export function ShopCreateProductAction() {
  const { anchorRef, navbarTarget } = useShopStickyProductAction();
  const action = (
    <Link href="/shop/products/new" className="block w-full sm:w-auto">
      <Button variant="gradient-cta" size="md" leftIcon={<Plus className="h-4 w-4" />} className="w-full whitespace-nowrap px-3 text-xs font-bold sm:w-auto sm:px-4">
        Thêm sản phẩm
      </Button>
    </Link>
  );

  return (
    <>
      <div ref={anchorRef} className="w-full sm:w-auto">
        <div className={navbarTarget ? "invisible" : undefined}>{action}</div>
      </div>
      {navbarTarget && createPortal(action, navbarTarget)}
    </>
  );
}
