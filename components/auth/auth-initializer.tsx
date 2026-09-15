"use client";

import type { ReactNode } from "react";

import { useAuthInitializer } from "@/hooks/useAuthInitializer";

type AuthInitializerProps = {
  children: ReactNode;
  hasAuthTokens: boolean;
};

// Khởi chạy đồng bộ phiên đăng nhập trước khi render cây ứng dụng.
export function AuthInitializer({ children, hasAuthTokens }: AuthInitializerProps) {
  useAuthInitializer(hasAuthTokens);

  return children;
}
