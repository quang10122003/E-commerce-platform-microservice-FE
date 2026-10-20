import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Chỉ lưu phiên bản thay đổi theo người xem; dữ liệu hộp thư vẫn do server cung cấp.
const chatInboxSlice = createSlice({
  name: "chatInbox",
  initialState: {} as Record<number, number>,
  reducers: {
    invalidateChatInbox: (state, action: PayloadAction<number>) => {
      state[action.payload] = (state[action.payload] ?? 0) + 1;
    },
  },
});

export const { invalidateChatInbox } = chatInboxSlice.actions;
export default chatInboxSlice.reducer;
