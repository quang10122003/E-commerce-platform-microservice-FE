import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/auth-slice";
import { baseApi } from "./services/base-api";

// Store trung tâm để quản lý state Redux và cache của RTK Query.
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
