import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hook kiểm tra component đã mount trên client chưa.
 * Sử dụng useSyncExternalStore để tránh lỗi "setState inside effect"
 * trên React 19 — không gây cascading render.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // client snapshot
    () => false  // server snapshot
  );
}

