import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

// Component hiển thị avatar khách hàng đại diện bằng icon vector sắc nét trên nền gradient Indigo.
export function ChatCustomerAvatarView({ className = "size-10" }: { className?: string }) {
  return (
    // Khung tròn đại diện khách hàng với viền mảnh và màu sắc nhận diện thương hiệu
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border border-indigo-200/70 bg-gradient-to-br from-indigo-50 to-indigo-100/80 text-primary shadow-2xs transition-transform duration-200",
        className
      )}
    >
      <UserRound className="size-1/2" />
    </span>
  );
}
