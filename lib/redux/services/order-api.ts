import type { ApiResponse } from "@/types/shared/api";
import type { OrderCancelReason, OrderStatus } from "@/types/user/order";
import type { ProductReview, ProductReviewPage } from "@/types/user/review";
import { baseApi } from "./base-api";

type CancelOrderArgs = { orderId: number; reason: OrderCancelReason };

// API đơn hàng phía client đi qua BFF; danh sách đơn tải bằng Server Component nên chỉ cần mutation.
export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // BE trả 204; trang đơn tự refresh Server Component sau khi hủy.
    cancelOrder: builder.mutation<ApiResponse<null> | null, CancelOrderArgs>({
      query: ({ orderId, reason }) => ({ url: `/api/orders/${orderId}/cancel`, method: "POST", body: { reason } }),
    }),
    // Gửi đánh giá kèm ảnh dạng multipart qua BFF; không tự đặt Content-Type để trình duyệt thêm boundary.
    createReview: builder.mutation<ApiResponse<ProductReview>, FormData>({
      query: (formData) => ({ url: "/api/reviews", method: "POST", body: formData }),
    }),
    // Một trang đánh giá công khai của sản phẩm; rating để trống là mọi mức sao, tổng quan BE luôn tính trên toàn bộ.
    getProductReviews: builder.query<ApiResponse<ProductReviewPage>, { productId: number; page: number; rating?: number }>({
      query: ({ productId, page, rating }) => ({
        url: `/api/reviews/products/${productId}`,
        method: "GET",
        params: { page, size: 10, rating },
      }),
    }),
    // Shop chuyển đơn sang bước kế tiếp; BE tự chọn bước, FE chỉ gửi trạng thái đang thấy.
    advanceShopOrder: builder.mutation<ApiResponse<null> | null, { orderId: number; currentStatus: OrderStatus }>({
      query: ({ orderId, currentStatus }) => ({ url: `/api/orders/shop/${orderId}/advance`, method: "POST", body: { currentStatus } }),
    }),
    // Shop hủy đơn của shop mình; BE gửi mail báo người mua.
    cancelShopOrder: builder.mutation<ApiResponse<null> | null, CancelOrderArgs>({
      query: ({ orderId, reason }) => ({ url: `/api/orders/shop/${orderId}/cancel`, method: "POST", body: { reason } }),
    }),
  }),
});

export const { useCancelOrderMutation, useCancelShopOrderMutation, useAdvanceShopOrderMutation, useCreateReviewMutation, useGetProductReviewsQuery } = orderApi;
