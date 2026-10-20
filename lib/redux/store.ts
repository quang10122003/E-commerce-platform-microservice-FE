import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth-slice";
import cartReducer from "./slices/cart-slice";
import chatInboxReducer from "./slices/chat-inbox-slice";
import { createCartListener } from "./cart-listener";
import { baseApi } from "./services/base-api";

// Store trung tâm để quản lý state Redux và cache của RTK Query.
export const makeStore = () => {
  const cartListener = createCartListener();
  return configureStore({
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      chatInbox: chatInboxReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(cartListener.middleware).concat(baseApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
