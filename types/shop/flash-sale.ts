import type { SellerProductItem } from "@/types/shop/product";

// Chương trình dành cho shop, thời gian ISO có offset từ API.
export interface ShopFlashSaleCampaign {
  id: number;
  name: string;
  registrationDeadline: string;
  startsAt: string;
  endsAt: string;
  registrationOpen: boolean;
}

// Trang kết quả và điều kiện lọc được đồng bộ với URL.
export interface ShopFlashSalePage {
  items: ShopFlashSaleCampaign[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
export interface ShopFlashSaleQuery {
  page: number;
  from?: string;
  to?: string;
  registrationOpen?: boolean;
}

// Hợp đồng API chọn sản phẩm Flash Sale, không chứa ảnh và metadata phân trang.
export type ShopFlashSaleProduct = Pick<SellerProductItem,
  "id" | "name" | "categoryName" | "status" | "variants">;

// Giá trị của biểu mẫu; nhãn tìm kiếm không thuộc payload đăng ký gửi backend.
export interface FlashSaleRegistrationFields {
  productName: string;
  variantId: string;
  discountPercent: number;
  registeredQuantity: number;
}

// Body và dữ liệu trả về của API tính giá sale dự kiến.
export interface PreviewFlashSalePriceRequest { discountPercent: number; }
export interface FlashSalePriceResponse { salePrice: number; }
export interface PreviewFlashSalePriceParams extends PreviewFlashSalePriceRequest { variantId: number; }

// Chi tiết chương trình dành cho form; deadline là ISO datetime có offset.
export interface ShopFlashSaleCampaignDetail {
  name: string;
  registrationDeadline: string;
}

// Body đăng ký variant; backend tự tính giá và xác định Shop từ phiên đăng nhập.
export interface RegisterFlashSaleItemRequest {
  variantId: number;
  discountPercent: number;
  registeredQuantity: number;
}

// Mã chương trình nằm trên URL, không gửi trong body.
export interface RegisterFlashSaleItemParams {
  campaignId: string;
  request: RegisterFlashSaleItemRequest;
}
