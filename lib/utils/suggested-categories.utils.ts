// Tính số hàng và cột theo sức chứa thực tế, giới hạn tối đa hai hàng.
export function getCategoryGridLayout(
  categoryCount: number,
  availableWidth: number,
  cardWidth: number,
  gap: number,
) {
  const capacity = Math.max(1, Math.floor((availableWidth + gap) / (cardWidth + gap)));
  const rowCount = categoryCount > capacity ? 2 : 1;
  const columnCount = rowCount === 1
    ? Math.max(1, categoryCount)
    : Math.max(capacity, Math.ceil(categoryCount / rowCount));

  return { rowCount, columnCount, hasOverflow: columnCount > capacity };
}
