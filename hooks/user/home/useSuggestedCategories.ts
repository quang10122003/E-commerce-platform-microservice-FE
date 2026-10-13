import { useEffect, useRef, useState, type MouseEvent } from "react";
import { getCategoryGridLayout } from "@/lib/utils/suggested-categories.utils";

// Quản lý thao tác kéo ngang và ngăn điều hướng ngoài ý muốn của danh mục.
export function useSuggestedCategories(categoryCount: number) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  // Lưu bố cục và trạng thái tràn ngang theo kích thước vùng danh mục.
  const [layout, setLayout] = useState({
    rowCount: 1,
    gridTemplateColumns: "",
    hasOverflow: false,
  });
  // Theo dõi thao tác giữ chuột để kéo danh mục.
  const [isDown, setIsDown] = useState(false);
  // Lưu tọa độ bắt đầu thao tác kéo.
  const [startX, setStartX] = useState(0);
  // Lưu vị trí cuộn trước khi kéo.
  const [scrollLeftState, setScrollLeftState] = useState(0);
  // Ngăn mở danh mục sau khi người dùng đã kéo.
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    const scroll = scrollRef.current;
    const grid = gridRef.current;
    if (!scroll || !grid) return;

    // Đọc kích thước card và gap từ CSS để không lặp lại giá trị breakpoint.
    const updateLayout = () => {
      const scrollStyle = getComputedStyle(scroll);
      const gridStyle = getComputedStyle(grid);
      const cardWidth = parseFloat(gridStyle.gridAutoColumns);
      const gap = parseFloat(gridStyle.columnGap) || 0;
      const availableWidth = scroll.clientWidth
        - parseFloat(scrollStyle.paddingLeft)
        - parseFloat(scrollStyle.paddingRight);
      if (!Number.isFinite(cardWidth) || cardWidth <= 0 || availableWidth <= 0) return;

      const { rowCount, columnCount, hasOverflow } = getCategoryGridLayout(
        categoryCount, availableWidth, cardWidth, gap,
      );
      const gridTemplateColumns = `repeat(${columnCount}, ${cardWidth}px)`;
      setLayout((previous) => previous.rowCount === rowCount
        && previous.gridTemplateColumns === gridTemplateColumns
        && previous.hasOverflow === hasOverflow
        ? previous
        : { rowCount, gridTemplateColumns, hasOverflow });
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    observer.observe(scroll);
    return () => observer.disconnect();
  }, [categoryCount]);

  // Bắt đầu kéo từ vị trí chuột và vị trí cuộn hiện tại.
  const handleMouseDown = (event: MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setHasMoved(false);
    setStartX(event.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  // Kết thúc kéo khi chuột rời vùng danh mục.
  const handleMouseLeave = () => setIsDown(false);
  // Kết thúc kéo khi thả chuột.
  const handleMouseUp = () => setIsDown(false);

  // Cuộn danh mục theo khoảng cách di chuyển chuột.
  const handleMouseMove = (event: MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    event.preventDefault();
    const x = event.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    if (Math.abs(walk) > 4) setHasMoved(true);
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Chỉ điều hướng khi thao tác là click thay vì kéo.
  const handleLinkClick = (event: MouseEvent) => {
    if (hasMoved) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return {
    handleLinkClick,
    handleMouseDown,
    handleMouseLeave,
    handleMouseMove,
    handleMouseUp,
    isDown,
    scrollRef,
    gridRef,
    ...layout,
  };
}
