// Dữ liệu form đánh giá một món trong đơn đã mua.
export interface CreateReviewForm {
  rating: number;
  content: string;
  images: File[];
}

// Đánh giá BE trả về sau khi tạo; createdAt có offset của BE.
export interface ProductReview {
  id: number;
  orderItemId: number;
  productId: number | null;
  rating: number;
  content: string | null;
  variantAttributes: string;
  imageUrls: string[];
  createdAt: string;
}

// Đánh giá công khai của một sản phẩm trên trang chi tiết; tên người mua lấy từ snapshot lúc đánh giá.
export interface ProductReviewItem {
  id: number;
  reviewerName: string;
  // Avatar hiện tại của người mua; null khi chưa có hoặc BE không lấy được.
  reviewerAvatarUrl: string | null;
  rating: number;
  content: string | null;
  variantAttributes: string;
  imageUrls: string[];
  createdAt: string;
}

export interface ProductReviewPage {
  summary: {
    ratingAverage: number;
    reviewCount: number;
    // Xếp từ 5 sao xuống 1 sao, luôn đủ 5 mức.
    ratingCounts: Array<{ rating: number; count: number }>;
  };
  // Trang đánh giá mới nhất, page đánh số từ 1.
  reviews: { items: ProductReviewItem[]; page: number; pageSize: number; totalItems: number; totalPages: number };
}
