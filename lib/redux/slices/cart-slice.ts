import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { clearUser, setUser } from "./auth-slice";

// State chỉ lưu số dòng sản phẩm, không cộng quantity hoặc persist trên trình duyệt.
const initialState = { itemCount: 0 };

// Yêu cầu đồng bộ số item từ BE sau khi giỏ hàng thay đổi.
export const refreshCartItemCount = createAction("cart/refreshItemCount");

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Cập nhật số dòng hàng đã được BE xác nhận.
    setItemCount: (state, action: PayloadAction<number>) => {
      state.itemCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Xóa số cũ khi kết thúc phiên hoặc nhận thông tin phiên đăng nhập mới.
    builder.addCase(clearUser, () => initialState);
    builder.addCase(setUser, () => initialState);
  },
});

export const { setItemCount } = cartSlice.actions;
export default cartSlice.reducer;
