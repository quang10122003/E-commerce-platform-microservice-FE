import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthenticatedUser } from "@/types/auth";

type AuthState = {
  user: AuthenticatedUser | null;
  isCheckingAuth: boolean;
};

const initialState: AuthState = {
  user: null,
  isCheckingAuth: true,
};

// Slice lưu thông tin user hiển thị trên giao diện sau khi đăng nhập.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Cập nhật thông tin user sau khi login thành công.
    setUser: (state, action: PayloadAction<AuthenticatedUser>) => {
      state.user = action.payload;
    },
    // Xóa thông tin user khỏi Redux khi đăng xuất.
    clearUser: (state) => {
      state.user = null;
    },
    // Đánh dấu app đang kiểm tra phiên đăng nhập hiện tại.
    setAuthChecking: (state) => {
      state.isCheckingAuth = true;
    },
    // Đánh dấu hoàn tất kiểm tra phiên đăng nhập.
    setAuthChecked: (state) => {
      state.isCheckingAuth = false;
    },
  },
});

export const { setUser, clearUser, setAuthChecking, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
