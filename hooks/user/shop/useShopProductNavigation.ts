"use client";

import { useTransition, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

// Đưa thao tác lọc và phân trang vào transition để skeleton theo đúng thời gian request server.
export function useShopProductNavigation(href: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Giữ hành vi mở tab mới và chỉ chặn điều hướng trái chuột thông thường.
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.currentTarget.target && event.currentTarget.target !== "_self") return;
    event.preventDefault();
    startTransition(() => router.push(href, { scroll: false }));
  }

  return { isPending, handleClick };
}
