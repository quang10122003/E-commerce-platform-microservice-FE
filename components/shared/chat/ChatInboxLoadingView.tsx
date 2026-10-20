import { UserChatShopListSkeleton } from "@/components/user/chat/user-chat-shop-list-skeleton";
import { UserChatRoomSkeleton } from "@/components/user/chat/user-chat-room-skeleton";

// Skeleton server hiển thị ngay khi tải hộp thư, không chờ hydration hoặc API client.
export function ChatInboxLoadingView({ shop = false }: { shop?: boolean }) {
  return (
    <div data-user-chat={shop ? undefined : ""} role="status" aria-label="Đang tải hộp thư" className="flex h-full min-h-0 w-full flex-1 overflow-hidden bg-surface-card">
      {/* Mobile chỉ tải danh sách, desktop giữ bố cục hai cột. */}
      <div className="h-full w-full overflow-hidden border-r border-surface-border md:w-80 md:shrink-0 lg:w-96">
        <div aria-hidden="true" className="space-y-3 border-b border-surface-border p-4">
          <div className="skeleton-shimmer h-5 w-28 rounded" />
          <div className="skeleton-shimmer h-9 w-full rounded-lg" />
        </div>
        <UserChatShopListSkeleton />
      </div>
      <div className="hidden min-h-0 min-w-0 flex-1 md:block"><UserChatRoomSkeleton fullRoom /></div>
    </div>
  );
}
