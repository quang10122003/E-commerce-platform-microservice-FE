// DTO lỗi dùng chung được backend trả về khi API thất bại.
export interface ApiErrorDto {
  code: string;
  message: string;
}

// Response chuẩn dùng chung cho mọi API từ backend.
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: ApiErrorDto | null;
  timestamp: string;
}

// Phân trang cursor dùng chung; cursor chỉ được truyền nguyên trạng về backend.
export interface ScrollResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
}

// Dữ liệu hoặc lỗi của từng trường được server service tải độc lập.
export type ResolvedFetchField<T> = {
  data: T | null;
  error: string | null;
};
