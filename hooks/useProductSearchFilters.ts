"use client";

import { useCallback, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ProductSortOption } from "@/types/product";

type UseProductSearchFiltersOptions = {
  sort: ProductSortOption;
  brandIds?: number[];
  minPrice?: number;
  maxPrice?: number;
};

type FilterUpdates = {
  sort?: ProductSortOption;
  brandIds?: number[];
  minPrice?: number;
  maxPrice?: number;
};

// Chuyển giá trị số trên URL thành chuỗi phù hợp với ô nhập khoảng giá.
function toPriceInputValue(value?: number): string {
  return value === undefined ? "" : String(value);
}

// Kiểm tra và chuyển giá trị khoảng giá người dùng nhập thành số hợp lệ.
function parsePriceInput(value: string): number | undefined {
  const normalizedValue = value.trim();
  if (!normalizedValue) return undefined;

  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : undefined;
}

// Quản lý bộ lọc tìm kiếm và đồng bộ trạng thái lọc vào URL của trang.
export function useProductSearchFilters({
  sort,
  brandIds = [],
  minPrice,
  maxPrice,
}: UseProductSearchFiltersOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [minPriceInput, setMinPriceInput] = useState(toPriceInputValue(minPrice));
  const [maxPriceInput, setMaxPriceInput] = useState(toPriceInputValue(maxPrice));
  const [priceError, setPriceError] = useState<string | null>(null);

  // Tạo URL mới và xóa cursor cũ để bộ lọc bắt đầu từ batch đầu tiên.
  const navigateWithFilters = useCallback(
    (updates: FilterUpdates) => {
      const nextSearchParams = new URLSearchParams(searchParams.toString());
      nextSearchParams.delete("cursor");

      if (updates.sort !== undefined) {
        if (updates.sort === "RELEVANCE") {
          nextSearchParams.delete("sort");
        } else {
          nextSearchParams.set("sort", updates.sort);
        }
      }

      if ("brandIds" in updates) {
        nextSearchParams.delete("brandIds");
        updates.brandIds?.forEach((brandId) => {
          nextSearchParams.append("brandIds", String(brandId));
        });
      }
      nextSearchParams.delete("brandId");

      if (updates.minPrice !== undefined) {
        nextSearchParams.set("minPrice", String(updates.minPrice));
      } else if ("minPrice" in updates) {
        nextSearchParams.delete("minPrice");
      }

      if (updates.maxPrice !== undefined) {
        nextSearchParams.set("maxPrice", String(updates.maxPrice));
      } else if ("maxPrice" in updates) {
        nextSearchParams.delete("maxPrice");
      }

      const queryString = nextSearchParams.toString();
      startTransition(() => {
        router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  // Áp dụng thương hiệu và bắt đầu lại danh sách từ batch đầu tiên.
  const handleBrandChange = useCallback(
    (nextBrandId: number) => {
      const nextBrandIds = brandIds.includes(nextBrandId)
        ? brandIds.filter((brandId) => brandId !== nextBrandId)
        : [...brandIds, nextBrandId];
      navigateWithFilters({ brandIds: nextBrandIds });
    },
    [brandIds, navigateWithFilters],
  );

  // Bỏ toàn bộ thương hiệu nhưng giữ nguyên các bộ lọc khác.
  const handleClearBrands = useCallback(
    () => navigateWithFilters({ brandIds: [] }),
    [navigateWithFilters],
  );

  // Áp dụng khoảng giá sau khi kiểm tra điều kiện tối thiểu và tối đa.
  const handlePriceSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const nextMinPrice = parsePriceInput(minPriceInput);
      const nextMaxPrice = parsePriceInput(maxPriceInput);

      if (minPriceInput.trim() && nextMinPrice === undefined) {
        setPriceError("Giá tối thiểu không hợp lệ.");
        return;
      }

      if (maxPriceInput.trim() && nextMaxPrice === undefined) {
        setPriceError("Giá tối đa không hợp lệ.");
        return;
      }

      if (
        nextMinPrice !== undefined &&
        nextMaxPrice !== undefined &&
        nextMinPrice > nextMaxPrice
      ) {
        setPriceError("Giá tối thiểu không được lớn hơn giá tối đa.");
        return;
      }

      setPriceError(null);
      navigateWithFilters({
        minPrice: nextMinPrice,
        maxPrice: nextMaxPrice,
      });
    },
    [maxPriceInput, minPriceInput, navigateWithFilters],
  );

  // Đưa danh sách về trạng thái mặc định và giữ lại từ khóa hiện tại.
  const handleClearFilters = useCallback(() => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setPriceError(null);
    navigateWithFilters({
      sort: "RELEVANCE",
      brandIds: [],
      minPrice: undefined,
      maxPrice: undefined,
    });
  }, [navigateWithFilters]);

  // Chuyển cách sắp xếp và yêu cầu lại danh sách từ batch đầu tiên.
  const handleSortChange = useCallback(
    (nextSort: ProductSortOption) => navigateWithFilters({ sort: nextSort }),
    [navigateWithFilters],
  );

  return {
    brandIds,
    handleBrandChange,
    handleClearBrands,
    handleClearFilters,
    handlePriceSubmit,
    handleSortChange,
    isPending,
    maxPriceInput,
    minPriceInput,
    priceError,
    setMaxPriceInput,
    setMinPriceInput,
    sort,
  };
}
