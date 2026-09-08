"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/lib/redux/hooks";
import { useCheckTokenQuery } from "@/lib/redux/services/auth-api";
import {
  clearUser,
  setAuthChecked,
  setAuthChecking,
  setUser,
} from "@/lib/redux/slices/auth-slice";

// Kiểm tra phiên đăng nhập và đồng bộ thông tin user vào Redux khi app khởi tạo.
export function useAuthInitializer() {
  const dispatch = useAppDispatch();
  const { data, isError, isFetching, isLoading } = useCheckTokenQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  // Hiển thị trạng thái đang kiểm tra trong thời gian request xác thực còn chạy.
  useEffect(() => {
    if (isLoading || isFetching) {
      dispatch(setAuthChecking());
      return;
    }

    dispatch(setAuthChecked());
  }, [dispatch, isFetching, isLoading]);

  // Cập nhật user khi access token hợp lệ hoặc xóa state khi response lỗi.
  useEffect(() => {
    if (isError) return;
    if (!data?.success || !data.data) {
      if (data) dispatch(clearUser());
      return;
    }

    dispatch(
      setUser({
        userId: data.data.userId,
        email: data.data.email,
        fullName: data.data.fullName,
        role: data.data.role,
      })
    );
  }, [data, dispatch, isError]);
}
