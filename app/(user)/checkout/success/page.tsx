import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleX } from "lucide-react";
import { CheckoutOrderSuccessView } from "@/components/user/checkout/CheckoutOrderSuccessView";

export const metadata: Metadata = {
  title: "Đặt Hàng Thành Công | ModernShop",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

// COD đến từ checkout với orderIds; VNPay đến từ return URL kèm tham số vnp_*.
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const responseCode = first(params.vnp_ResponseCode);

  if (responseCode !== undefined) {
    // Return URL chỉ để hiển thị; trạng thái thanh toán thật do IPN cập nhật ở backend.
    if (responseCode === "00" && first(params.vnp_TransactionStatus) === "00") {
      return <CheckoutSuccessLayout><CheckoutOrderSuccessView orderIds={[]} /></CheckoutSuccessLayout>;
    }
    return (
      <CheckoutSuccessLayout>
        <section role="alert" className="w-full max-w-lg space-y-4 rounded-xl border border-surface-border bg-surface-card p-6 text-center sm:p-8">
          <CircleX className="mx-auto h-12 w-12 text-danger" aria-hidden="true" />
          <h1 className="text-xl font-bold">Thanh toán chưa hoàn tất</h1>
          <p className="text-sm leading-6 text-muted-foreground">Giao dịch VNPay bị hủy hoặc không thành công. Bạn có thể thanh toán lại trong danh sách đơn hàng.</p>
          <Link href="/user/orders" replace className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Xem đơn hàng</Link>
        </section>
      </CheckoutSuccessLayout>
    );
  }

  const orderIds = (first(params.orderIds) ?? "").split(",").map(Number).filter((id) => Number.isSafeInteger(id) && id > 0);
  if (!orderIds.length) redirect("/");
  return <CheckoutSuccessLayout><CheckoutOrderSuccessView orderIds={orderIds} /></CheckoutSuccessLayout>;
}

function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-[calc(100svh-10rem)] items-center justify-center p-4">{children}</div>;
}
