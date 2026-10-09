import { History } from "lucide-react";

export default function ShopFlashSaleHistoryPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <header>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-main sm:text-3xl">Lịch sử Flash Sale</h1>
          <p className="mt-1 text-sm text-slate-600">Theo dõi các sản phẩm bạn đã đăng ký tham gia chương trình.</p>
        </div>
      </header>

      <section aria-labelledby="flash-sale-history-empty-title" className="flex min-h-72 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-10 sm:px-8">
        <div className="max-w-md text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-indigo-50 text-primary">
            <History className="size-5" aria-hidden="true" />
          </div>
          <h2 id="flash-sale-history-empty-title" className="mt-4 text-lg font-semibold text-main">Lịch sử đăng ký chưa khả dụng</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Các sản phẩm tham gia Flash Sale hiện chưa được lưu để hiển thị tại đây.
          </p>
        </div>
      </section>
    </div>
  );
}
