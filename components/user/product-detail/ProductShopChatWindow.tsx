"use client";

import Image from "next/image";
import { MessageCircle, Minus, X } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { useProductChatWindow } from "@/hooks/user/product-detail/useProductChatWindow";
import { ProductChatRoomView } from "./ProductChatRoomView";
import { ProductChatProductView } from "./ProductChatProductView";

// Cửa sổ chat thật với shop, giữ cách mở từ nút Chat ngay và nút chat mobile.
export function ProductShopChatWindow() {
  const chat = useProductChatWindow();
  if (!chat.isOpen || !chat.product) return null;
  const productPreview = {
    productId: chat.product.id,
    productName: chat.product.name,
    image: chat.image,
    price: chat.price,
  };

  return (
    <>
      {/* Thu nhỏ vẫn giữ room hoạt động; đóng hoặc đổi tài khoản sẽ hủy room. */}
      {chat.isMinimized && (
        <button type="button" onClick={chat.restore} title="Mở chat với Shop" aria-label={chat.unreadCount ? `Mở chat với Shop, ${chat.unreadCount} tin nhắn chưa đọc` : "Mở chat với Shop"} className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg transition-transform duration-200 motion-safe:animate-purchase-slide-up motion-safe:hover:-translate-y-1 motion-safe:active:scale-95 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary cursor-pointer">
          <MessageCircle aria-hidden="true" className="h-6 w-6" />
          {/* Badge ở góc icon, nhún ngắn khi tăng số tin và giới hạn hiển thị 99+. */}
          <span role="status" aria-live="polite" aria-atomic="true" className="absolute -right-1 -top-1">
            {chat.unreadCount > 0 && (
              <span key={chat.unreadCount} className="flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-cta px-1 text-[10px] font-bold tabular-nums motion-safe:animate-bounce motion-safe:[animation-duration:600ms] motion-safe:[animation-iteration-count:2]">
                <span aria-hidden="true">{chat.unreadCount > 99 ? "99+" : chat.unreadCount}</span>
                <span className="sr-only">{chat.unreadCount} tin nhắn chưa đọc</span>
              </span>
            )}
          </span>
        </button>
      )}
      <section aria-label="Chat với shop" className={chat.isMinimized ? "hidden" : "fixed inset-x-3 bottom-3 top-16 sm:top-auto sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 flex flex-col w-auto sm:w-[380px] h-auto sm:h-[520px] sm:max-h-[calc(100dvh-96px)] rounded-2xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200"}>
        {/* Giữ avatar và tên shop của UI mock; không suy đoán trạng thái online từ socket. */}
        <header className="flex shrink-0 items-center justify-between bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 px-4 py-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border-2 border-white/30">
              <Image src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&q=80" alt="Shop Avatar" fill unoptimized sizes="36px" className="object-cover" />
            </div>
            <div>
              <h2 className="text-xs font-bold leading-tight">SmartX Official Store</h2>
              <span className="text-[10px] text-indigo-200">Trò chuyện về sản phẩm</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-white/80">
            <button type="button" onClick={chat.minimize} aria-label="Thu nhỏ chat" title="Thu nhỏ" className="rounded-lg p-1.5 hover:bg-white/15 hover:text-white transition cursor-pointer"><Minus className="h-4 w-4" /></button>
            <button type="button" onClick={chat.close} aria-label="Đóng chat" title="Đóng" className="rounded-lg p-1.5 hover:bg-white/15 hover:text-white transition cursor-pointer"><X className="h-4 w-4" /></button>
          </div>
        </header>
        {chat.isCheckingAuth ? (
          <>
            <ProductChatProductView product={productPreview} />
            <p role="status" className="flex-1 bg-slate-50 p-6 text-center text-xs text-slate-500">Đang kiểm tra phiên đăng nhập…</p>
          </>
        ) : chat.user ? (
          <ProductChatRoomView key={`${chat.user.userId}:${chat.product.id}`} product={productPreview} userId={chat.user.userId} visible={!chat.isMinimized} onUnreadCountChange={chat.updateUnreadCount} />
        ) : (
          <>
            <ProductChatProductView product={productPreview} />
            <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
              <MessageCircle className="h-8 w-8 text-primary" />
              <p className="text-xs text-slate-500">Đăng nhập để trò chuyện với shop về sản phẩm này.</p>
              <button type="button" onClick={chat.openLogin} className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer">Đăng nhập</button>
            </div>
          </>
        )}
      </section>
      <AuthModal isOpen={chat.loginOpen && !chat.user} onClose={chat.closeLogin} initialTab="login" />
    </>
  );
}
