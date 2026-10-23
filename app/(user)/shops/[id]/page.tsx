import { ShopStorefrontHeader } from "@/components/user/shop/ShopStorefrontHeader";
import { ShopStorefrontCatalog, ShopStorefrontFeatured } from "@/components/user/shop/ShopStorefrontCatalog";
import { getCategories } from "@/lib/service/categoryService";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import type { CategoryResponse } from "@/types/shared/category";
import { notFound } from "next/navigation";
import { getShopOverview, getShopProducts } from "@/lib/service/shopService";
import { ShopStorefrontAbout } from "@/components/user/shop/ShopStorefrontAbout";
import { getShopStorefrontTab, parseShopProductQuery } from "@/utils/shop-products.utils";

export const metadata = { title: "SmartX Official Store | Gian hàng" };

// Panel ẩn không chiếm chiều cao hoặc nhận focus; panel được chọn trượt nhẹ vào cùng vị trí.
const panelClass = "invisible col-start-1 row-start-1 grid min-w-0 self-start grid-rows-[0fr] translate-x-6 opacity-0 transition-[grid-template-rows,translate,opacity,visibility] duration-300 ease-out motion-reduce:translate-x-0 motion-reduce:transition-none";

// Tải độc lập thông tin shop và danh mục; lỗi từng nguồn chỉ ẩn block tương ứng.
export default async function ShopStorefrontPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, filters] = await Promise.all([params, searchParams]);
  const shopId = Number(id);
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(shopId) || shopId <= 0) notFound();

  const query = parseShopProductQuery(filters);
  const initialTab = getShopStorefrontTab(filters.tab, !!filters.keyword || !!filters.categoryId || !!filters.sort || !!filters.page);
  const [categoriesResult, shopResult, productsResult] = await Promise.allSettled([
    getCategories(), getShopOverview(shopId), getShopProducts(shopId, query),
  ]);
  for (const result of [categoriesResult, shopResult, productsResult]) {
    if (result.status === "rejected") rethrowSessionRefreshRequired(result.reason);
  }
  const categories: CategoryResponse[] = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const shop = shopResult.status === "fulfilled" ? shopResult.value : null;

  return (
    <div id="shop-home" className="group/shop min-w-0 space-y-5 sm:space-y-6">
      {/* Hồ sơ shop và điều hướng gian hàng. */}
      <ShopStorefrontHeader shop={shop} initialTab={initialTab} />

      {/* Các panel dùng chung một vị trí, không điều hướng bằng anchor xuống trang. */}
      <div className="grid min-w-0 overflow-hidden">
        <div id="shop-panel-home" aria-label="Trang chủ shop" className={`${panelClass} group-has-[#shop-tab-home:checked]/shop:visible group-has-[#shop-tab-home:checked]/shop:grid-rows-[1fr] group-has-[#shop-tab-home:checked]/shop:translate-x-0 group-has-[#shop-tab-home:checked]/shop:opacity-100`}>
          <div className="min-h-0 overflow-hidden"><ShopStorefrontFeatured /></div>
        </div>
        <div id="shop-panel-products" aria-label="Tất cả sản phẩm" className={`${panelClass} group-has-[#shop-tab-products:checked]/shop:visible group-has-[#shop-tab-products:checked]/shop:grid-rows-[1fr] group-has-[#shop-tab-products:checked]/shop:translate-x-0 group-has-[#shop-tab-products:checked]/shop:opacity-100`}>
          <div className="min-h-0 overflow-hidden"><ShopStorefrontCatalog categories={categories} shopId={shopId} query={query} data={productsResult.status === "fulfilled" ? productsResult.value : null} /></div>
        </div>

        {/* Giới thiệu dùng lại dữ liệu overview đã tải trên server. */}
        <div id="shop-panel-about" aria-label="Giới thiệu" className={`${panelClass} group-has-[#shop-tab-about:checked]/shop:visible group-has-[#shop-tab-about:checked]/shop:grid-rows-[1fr] group-has-[#shop-tab-about:checked]/shop:translate-x-0 group-has-[#shop-tab-about:checked]/shop:opacity-100`}>
          <div className="min-h-0 overflow-hidden">
            <ShopStorefrontAbout shop={shop} />
          </div>
        </div>
      </div>
    </div>
  );
}
