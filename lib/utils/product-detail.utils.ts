import { getSaleCountdown } from "@/lib/utils/user-flash-sale.utils";
import type { UserProductAttribute, UserProductDetailResponse, UserProductVariant, VariantSaleResponse } from "@/types/user/product";

export interface ProductGalleryImage {
  id: string;
  src: string;
  variantName: string | null;
}

// Lấy đúng variant mặc định kể cả khi sản phẩm không có thuộc tính phân loại.
export function getDefaultProductVariant(product: UserProductDetailResponse | null) {
  return product?.variants.find((variant) => variant.id === product.defaultVariantId) ?? null;
}

// Chọn đúng tổ hợp defaultVariantId, không tự thay bằng variant khác khi không tìm thấy.
export function getDefaultProductSelection(product: UserProductDetailResponse | null): number[] {
  if (!product) return [];
  return getDefaultProductVariant(product)?.attributeValueIds ?? [];
}

// Thay giá trị trong một thuộc tính và giữ nguyên lựa chọn của các thuộc tính còn lại.
export function selectProductAttribute(attributes: UserProductAttribute[], selectedIds: number[], attributeId: number, valueId: number): number[] {
  const attribute = attributes.find((item) => item.id === attributeId);
  if (!attribute?.values.some((value) => value.id === valueId)) return selectedIds;
  const currentAttributeIds = new Set(attribute.values.map((value) => value.id));
  return [...selectedIds.filter((id) => !currentAttributeIds.has(id)), valueId];
}

// Đối chiếu toàn bộ tổ hợp ID, không chọn nhầm variant khi mới chọn một phần thuộc tính.
export function findSelectedProductVariant(product: UserProductDetailResponse | null, selectedIds: number[]) {
  return product?.variants.find((variant) => variant.attributeValueIds.length === selectedIds.length
    && variant.attributeValueIds.every((id) => selectedIds.includes(id))) ?? null;
}

// Gom ảnh chung và ảnh từng variant, gắn tên tổ hợp thuộc tính vào ảnh riêng.
export function getProductGalleryImages(product: UserProductDetailResponse): ProductGalleryImage[] {
  const images: ProductGalleryImage[] = product.imageUrl
    ? [{ id: `product-${product.id}`, src: product.imageUrl, variantName: null }]
    : [];
  for (const variant of product.variants) {
    const variantName = product.attributes.flatMap((attribute) => attribute.values
      .filter((value) => variant.attributeValueIds.includes(value.id)).map((value) => value.value)).join(" / ") || null;
    for (const image of variant.images) {
      if (image.imageUrl) images.push({ id: `variant-${variant.id}-image-${image.id}`, src: image.imageUrl, variantName });
    }
  }
  return images;
}

// Chỉ lấy ảnh của variant đang chọn, dùng ảnh chung khi variant chưa có ảnh riêng.
export function getProductPurchaseImages(product: UserProductDetailResponse, variant: UserProductVariant | null): ProductGalleryImage[] {
  const gallery = getProductGalleryImages(product);
  const variantImages = variant ? gallery.filter((image) => image.id.startsWith(`variant-${variant.id}-image-`)) : [];
  return variantImages.length ? variantImages : gallery.filter((image) => image.id === `product-${product.id}`);
}
// Tìm đúng ảnh primary trong gallery bằng ID, không nhầm khi các variant dùng chung URL ảnh.
export function getVariantPrimaryImageIndex(images: ProductGalleryImage[], variant: UserProductVariant | null): number {
  const primaryImage = variant?.images.find((image) => image.primary && image.imageUrl);
  if (!variant || !primaryImage) return -1;
  return images.findIndex((image) => image.id === `variant-${variant.id}-image-${primaryImage.id}`);
}

// Chỉ lấy văn bản an toàn từ mô tả HTML; không chèn HTML backend trực tiếp vào DOM.
export function getProductDescriptionText(description: string): string {
  if (typeof DOMParser === "undefined" || !/<\/?[a-z][\s\S]*>/i.test(description)) return description;
  const document = new DOMParser().parseFromString(description, "text/html");
  document.querySelectorAll("script, style").forEach((node) => node.remove());
  document.querySelectorAll("p, div, h1, h2, h3, h4, h5, h6, li, br").forEach((node) => node.append("\n"));
  return document.body.textContent?.trim() ?? "";
}

// Chỉ áp dụng sale còn hạn của đúng variant; thiếu response thì dùng giá từ chi tiết sản phẩm.
export function getProductVariantPricing(variant: UserProductVariant | null, response: VariantSaleResponse | null, now: number) {
  const data = variant && response?.variantId === variant.id ? response : null;
  const originalPrice = data?.originalPrice ?? variant?.price ?? null;
  const countdown = getSaleCountdown(data?.sale?.endsAt ?? null, now);
  const sale = data?.sale && Number.isFinite(Date.parse(data.sale.endsAt)) && !countdown.expired ? data.sale : null;
  return { originalPrice, price: sale?.salePrice ?? originalPrice, sale, countdown: countdown.parts };
}
// Phân biệt sản phẩm không tồn tại với lỗi mạng, server hoặc response không hợp lệ.
export function getProductDetailFailureKind(error: unknown): "not-found" | "error" {
  if (error && typeof error === "object") {
    if ("status" in error && error.status === 404) return "not-found";
    if ("originalStatus" in error && error.originalStatus === 404) return "not-found";
  }
  return "error";
}
// Chặn thao tác thêm giỏ khi thiếu variant, số lượng sai hoặc vượt tồn kho hiện tại.
export function getProductCartValidationMessage(variant: UserProductVariant | null, quantity: number): string | null {
  if (!variant) return "Vui lòng chọn đầy đủ phân loại sản phẩm.";
  if (!Number.isSafeInteger(quantity) || quantity <= 0) return "Số lượng phải là số nguyên lớn hơn 0.";
  if (variant.status === "OUT_OF_STOCK" || variant.stockQuantity <= 0) return "Phân loại này đã hết hàng.";
  if (quantity > variant.stockQuantity) return "Số lượng vượt quá tồn kho của phân loại đang chọn.";
  return null;
}