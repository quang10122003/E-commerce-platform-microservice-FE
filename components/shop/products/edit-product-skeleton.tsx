import { Card, Loading } from "@/components/ui";

const skeletonLine = "skeleton-shimmer rounded-md";

export function EditProductSkeleton() {
  return (
    <div className="relative min-h-[calc(100vh-10rem)]" aria-busy="true">
      <div className="space-y-6 pb-12">
        <div className="space-y-2"><div className={`${skeletonLine} h-7 w-64`} /><div className={`${skeletonLine} h-3 w-80 max-w-full`} /></div>
        <Card variant="3d" className="space-y-4 p-5">
          <div className="flex items-center gap-2"><div className={`${skeletonLine} h-5 w-1.5`} /><div className={`${skeletonLine} h-4 w-48`} /></div>
          <div className="space-y-2"><div className={`${skeletonLine} h-3 w-28`} /><div className={`${skeletonLine} h-10 w-full`} /></div>
          <div className="grid gap-3 sm:grid-cols-2"><div className={`${skeletonLine} h-10 w-full`} /><div className={`${skeletonLine} h-10 w-full`} /></div>
          <div className={`${skeletonLine} h-20 w-full`} />
        </Card>
        <Card variant="3d" className="space-y-4 p-5"><div className={`${skeletonLine} h-4 w-44`} /><div className="flex gap-4"><div className={`${skeletonLine} h-36 w-36 shrink-0`} /><div className={`${skeletonLine} h-12 w-64 max-w-full`} /></div></Card>
        <Card variant="3d" className="space-y-4 p-5"><div className={`${skeletonLine} h-4 w-56`} /><div className={`${skeletonLine} h-10 w-full`} /><div className="flex gap-2"><div className={`${skeletonLine} h-9 w-28`} /><div className={`${skeletonLine} h-9 w-28`} /></div></Card>
        <Card variant="3d" className="space-y-4 p-5"><div className={`${skeletonLine} h-4 w-48`} /><div className="space-y-2">{Array.from({ length: 3 }, (_, index) => <div key={index} className="grid min-w-[680px] grid-cols-5 gap-3"><div className={`${skeletonLine} h-9`} /><div className={`${skeletonLine} h-9`} /><div className={`${skeletonLine} h-9`} /><div className={`${skeletonLine} h-9`} /><div className={`${skeletonLine} h-9`} /></div>)}</div></Card>
      </div>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
        <Loading label="Đang tải dữ liệu sản phẩm..." className="min-h-0 w-full max-w-sm" />
      </div>
    </div>
  );
}
