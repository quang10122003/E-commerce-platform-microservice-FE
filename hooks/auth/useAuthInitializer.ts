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
export function useAuthInitializer(hasAuthTokens: boolean) {
  const dispatch = useAppDispatch();
  const { data, isError, isFetching, isLoading } = useCheckTokenQuery(undefined, {
    // Bỏ qua kiểm tra API khi server xác nhận không có token nào trong cookie.
    skip: !hasAuthTokens,
    refetchOnMountOrArgChange: true,
  });

  // Hiển thị trạng thái đang kiểm tra trong thời gian request xác thực còn chạy.
  useEffect(() => {
    if (isLoading || isFetching) {
      dispatch(setAuthChecking());
      return;
    }

    // Cập nhật user khi access token hợp lệ hoặc xóa state khi response lỗi.
    if (!isError && data) {
      if (data.success && data.data) {
        dispatch(setUser({
          userId: data.data.userId,
          email: data.data.email,
          fullName: data.data.fullName,
          role: data.data.role,
        }));
      } else {
        dispatch(clearUser());
      }
    }

    // Chỉ mở đồng bộ count sau khi kết quả kiểm tra phiên đã được đưa vào Redux.
    dispatch(setAuthChecked());
  }, [data, dispatch, isError, isFetching, isLoading]);
}
