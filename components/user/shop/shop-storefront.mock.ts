// Dữ liệu tĩnh để duyệt giao diện shop, chưa đại diện cho sản phẩm từ API.
const productDefaults = {
  location: "TP. Hồ Chí Minh", description: null, categoryId: 1,
  categoryName: "Phụ kiện công nghệ", brandId: null, brandName: "SmartX", status: "ACTIVE" as const,
};

export const shopProducts = [
  { id: 1, name: "Tai nghe không dây Sony WH-1000XM5 chống ồn chủ động", imageUrl: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=85", maxPrice: 5490000, maxDiscountPercent: 25, totalSold: 1260 },
  { id: 2, name: "Bàn phím cơ không dây Keychron K2 đèn nền RGB", imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=85", maxPrice: 1590000, maxDiscountPercent: 20, totalSold: 820 },
  { id: 3, name: "Đồng hồ thông minh theo dõi sức khỏe, màn hình AMOLED", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=85", maxPrice: 1290000, maxDiscountPercent: 30, totalSold: 2430 },
  { id: 4, name: "Loa Bluetooth mini JBL âm thanh sống động, chống nước", imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=85", maxPrice: 890000, maxDiscountPercent: 15, totalSold: 670 },
  { id: 5, name: "Chuột không dây Logitech thiết kế công thái học", imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=85", maxPrice: 649000, maxDiscountPercent: 18, totalSold: 1850 },
  { id: 6, name: "Tai nghe chụp tai studio âm thanh Hi-Res", imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=85", maxPrice: 1190000, maxDiscountPercent: 35, totalSold: 540 },
  { id: 7, name: "Máy ảnh mirrorless Sony dành cho người sáng tạo", imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=85", maxPrice: 12990000, maxDiscountPercent: 10, totalSold: 320 },
  { id: 8, name: "Laptop mỏng nhẹ, đồng hành cùng góc làm việc mới", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=85", maxPrice: 18490000, maxDiscountPercent: 12, totalSold: 280 },
  { id: 9, name: "Tai nghe không dây true wireless nhỏ gọn", imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&q=85", maxPrice: 790000, maxDiscountPercent: 22, totalSold: 3670 },
  { id: 10, name: "Đồng hồ thông minh dây silicone thể thao", imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=85", maxPrice: 1690000, maxDiscountPercent: 20, totalSold: 950 },
  { id: 11, name: "Bộ bàn phím cơ và phụ kiện góc làm việc", imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=85", maxPrice: 1890000, maxDiscountPercent: 15, totalSold: 460 },
  { id: 12, name: "Tai nghe over-ear không dây, pin dùng cả ngày", imageUrl: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=85", maxPrice: 990000, maxDiscountPercent: 28, totalSold: 1120 },
].map((product) => ({ ...productDefaults, ...product }));
