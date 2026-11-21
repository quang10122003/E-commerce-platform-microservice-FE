export type ShopRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface ShopRequest {
  id: number;
  shopName: string;
  shopDescription: string | null;
  shopPhone: string;
  provinceCode: number;
  provinceName: string;
  ward: string;
  addressDetail: string;
  status: ShopRequestStatus;
  rejectReason: string | null;
  createdAt: string;
  reviewedAt: string | null;
}

export interface CreateShopRequestForm {
  shopName: string;
  shopDescription: string;
  shopPhone: string;
  provinceName: string;
  ward: string;
  addressDetail: string;
}

export interface CreateShopRequestRequest extends Omit<CreateShopRequestForm, "shopDescription"> {
  shopDescription: string | null;
  provinceCode: number;
}
