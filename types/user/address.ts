export interface UserAddress {
  id: number;
  recipientName: string;
  province: string;
  ward: string;
  detail: string;
  phone: string;
  defaultAddress: boolean;
}

export interface CreateAddressRequest {
  recipientName: string;
  province: string;
  ward: string;
  detail: string;
  phone: string;
}
