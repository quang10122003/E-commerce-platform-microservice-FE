"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useRouter } from "next/navigation";
import { SUGGESTIONS_INITIAL_COUNT } from "@/lib/constants";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useGetProductRecommendationsQuery,
  useGetTopSellingProductsQuery,
} from "@/lib/redux/services/product-api";

// Chờ xác định phiên trước khi chọn nguồn dữ liệu, tách cache gợi ý theo tài khoản.
export function usePersonalizedSuggestions() {
  const router = useRouter();
  const { user, isCheckingAuth } = useAppSelector((state) => state.auth);
  const recommendations = useGetProductRecommendationsQuery(
    !isCheckingAuth && user
      ? { userId: user.userId, size: SUGGESTIONS_INITIAL_COUNT }
      : skipToken,
  );
  const topSelling = useGetTopSellingProductsQuery(undefined, {
    skip: isCheckingAuth || Boolean(user),
  });
  const query = user ? recommendations : topSelling;
  const products = isCheckingAuth ? [] : user
    ? recommendations.currentData?.data?.items ?? []
    : topSelling.currentData?.data?.slice(0, SUGGESTIONS_INITIAL_COUNT) ?? [];

  // Dùng flow đăng nhập theo route hiện có để quay về trang gợi ý sau xác thực.
  const handleViewMore = () => {
    router.push(user ? "/recommendations" : "/?login=required&next=%2Frecommendations", { scroll: Boolean(user) });
  };

  return {
    products,
    isLoading: isCheckingAuth || query.isLoading || (query.isFetching && products.length === 0),
    isError: !isCheckingAuth && query.isError,
    handleViewMore,
  };
}
