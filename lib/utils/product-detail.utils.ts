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

// Ưu tiên variant hợp lệ từ link sale trong chính sản phẩm; thiếu hoặc sai thì giữ mặc định.
export function getInitialProductVariant(product: UserProductDetailResponse | null, variantId?: string) {
  const parsedVariantId = variantId && /^\d+$/.test(variantId) ? Number(variantId) : NaN;
  const linkedVariant = Number.isSafeInteger(parsedVariantId) && parsedVariantId > 0
    ? product?.variants.find((variant) => variant.id === parsedVariantId)
    : undefined;
  return linkedVariant ?? getDefaultProductVariant(product);
}

// Chọn đúng tổ hợp defaultVariantId, không tự thay bằng variant khác khi không tìm thấy.
export function getDefaultProductSelection(product: UserProductDetailResponse | null): number[] {
  if (!product) return [];
  return getDefaultProductVariant(product)?.attributeValueIds ?? [];
}

// Chỉ giữ value thuộc variant thực tế, kể cả hết hàng; ẩn thuộc tính không còn value.
export function getProductVariantAttributes(product: UserProductDetailResponse | null): UserProductAttribute[] {
  if (!product) return [];
  const variantValueIds = new Set(product.variants.flatMap((variant) => variant.attributeValueIds));
  return product.attributes.flatMap((attribute) => {
    const values = attribute.values.filter((value) => variantValueIds.has(value.id));
    return values.length ? [{ ...attribute, values }] : [];
  });
}

// Chỉ dùng variant còn hàng có đúng một value cho mỗi thuộc tính đang hiển thị.
export function getAvailableProductVariants(product: UserProductDetailResponse | null, attributes: UserProductAttribute[]) {
  return product?.variants.filter((variant) => variant.status === "AVAILABLE" && variant.stockQuantity > 0
    && variant.attributeValueIds.length === attributes.length
    && attributes.every((attribute) => attribute.values.filter((value) => variant.attributeValueIds.includes(value.id)).length === 1)) ?? [];
}

// Giữ lựa chọn phía trên, để các thuộc tính phía dưới có thể đổi theo tổ hợp hoàn chỉnh.
function getProductAttributeCandidates(attributes: UserProductAttribute[], variants: UserProductVariant[], selectedIds: number[], attributeId: number) {
  const index = attributes.findIndex((attribute) => attribute.id === attributeId);
  if (index < 0) return [];
  const precedingIds = attributes.slice(0, index).flatMap((attribute) => attribute.values
    .filter((value) => selectedIds.includes(value.id)).map((value) => value.id));
  return variants.filter((variant) => precedingIds.every((id) => variant.attributeValueIds.includes(id)));
}

// Value chỉ chọn được khi tạo tổ hợp còn hàng với các thuộc tính đã chọn phía trên.
export function getSelectableProductValueIds(attributes: UserProductAttribute[], variants: UserProductVariant[], selectedIds: number[]) {
  const selectableIds = new Set<number>();
  for (const attribute of attributes) {
    const candidates = getProductAttributeCandidates(attributes, variants, selectedIds, attribute.id);
    for (const value of attribute.values) {
      if (candidates.some((variant) => variant.attributeValueIds.includes(value.id))) selectableIds.add(value.id);
    }
  }
  return selectableIds;
}

// Giữ value vừa chọn và tự sửa các value phía dưới; ưu tiên giữ nhiều lựa chọn cũ nhất.
export function selectProductAttribute(attributes: UserProductAttribute[], selectedIds: number[], attributeId: number, valueId: number, variants: UserProductVariant[]): number[] {
  const attribute = attributes.find((item) => item.id === attributeId);
  if (!attribute?.values.some((value) => value.id === valueId)) return selectedIds;
  const candidates = getProductAttributeCandidates(attributes, variants, selectedIds, attributeId)
    .filter((variant) => variant.attributeValueIds.includes(valueId));
  let bestVariant: UserProductVariant | null = null;
  let bestScore = -1;
  for (const variant of candidates) {
    const score = variant.attributeValueIds.filter((id) => selectedIds.includes(id)).length;
    // Chỉ thay khi tốt hơn để giữ thứ tự response trong trường hợp đồng điểm.
    if (score > bestScore) {
      bestVariant = variant;
      bestScore = score;
    }
  }
  return bestVariant ? [...bestVariant.attributeValueIds] : selectedIds;
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

// Giới hạn số lượng theo tồn kho và khóa điều chỉnh khi variant thiếu hoặc hết hàng.
export function getProductQuantityControls(variant: UserProductVariant | null, requestedQuantity: number) {
  const stock = variant?.status === "AVAILABLE" && Number.isSafeInteger(variant.stockQuantity) && variant.stockQuantity > 0
    ? variant.stockQuantity : 0;
  const quantity = Math.min(Math.max(1, Number.isSafeInteger(requestedQuantity) ? requestedQuantity : 1), Math.max(1, stock));
  return { quantity, isQuantityDisabled: stock === 0, canDecrease: stock > 0 && quantity > 1, canIncrease: stock > 0 && quantity < stock };
}

// API chưa có stock cấp product; chỉ tính tổng variant sau khi chi tiết đã tải thành công.
export function getProductTotalStock(product: UserProductDetailResponse | null): number | null {
  if (!product || product.variants.some((variant) => !Number.isSafeInteger(variant.stockQuantity))) return null;
  return product.variants.reduce((total, variant) => total + Math.max(0, variant.stockQuantity), 0);
}
