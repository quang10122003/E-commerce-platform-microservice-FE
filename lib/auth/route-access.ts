// Phân biệt kênh quản lý /shop với trang shop công khai /shops.
export function getRouteAccess(pathname: string): "public" | "authenticated" | "shop" {
  if (pathname === "/shop" || pathname.startsWith("/shop/")) return "shop";
  if (pathname === "/cart" || pathname.startsWith("/cart/")) return "authenticated";
  if (pathname === "/checkout" || pathname.startsWith("/checkout/")) return "authenticated";
  if (pathname === "/recommendations" || pathname.startsWith("/recommendations/")) return "authenticated";
  return "public";
}
