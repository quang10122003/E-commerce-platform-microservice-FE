"use client";

import type { ReactNode } from "react";

import { useAuthInitializer } from "@/hooks/useAuthInitializer";

type AuthInitializerProps = {
  children: ReactNode;
};

// Khởi chạy đồng bộ phiên đăng nhập trước khi render cây ứng dụng.
export function AuthInitializer({ children }: AuthInitializerProps) {
  useAuthInitializer();

  return children;
}
