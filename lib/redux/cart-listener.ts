import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { cartApi } from "./services/cart-api";
import { clearUser, setAuthChecked, setAuthChecking, setUser } from "./slices/auth-slice";
import { refreshCartItemCount, setItemCount } from "./slices/cart-slice";
import type { AppDispatch, RootState } from "./store";

// Mỗi store có listener riêng, không chia sẻ request hoặc phiên giữa các cây ứng dụng.
export function createCartListener() {
  const listener = createListenerMiddleware();
  const startListening = listener.startListening.withTypes<RootState, AppDispatch>();

  startListening({
    matcher: isAnyOf(setUser, setAuthChecked, setAuthChecking, clearUser, refreshCartItemCount),
    effect: async (_action, api) => {
      // Request mới hoặc thay đổi phiên sẽ hủy lượt đồng bộ cũ trước khi đọc count.
      api.cancelActiveListeners();
      const { user, isCheckingAuth } = api.getState().auth;
      if (!user || isCheckingAuth) return;

      const request = api.dispatch(cartApi.endpoints.getCartItemCount.initiate(undefined, { track: false }));
      const abortRequest = () => request.abort();
      api.signal.addEventListener("abort", abortRequest, { once: true });
      try {
        const response = await request.unwrap();
        const auth = api.getState().auth;
        // Không cho response của phiên cũ hoặc dữ liệu lỗi ghi lại badge sau khi logout.
        if (api.signal.aborted || auth.user !== user || auth.isCheckingAuth) return;
        if (response.success && Number.isSafeInteger(response.data) && response.data !== null && response.data >= 0) {
          api.dispatch(setItemCount(response.data));
        }
      } catch {
        // Lỗi count không biến thao tác thêm/xóa thành thất bại; 401 được baseApi xử lý.
      } finally {
        api.signal.removeEventListener("abort", abortRequest);
      }
    },
  });

  startListening({
    matcher: isAnyOf(cartApi.endpoints.addCartItem.matchPending, cartApi.endpoints.removeCartItem.matchPending),
    effect: async (action, api) => {
      if (!cartApi.endpoints.addCartItem.matchPending(action) && !cartApi.endpoints.removeCartItem.matchPending(action)) return;
      const user = api.getState().auth.user;
      if (!user) return;
      const requestId = action.meta.requestId;
      // Chờ đúng thao tác đã khởi chạy trong phiên này, kể cả khi component đã unmount.
      const completed = await api.take((nextAction) =>
        isAnyOf(
          cartApi.endpoints.addCartItem.matchFulfilled,
          cartApi.endpoints.addCartItem.matchRejected,
          cartApi.endpoints.removeCartItem.matchFulfilled,
          cartApi.endpoints.removeCartItem.matchRejected,
        )(nextAction) && nextAction.meta.requestId === requestId,
      );
      if (!completed || api.getState().auth.user !== user) return;
      const [result] = completed;
      const added = cartApi.endpoints.addCartItem.matchFulfilled(result) && (!result.payload || result.payload.success);
      if (added || cartApi.endpoints.removeCartItem.matchFulfilled(result)) {
        api.dispatch(refreshCartItemCount());
      }
    },
  });

  return listener;
}
