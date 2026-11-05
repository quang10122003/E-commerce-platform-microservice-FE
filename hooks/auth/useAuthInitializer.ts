import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useAppDispatch } from "@/lib/redux/hooks";
import { authApi, useCheckTokenQuery } from "@/lib/redux/services/auth-api";
import {
  clearUser,
  setAuthChecked,
  setAuthChecking,
  setUser,
} from "@/lib/redux/slices/auth-slice";

// Kiểm tra phiên đăng nhập và đồng bộ thông tin user vào Redux khi app khởi tạo.
export function useAuthInitializer(hasAuthTokens: boolean) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { data, isError, isFetching, isLoading } = useCheckTokenQuery(undefined, {
    // Bỏ qua kiểm tra API khi server xác nhận không có token nào trong cookie.
    skip: !hasAuthTokens,
    refetchOnMountOrArgChange: true,
  });

  // Cookie đã bị xóa ở server thì không giữ user và cache của phiên trước trong layout.
  useEffect(() => {
    if (hasAuthTokens) return;
    dispatch(clearUser());
    dispatch(authApi.util.resetApiState());
    dispatch(setAuthChecked());
  }, [dispatch, hasAuthTokens]);

  // Layout được giữ khi server redirect; kiểm tra phiên mới thay vì tin kết quả cache cũ.
  useEffect(() => {
    if (pathname !== "/403") return;
    void dispatch(authApi.endpoints.checkToken.initiate(undefined, {
      forceRefetch: true,
      subscribe: false,
    }));
  }, [dispatch, pathname]);

  // Hiển thị trạng thái đang kiểm tra trong thời gian request xác thực còn chạy.
  useEffect(() => {
    // Query bị skip vẫn có thể giữ data cũ, không dùng nó để khôi phục user đã bị xóa.
    if (!hasAuthTokens) return;
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
  }, [data, dispatch, hasAuthTokens, isError, isFetching, isLoading]);
}
