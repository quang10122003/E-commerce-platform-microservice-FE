"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";

import { makeStore, type AppStore } from "./store";

type ReduxProviderProps = {
  children: ReactNode;
};

// Khởi tạo một store ổn định cho toàn bộ cây component phía client.
export function ReduxProvider({ children }: ReduxProviderProps) {
  // State lưu store ổn định trong suốt vòng đời provider phía client.
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
