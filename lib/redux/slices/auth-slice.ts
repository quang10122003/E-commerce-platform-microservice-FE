import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthenticatedUser } from "@/types/auth";

type AuthState = {
  user: AuthenticatedUser | null;
};

const initialState: AuthState = {
  user: null,
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
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
