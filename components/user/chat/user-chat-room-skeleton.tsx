import { ChatMessageSkeletonView } from "@/components/shared/chat/ChatMessageSkeletonView";

// Dùng skeleton bong bóng chung, bổ sung khung room khi chưa có metadata.
export function UserChatRoomSkeleton({ fullRoom = false }: { fullRoom?: boolean }) {
  const messages = <ChatMessageSkeletonView />;
  if (!fullRoom) return messages;

  // Chưa có metadata room thì phủ skeleton cả header, sản phẩm và vùng soạn tin.
  return (
    <div aria-busy="true" className="flex h-full min-h-0 flex-col overflow-hidden bg-surface-bg">
      <div aria-hidden="true" className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="skeleton-shimmer size-10 shrink-0 rounded-full" />
        <div className="skeleton-shimmer h-4 w-36 max-w-[60%] rounded" />
      </div>
      <div aria-hidden="true" className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="skeleton-shimmer size-12 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton-shimmer h-3 w-2/3 rounded" />
          <div className="skeleton-shimmer h-3 w-24 rounded" />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden p-4">{messages}</div>
      <div aria-hidden="true" className="flex shrink-0 gap-2 border-t border-slate-200 bg-white p-3">
        <div className="skeleton-shimmer h-9 flex-1 rounded-xl" />
        <div className="skeleton-shimmer h-9 w-16 rounded-xl" />
      </div>
    </div>
  );
}
