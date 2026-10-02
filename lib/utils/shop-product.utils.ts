import type { SellerProductItem } from "@/types/shop-product";

// Tính giá và tồn kho từ các phân loại để hiển thị một dòng sản phẩm.
export function summarizeSellerProduct(product: SellerProductItem) {
  const prices = product.variants.map((variant) => variant.price);
  return {
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    totalStock: product.variants.reduce((total, variant) => total + variant.stockQuantity, 0),
    hasVariants: product.variants.length > 1 || product.variants.some((variant) => variant.attributes.length > 0),
    attributeNames: [...new Set(product.variants.flatMap((variant) => variant.attributes.map((attribute) => attribute.name)))].join(", "),
  };
}

// Ghép các giá trị thuộc tính của phân loại thành nhãn dễ đọc.
export function getSellerVariantLabel(variant: SellerProductItem["variants"][number]) {
  return variant.attributes.map((attribute) => attribute.value).join(" / ") || variant.sku;
}

// Đổi ngày tạo từ LocalDateTime thành định dạng ngày/tháng/năm.
export function formatSellerProductDate(createdAt: string) {
  const [year, month, day] = createdAt.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : createdAt;
}

// Giữ danh mục, trạng thái và từ khóa khi chuyển trang hoặc chọn bộ lọc.
export function getSellerProductsUrl(categoryId?: number, status?: string, page = 1, keyword?: string) {
  const params = new URLSearchParams();
  if (categoryId) params.set("categoryId", String(categoryId));
  if (status) params.set("status", status);
  if (keyword?.trim()) params.set("keyword", keyword.trim());
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/shop/products?${query}` : "/shop/products";
}

// Lấy tối đa năm số trang gần trang hiện tại, bù ở hai đầu khi cần.
export function getNearbySellerPages(currentPage: number, totalPages: number) {
  const visibleCount = Math.min(5, totalPages);
  const firstPage = Math.min(
    Math.max(1, currentPage - 2),
    Math.max(1, totalPages - visibleCount + 1),
  );
  return Array.from({ length: visibleCount }, (_, index) => firstPage + index);
}

// Kiểm tra các phân loại còn khác tổ hợp sau khi chọn hoặc bỏ nhóm thuộc tính.
export function hasDuplicateVariantCombinations(
  attributes: ReadonlyArray<{ key: string }>,
  variants: ReadonlyArray<{ selections: Readonly<Record<string, string>> }>,
) {
  const combinations = variants.map((variant) => JSON.stringify(
    attributes.map((attribute) => variant.selections[attribute.key] || ""),
  ));
  return new Set(combinations).size !== combinations.length;
}
