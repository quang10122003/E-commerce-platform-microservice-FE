"use client";

import Link from "next/link";
import { CloudOff, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailUnavailableViewProps {
  kind: "not-found" | "error";
  onRetry: () => void;
}

// Thay toàn bộ nội dung sản phẩm bằng trạng thái 404 hoặc lỗi tải dữ liệu, không dùng mock.
export function ProductDetailUnavailableView({ kind, onRetry }: ProductDetailUnavailableViewProps) {
  const notFound = kind === "not-found";
  const Icon = notFound ? PackageX : CloudOff;

  return (
    <section role={notFound ? "status" : "alert"} className="flex min-h-dvh w-full flex-col items-center justify-center px-6 py-12 text-center">
      {/* Icon riêng giúp phân biệt sản phẩm đã gỡ với lỗi kết nối tạm thời. */}
      <div className="mb-6 rounded-xl bg-surface-subtle p-5 text-muted-foreground">
        <Icon className="h-14 w-14" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h1 className="text-xl font-bold text-main sm:text-2xl">
        {notFound ? "Sản phẩm này không còn tồn tại" : "Không thể tải thông tin sản phẩm"}
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        {notFound
          ? "Sản phẩm có thể đã được gỡ hoặc đường dẫn không còn hợp lệ. Bạn hãy khám phá các sản phẩm khác nhé."
          : "Có lỗi xảy ra khi tải dữ liệu. Vui lòng kiểm tra kết nối hoặc thử lại sau."}
      </p>
      {/* Có thể tìm sản phẩm khác; lỗi tạm thời cho phép gọi lại API ngay tại trang. */}
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        {!notFound && <Button type="button" variant="primary" onClick={onRetry} className="rounded-lg shadow-none hover:shadow-none">Thử lại</Button>}
        <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-lg border border-surface-border px-5 text-sm font-semibold text-primary transition-colors hover:border-primary hover:bg-primary-light">
          Tìm sản phẩm khác
        </Link>
      </div>
    </section>
  );
}