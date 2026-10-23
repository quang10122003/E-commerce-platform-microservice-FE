import type { ReactNode } from "react";
import { Filter, X } from "lucide-react";

// Popover native đưa drawer lên top layer, hỗ trợ Escape và bấm ngoài mà không cần thêm hook.
export function ShopStorefrontFilterDrawer({ children }: { children: ReactNode }) {
  return (
    <div className="lg:hidden">
      <button type="button" popoverTarget="shop-filter-drawer" aria-label="Mở bộ lọc sản phẩm shop" className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-surface-border bg-surface-card text-cta transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-primary active:scale-95">
        <Filter className="size-4" />
      </button>

      {/* Cùng chiều trượt và kích thước với drawer tìm kiếm của user. */}
      <div id="shop-filter-drawer" popover="auto" role="dialog" aria-labelledby="shop-filter-title" className="group/drawer fixed inset-0 m-0 h-[calc(100dvh/var(--page-zoom))] max-h-none w-[calc(100vw/var(--page-zoom))] max-w-none border-0 bg-transparent p-0 text-main opacity-0 transition-[opacity,display,overlay] transition-discrete duration-300 [&:popover-open]:opacity-100 starting:[&:popover-open]:opacity-0 motion-reduce:transition-none lg:hidden">
        {/* Nền phủ nhận thao tác đóng, tránh click xuyên vào sản phẩm phía sau. */}
        <button type="button" popoverTarget="shop-filter-drawer" popoverTargetAction="hide" aria-label="Đóng bộ lọc bằng nền phủ" tabIndex={-1} className="absolute inset-0 size-full cursor-default bg-black/60 backdrop-blur-xs" />
        <div className="absolute inset-y-0 right-0 flex h-full w-80 max-w-[88vw] translate-x-full flex-col bg-surface-card shadow-2xl transition-transform duration-300 ease-out group-[:popover-open]/drawer:translate-x-0 starting:group-[:popover-open]/drawer:translate-x-full motion-reduce:transition-none">
          <header className="flex shrink-0 items-center justify-between border-b border-surface-border p-4">
            <h2 id="shop-filter-title" className="flex items-center gap-2 text-sm font-bold"><Filter className="size-4 text-cta" />Bộ lọc sản phẩm</h2>
            <button type="button" popoverTarget="shop-filter-drawer" popoverTargetAction="hide" aria-label="Đóng bộ lọc" className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted hover:text-main focus-visible:outline-2 focus-visible:outline-primary"><X className="size-5" /></button>
          </header>
          {/* Nội dung mock cuộn riêng, không làm dài trang sản phẩm. */}
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain p-4">{children}</div>
          <footer className="shrink-0 border-t border-surface-border bg-surface-subtle p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <button type="button" popoverTarget="shop-filter-drawer" popoverTargetAction="hide" className="min-h-10 w-full cursor-pointer rounded-md bg-cta px-4 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Đóng</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
