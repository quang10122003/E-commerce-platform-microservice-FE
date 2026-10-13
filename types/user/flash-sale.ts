// DTO danh mục từ CategoryController.
export type { CategoryResponse as FlashSaleCategory } from "@/types/shared/category";

// Một phân loại sản phẩm tham gia đợt sale hiện tại.
export interface UserFlashSaleItem {
  productId: number;
  variantId: number;
  shopId: number;
  productName: string;
  variantLabel: string;
  imageUrl: string | null;
  originalPrice: number;
  discountPercent: number;
  salePrice: number;
  registeredQuantity: number;
  remainingQuantity: number;
  availability: "AVAILABLE" | "OUT_OF_STOCK" | "SOLD_OUT";
}

// endsAt là null khi không có sản phẩm khớp bộ lọc.
export interface UserFlashSaleResponse {
  endsAt: string | null;
  items: UserFlashSaleItem[];
}

export type FlashSaleSort = "DEFAULT" | "PRICE_ASC" | "PRICE_DESC" | "DISCOUNT_DESC";

// Dữ liệu server tải song song cho trang Flash Sale, không chứa token.
export interface UserFlashSaleInitialData {
  categories: import("@/types/shared/category").CategoryResponse[];
  campaign: UserFlashSaleResponse | null;
  selectedSale: UserFlashSaleResponse | null;
  categoryId?: number;
  hasError: boolean;
  requiresLogin: boolean;
  serverNow: number;
}