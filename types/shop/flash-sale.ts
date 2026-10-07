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
