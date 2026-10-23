import Image from "next/image";
import { ArrowRight, BadgeCheck, RotateCcw, TicketPercent, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

// Banner trưng bày sản phẩm và các cam kết minh họa của gian hàng.
export function ShopStorefrontBanner() {
  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-card">
      <div className="relative isolate grid overflow-hidden bg-slate-950 md:min-h-72 md:grid-cols-2">
        {/* Nội dung chiến dịch giữ cùng ngôn ngữ thương mại với các trang user. */}
        <div className="relative z-10 px-6 py-9 text-white sm:px-10 sm:py-12">
          <h2 className="max-w-md font-heading text-3xl font-bold leading-tight sm:text-4xl">Nâng cấp góc riêng.<br />Khơi nguồn cảm hứng.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">Thiết bị bạn yêu thích, trải nghiệm bạn xứng đáng. Khám phá những lựa chọn công nghệ từ SmartX.</p>
          <a href="#shop-products" className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Khám phá ngay<ArrowRight className="size-4" /></a>
        </div>
        <div className="relative min-h-52 md:min-h-full">
          <Image src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=85" alt="Góc làm việc với màn hình, tai nghe và thiết bị công nghệ" fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent md:bg-linear-to-r md:from-slate-950 md:via-slate-950/10" />
        </div>
      </div>
      {/* Dải cam kết mua sắm dưới banner. */}
      <div className="grid grid-cols-1 divide-y divide-surface-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          { icon: BadgeCheck, title: "An tâm chính hãng", text: "Nguồn gốc rõ ràng, bảo hành đầy đủ" },
          { icon: Truck, title: "Giao hàng toàn quốc", text: "Đóng gói cẩn thận, nhận hàng an tâm" },
          { icon: RotateCcw, title: "Hỗ trợ đổi trả", text: "Đồng hành cùng bạn sau mua hàng" },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 px-5 py-4 sm:justify-center">
            <Icon className="size-6 shrink-0 text-primary" strokeWidth={1.5} />
            <div><p className="text-sm font-semibold text-main">{title}</p><p className="mt-0.5 text-xs text-muted-foreground">{text}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Voucher chỉ minh họa; thao tác lưu bị khóa đến khi tích hợp chức năng thật.
export function ShopStorefrontVouchers() {
  return (
    <section id="shop-vouchers" className="scroll-mt-28 rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5">
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-main"><TicketPercent className="size-5 text-cta" />Ưu đãi dành riêng cho bạn</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {[
          { discount: "Giảm 30.000đ", condition: "Đơn tối thiểu 299.000đ", code: "SMARTX30" },
          { discount: "Giảm 10%", condition: "Tối đa 100.000đ · Đơn từ 599.000đ", code: "SMARTX10" },
          { discount: "Giảm 200.000đ", condition: "Đơn tối thiểu 2.000.000đ", code: "SMARTX200" },
        ].map(({ discount, condition, code }) => (
          <div key={code} className="flex min-w-0 items-center gap-3 rounded-lg border border-cta/20 bg-linear-to-r from-cta-light to-surface-card p-4">
            <div className="min-w-0 flex-1"><p className="text-lg font-bold text-cta">{discount}</p><p className="mt-1 text-xs text-muted-foreground">{condition}</p><p className="mt-2 text-[11px] font-medium text-cta">{code}</p></div>
            <Button variant="cta-outline" size="sm" disabled title="Voucher mẫu, chưa hỗ trợ lưu">Lưu</Button>
          </div>
        ))}
      </div>
    </section>
  );
}
