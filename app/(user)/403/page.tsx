import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "403 — Không có quyền truy cập",
  robots: { index: false, follow: false },
};

// Thông báo tài khoản chưa có quyền truy cập kênh quản lý người bán.
export default function ForbiddenPage() {
  return (
    <section aria-labelledby="forbidden-title" className="flex min-h-[60vh] items-center justify-center py-8 sm:py-12">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-xl border border-surface-border bg-surface-card md:grid-cols-[0.8fr_1.2fr]">
        {/* Mã lỗi và biểu tượng giúp phân biệt lỗi phân quyền với trang không tồn tại. */}
        <div className="flex flex-col items-center justify-center gap-5 border-b border-surface-border bg-primary-light px-6 py-10 md:border-r md:border-b-0 md:py-16">
          <ShieldX aria-hidden="true" className="size-12 text-primary sm:size-16" strokeWidth={1.5} />
          <p className="font-mono text-8xl font-bold leading-none tracking-tight text-primary sm:text-9xl">403</p>
          <p className="text-sm font-medium text-primary">Truy cập bị từ chối</p>
        </div>

        {/* Giải thích quyền cần có và cung cấp lối quay về mua sắm. */}
        <div className="flex flex-col justify-center px-6 py-8 sm:p-10">
          <h1 id="forbidden-title" className="text-2xl font-bold leading-tight text-main sm:text-3xl">
            Bạn không có quyền truy cập
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            Khu vực này chỉ dành cho tài khoản có quyền người bán.
            Tài khoản hiện tại của bạn chưa được cấp quyền truy cập.
          </p>
          <div className="mt-7">
            <Link href="/" className={buttonVariants({ variant: "gradient-primary", className: "w-full rounded-lg shadow-none hover:shadow-none sm:w-auto" })}>
              <ArrowLeft aria-hidden="true" className="size-4" />
              Về trang chủ
            </Link>
          </div>
          <p className="mt-7 border-t border-surface-border pt-5 text-xs leading-6 text-muted-foreground">
            Nếu bạn cho rằng đây là nhầm lẫn, hãy liên hệ quản trị viên để được kiểm tra quyền tài khoản.
          </p>
        </div>
      </div>
    </section>
  );
}
