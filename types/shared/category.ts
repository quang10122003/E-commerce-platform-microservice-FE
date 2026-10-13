// DTO danh mục từ CategoryController, dùng chung cho các trang người dùng.
export interface CategoryResponse {
  id: number;
  name: string;
  imageUrl: string | null;
}
