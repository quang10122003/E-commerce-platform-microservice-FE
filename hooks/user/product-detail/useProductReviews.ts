import { useState } from "react";
import { useGetProductReviewsQuery } from "@/lib/redux/services/order-api";

// Một trang đánh giá qua RTK Query; lỗi hoặc response không hợp lệ thì báo isError để UI ẩn.
export function useProductReviews(productId: number, page = 1, rating?: number) {
  const query = useGetProductReviewsQuery({ productId, page, rating });
  const data = query.data?.success ? query.data.data : null;

  return {
    summary: data?.summary ?? null,
    reviews: data?.reviews ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError || Boolean(query.data && !data),
  };
}

// Card đánh giá: tổng quan lấy từ trang 1 không lọc (dùng chung cache với đầu trang), danh sách theo trang và mức sao đang chọn.
export function useProductReviewSection(productId: number) {
  // Mức sao đang lọc; undefined nghĩa là tất cả.
  const [rating, setRating] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const overall = useProductReviews(productId);
  const list = useProductReviews(productId, page, rating);

  return {
    summary: overall.summary,
    isLoading: overall.isLoading,
    isError: overall.isError,
    rating,
    // Đổi mức sao thì quay về trang 1.
    changeRating: (next?: number) => {
      setRating(next);
      setPage(1);
    },
    page,
    setPage,
    reviews: list.reviews,
    isListLoading: list.isFetching,
    isListError: list.isError,
  };
}
