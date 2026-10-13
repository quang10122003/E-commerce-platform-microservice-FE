"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { useSessionRecovery } from "@/hooks/auth/useSessionRecovery";

type SessionRecoveryViewProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

// Boundary dùng chung cho mọi trang server, không hiển thị chi tiết lỗi nội bộ.
export function SessionRecoveryView({ error, retry }: SessionRecoveryViewProps) {
  const recovery = useSessionRecovery(error, retry);
  if (recovery.status === "recovering") {
    return <Loading label="Đang khôi phục phiên…" className="min-h-dvh border-0 bg-surface-bg shadow-none" />;
  }
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-5 text-center">
      {/* Lỗi xác thực cần đăng nhập; lỗi hạ tầng vẫn cho thử lại mà không logout. */}
      <h2 className="font-heading text-lg font-semibold text-main">{recovery.status === "login" ? "Phiên đăng nhập đã hết hạn" : "Chưa thể tải dữ liệu"}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{recovery.status === "login" ? "Vui lòng đăng nhập lại để tiếp tục." : "Vui lòng thử lại sau ít phút."}</p>
      <Button onClick={recovery.status === "login" ? recovery.openLogin : recovery.retry}>{recovery.status === "login" ? "Đăng nhập" : "Thử lại"}</Button>
      <AuthModal isOpen={recovery.isLoginOpen} onClose={recovery.closeLogin} initialTab="login" />
    </div>
  );
}
