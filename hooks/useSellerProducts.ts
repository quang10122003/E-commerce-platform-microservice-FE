"use client";

import { useMemo, useState } from "react";
import { useGetSellerProductsQuery } from "@/lib/redux/services/product-api";
import type { SellerProductListItem } from "@/types/product";
import { useNotification } from "@/hooks/useNotification";

// Dữ liệu sản phẩm mẫu phong phú cho gian hàng khi chưa có kết nối backend trực tiếp
const INITIAL_SELLER_PRODUCTS: SellerProductListItem[] = [
  {
    id: 1,
    name: "Tai nghe Bluetooth True Wireless Pro ANC Chống ồn chủ động kép",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    categoryId: 1,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
    minPrice: 499000,
    maxPrice: 650000,
    totalStock: 142,
    variantCount: 4,
    status: "ACTIVE",
    createdAt: "14/09/2026",
  },
  {
    id: 2,
    name: "Đồng hồ thông minh AMOLED 5ATM GPS độc lập theo dõi sức khỏe SpO2",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    categoryId: 1,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
    minPrice: 1890000,
    maxPrice: 2190000,
    totalStock: 56,
    variantCount: 2,
    status: "ACTIVE",
    createdAt: "12/09/2026",
  },
  {
    id: 3,
    name: "Bàn phím cơ không dây RGB 3 Chế độ Gasket Mount Hot-swap Pro",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    categoryId: 1,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
    minPrice: 790000,
    maxPrice: 950000,
    totalStock: 80,
    variantCount: 6,
    status: "ACTIVE",
    createdAt: "10/09/2026",
  },
  {
    id: 4,
    name: "Củ sạc nhanh GaN 65W 3 Cổng Type-C PD 3.0 cho Laptop & Điện thoại",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    categoryId: 1,
    imageUrl: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=500&auto=format&fit=crop&q=80",
    minPrice: 320000,
    maxPrice: 350000,
    totalStock: 0,
    variantCount: 2,
    status: "OUT_OF_STOCK",
    createdAt: "08/09/2026",
  },
  {
    id: 5,
    name: "Chuột Gaming không dây siêu nhẹ 49g cảm biến 26.000 DPI PAW3395",
    categoryName: "Thiết Bị Điện Tử & Công Nghệ",
    categoryId: 1,
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
    minPrice: 680000,
    maxPrice: 720000,
    totalStock: 25,
    variantCount: 2,
    status: "INACTIVE",
    createdAt: "05/09/2026",
  },
];

// Hook quản lý danh sách sản phẩm, bộ lọc, tìm kiếm và phân trang cho Seller
export function useSellerProducts() {
  const { data: apiData, isLoading } = useGetSellerProductsQuery();
  const { notifySuccess } = useNotification();

  const [products, setProducts] = useState<SellerProductListItem[]>(INITIAL_SELLER_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Sử dụng dữ liệu từ API nếu có, ngược lại dùng state ban đầu
  const allProducts = useMemo(() => {
    if (apiData?.data && apiData.data.length > 0) {
      return apiData.data;
    }
    return products;
  }, [apiData, products]);

  // Lọc sản phẩm theo từ khóa tìm kiếm, danh mục và trạng thái kho
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toString().includes(searchTerm);

      const matchCategory =
        selectedCategory === "ALL" || product.categoryId === selectedCategory;

      const matchStatus =
        selectedStatus === "ALL" || product.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [allProducts, searchTerm, selectedCategory, selectedStatus]);

  // Phân trang danh sách sản phẩm
  const totalPages = Math.max(5, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  // Thống kê số lượng theo trạng thái
  const stats = useMemo(() => {
    return {
      total: allProducts.length,
      active: allProducts.filter((p) => p.status === "ACTIVE").length,
      outOfStock: allProducts.filter((p) => p.status === "OUT_OF_STOCK" || p.totalStock === 0).length,
      inactive: allProducts.filter((p) => p.status === "INACTIVE").length,
    };
  }, [allProducts]);

  // Chuyển đổi trạng thái ẩn/hiện sản phẩm
  const toggleProductStatus = (id: number) => {
    const currentProduct = allProducts.find((item) => item.id === id);

    if (!currentProduct || currentProduct.status === "OUT_OF_STOCK") {
      return;
    }

    const nextStatus = currentProduct.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    // Hiển thị thông báo ngoài updater để tránh React Strict Mode gọi lặp side-effect.
    notifySuccess(
      `Đã cập nhật trạng thái sản phẩm #${id}`,
      {
        description:
          nextStatus === "ACTIVE"
            ? "Sản phẩm đang được bán."
            : "Sản phẩm đã được tạm ẩn.",
      }
    );

    // Chỉ cập nhật state trong updater, giữ hàm cập nhật thuần và an toàn khi render lại.
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.status === "OUT_OF_STOCK") return item;
        return { ...item, status: nextStatus };
      })
    );
  };

  // Xóa sản phẩm khỏi danh sách
  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    notifySuccess(`Đã xóa sản phẩm #${id} thành công`);
  };

  return {
    currentPage,
    deleteProduct,
    filteredProducts: paginatedProducts,
    isLoading,
    searchTerm,
    selectedCategory,
    selectedStatus,
    setCurrentPage,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
    stats,
    toggleProductStatus,
    totalCount: filteredProducts.length,
    totalPages,
  };
}
