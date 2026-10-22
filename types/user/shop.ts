// Tổng quan shop công khai; productCount chỉ đếm sản phẩm ACTIVE, không đếm variant.
export interface ShopOverviewResponse {
  shopId: number;
  shopName: string | null;
  shopLogoUrl: string | null;
  shopDescription: string | null;
  productCount: number;
}
