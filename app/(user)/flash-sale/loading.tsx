import { Loading } from "@/components/ui/loading";

// Giữ vùng loading cao ổn định trong lúc server tải dữ liệu ban đầu.
export default function FlashSaleLoading() {
  return <Loading label="Đang tải ưu đãi Flash Sale…" className="min-h-dvh" />;
}
