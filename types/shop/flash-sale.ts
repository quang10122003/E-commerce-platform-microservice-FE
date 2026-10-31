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

export interface ShopCompletedFlashSaleCampaign {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
}

export interface ShopCompletedFlashSalePage {
  items: ShopCompletedFlashSaleCampaign[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ShopCompletedFlashSaleQuery {
  page: number;
  from?: string;
  to?: string;
  keyword?: string;
  quickFilter?: string;
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

// Phân loại đã đăng ký; trạng thái gỡ sản phẩm độc lập với trạng thái đăng ký.
export interface ShopFlashSaleItem {
  itemId: number;
  // API preview cần ID phân loại, không dùng itemId của lượt đăng ký thay thế.
  variantId: number | null;
  productName: string;
  options: { name: string; value: string }[];
  registeredQuantity: number;
  sold_quality: number;
  stockQuantity: number | null;
  status: "REGISTERED" | "DISABLED";
  discountPercent?: number | null;
  salePrice?: number | null;
  variantDeleted: boolean;
}

// Tham số tải danh sách phân loại của chương trình Flash Sale.
export interface ShopFlashSaleItemsQuery {
  campaignId: string;
  keyword?: string;
}

// Xác định đúng lượt đăng ký cần xóa trong chương trình nháp.
export interface RemoveShopFlashSaleItemParams {
  campaignId: string;
  itemId: number;
}

// Null giữ nguyên mức giảm; số lượng luôn gửi đầy đủ theo DTO cập nhật của BE.
export interface UpdateShopFlashSaleItemRequest {
  registeredQuantity: number;
  discountPercent: number | null;
}

export interface UpdateShopFlashSaleItemParams extends RemoveShopFlashSaleItemParams {
  request: UpdateShopFlashSaleItemRequest;
}
