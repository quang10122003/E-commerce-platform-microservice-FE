"use client";

import Image from "next/image";
import { Controller } from "react-hook-form";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { Textarea } from "@/components/ui";
import { useReviewOrderItem } from "@/hooks/user/orders/useReviewOrderItem";
import { formatVariantAttributes } from "@/lib/utils/order.utils";
import { RATING_LABELS, REVIEW_CONTENT_MAX_LENGTH, REVIEW_IMAGE_TYPES, REVIEW_MAX_IMAGES } from "@/lib/utils/review.utils";
import type { UserOrderItem } from "@/types/user/order";

// Nút đánh giá một món đã mua và dialog chọn sao, viết nhận xét, đính kèm ảnh; logic gửi nằm trong useReviewOrderItem.
export function OrderReviewAction({ item }: { item: UserOrderItem }) {
  const { form, dialogRef, previews, open, close, submit, addImages, removeImage } = useReviewOrderItem(item.orderItemId);
  const { register, control, watch, formState: { errors, isSubmitting } } = form;
  const titleId = `review-item-${item.orderItemId}-title`;
  const content = watch("content");
  const variant = formatVariantAttributes(item.variantAttributes);

  return (
    <>
      <button type="button" onClick={open}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-cta to-orange-600 px-3 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta">
        <Star className="size-3.5 fill-white" aria-hidden="true" /> Đánh giá
      </button>

      {/* Dialog native: Esc và click nền đều gọi close để giữ khóa khi đang gửi. */}
      <dialog ref={dialogRef} aria-labelledby={titleId}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-xs">
        <form onSubmit={submit} noValidate>
          {/* Món được đánh giá, lấy từ snapshot của đơn hàng. */}
          <header className="flex items-start gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {item.imageUrl && <Image src={item.imageUrl} alt="" fill unoptimized sizes="56px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="text-sm font-bold text-slate-900 sm:text-base">Đánh giá sản phẩm</h2>
              <p className="line-clamp-1 text-xs text-slate-600">{item.productName}</p>
              {variant && <p className="text-[11px] text-slate-400">Phân loại: {variant}</p>}
            </div>
            <button type="button" onClick={close} disabled={isSubmitting} aria-label="Đóng"
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50">
              <X className="size-4.5" />
            </button>
          </header>

          <div className="space-y-5 p-5">
            {/* Chọn số sao bằng nhóm radio để dùng được bàn phím. */}
            <Controller control={control} name="rating" render={({ field }) => (
              <fieldset className="flex flex-col items-center gap-1.5">
                <legend className="sr-only">Số sao đánh giá</legend>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value} className="cursor-pointer rounded-md p-0.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-star">
                      <input type="radio" name={field.name} value={value} checked={field.value === value}
                        onChange={() => field.onChange(value)} className="sr-only" aria-label={`${value} sao - ${RATING_LABELS[value]}`} />
                      <Star className={`size-8 transition-transform hover:scale-110 ${value <= field.value ? "fill-star text-star" : "fill-slate-100 text-slate-300"}`} aria-hidden="true" />
                    </label>
                  ))}
                </div>
                <span className="text-sm font-semibold text-star-hover">{RATING_LABELS[field.value]}</span>
              </fieldset>
            )} />

            <div>
              <Textarea rows={4} maxLength={REVIEW_CONTENT_MAX_LENGTH} aria-label="Nội dung đánh giá"
                placeholder="Chia sẻ cảm nhận về chất lượng sản phẩm, đóng gói, giao hàng..."
                error={errors.content?.message}
                {...register("content", { maxLength: { value: REVIEW_CONTENT_MAX_LENGTH, message: `Tối đa ${REVIEW_CONTENT_MAX_LENGTH} ký tự.` } })} />
              <p className="mt-1 text-right text-[11px] text-slate-400">{content.length}/{REVIEW_CONTENT_MAX_LENGTH}</p>
            </div>

            {/* Ảnh đính kèm: xem trước, bỏ từng ảnh, tối đa 5 ảnh. */}
            <div>
              <div className="grid grid-cols-5 gap-2">
                {previews.map((url, index) => (
                  <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
                    <Image src={url} alt={`Ảnh đánh giá ${index + 1}`} fill unoptimized sizes="96px" className="object-cover" />
                    <button type="button" onClick={() => removeImage(index)} aria-label={`Bỏ ảnh ${index + 1}`}
                      className="absolute right-1 top-1 rounded-full bg-slate-900/70 p-0.5 text-white hover:bg-danger">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
                {previews.length < REVIEW_MAX_IMAGES && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 text-slate-400 transition-colors hover:border-cta hover:text-cta has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta">
                    <ImagePlus className="size-5" aria-hidden="true" />
                    <span className="text-[10px] font-medium">{previews.length}/{REVIEW_MAX_IMAGES}</span>
                    <input type="file" accept={REVIEW_IMAGE_TYPES.join(",")} multiple onChange={addImages} className="sr-only" aria-label="Thêm ảnh đánh giá" />
                  </label>
                )}
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400">JPEG, PNG hoặc WEBP, mỗi ảnh tối đa 15MB.</p>
              {errors.images && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.images.message}</p>}
            </div>

            {errors.root?.server && <p role="alert" className="rounded-lg bg-danger-light px-3 py-2 text-xs font-medium text-danger-hover">{errors.root.server.message}</p>}
          </div>

          <footer className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5">
            <button type="button" onClick={close} disabled={isSubmitting}
              className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              Trở lại
            </button>
            <button type="submit" disabled={isSubmitting}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover active:scale-95 disabled:opacity-60">
              {isSubmitting && <Loader2 className="size-4 animate-spin" />} Gửi đánh giá
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
