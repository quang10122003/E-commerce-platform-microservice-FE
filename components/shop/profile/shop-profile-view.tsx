"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ChevronRight, ExternalLink, Loader2, Package, RefreshCw, ShoppingBag, Store, UserRound } from "lucide-react";
import { useShopLogoUpload } from "@/hooks/shop/profile/useShopLogoUpload";
import type { SellerShopProfile } from "@/types/shop/profile";
import { ShopProfileInfoForm } from "./shop-profile-info-form";

// Logo shop tròn có nút đổi ảnh; chưa có logo thì hiện chữ cái đầu tên shop.
function ShopLogoPicker({ shop }: { shop: SellerShopProfile }) {
  const { logoUrl, isUploading, changeLogo } = useShopLogoUpload(shop.shopLogoUrl);
  const name = shop.shopName ?? "Shop";
  return (
    <div className="relative size-24 shrink-0">
      <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-3xl font-black text-white ring-4 ring-white shadow-md">
        {logoUrl
          ? <Image src={logoUrl} alt={`Logo của ${name}`} fill unoptimized sizes="96px" className="object-cover" />
          : name.trim().charAt(0).toUpperCase()}
        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40" role="status" aria-label="Đang tải logo lên">
            <Loader2 className="size-6 animate-spin text-white" aria-hidden="true" />
          </span>
        )}
      </div>
      <label className="absolute -bottom-1 -right-1 flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-cta text-white shadow transition hover:brightness-110 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40">
        <Camera className="size-4" aria-hidden="true" />
        <span className="sr-only">Đổi logo shop</span>
        <input type="file" accept="image/*" className="sr-only" onChange={changeLogo} disabled={isUploading} />
      </label>
    </div>
  );
}

// Hồ sơ shop trong Kênh Người Bán: logo đổi được, thông tin shop và lối tắt; lỗi tải thì cho thử lại.
export function ShopProfileView({ shop }: { shop: SellerShopProfile | null }) {
  const router = useRouter();
  const quickLinks = [
    ...(shop ? [{ href: `/shops/${shop.shopId}`, label: "Xem trang shop", icon: ExternalLink }] : []),
    { href: "/shop/products", label: "Sản phẩm", icon: Package },
    { href: "/shop/orders", label: "Đơn hàng", icon: ShoppingBag },
    { href: "/user/profile", label: "Tài khoản cá nhân", icon: UserRound },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 pb-12">
      <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Hồ Sơ Shop</h1>

      {!shop ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-600">Không thể tải hồ sơ shop.</p>
          <button type="button" onClick={() => router.refresh()} className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary">
            <RefreshCw className="size-4" aria-hidden="true" /> Thử lại
          </button>
        </div>
      ) : (
        <>
          <section className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-amber-50/60" aria-label="Tổng quan shop">
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-cta/10 blur-2xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <ShopLogoPicker shop={shop} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-black tracking-tight text-slate-900">{shop.shopName ?? "Chưa đặt tên shop"}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500">
                  <Store className="size-4 text-cta" aria-hidden="true" /> Mã shop #{shop.shopId}
                </p>
              </div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-3">
            <ShopProfileInfoForm shop={shop} />

            <section className="rounded-2xl border border-slate-200/90 bg-white p-4" aria-labelledby="shop-links-title">
              <h2 id="shop-links-title" className="px-2 pb-2 text-sm font-bold text-slate-900">Lối tắt</h2>
              <ul className="space-y-1">
                {quickLinks.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-cta">
                      <Icon className="size-4 text-cta" aria-hidden="true" />
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
