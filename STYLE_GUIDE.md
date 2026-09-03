# BẢNG QUY CHUẨN GIAO DIỆN & THƯ VIỆN UI (STYLE GUIDE & UI LIBRARIES)
## Dự án: Sàn Thương Mại Điện Tử Hiện Đại (Modern Platform Style)

> **Mục đích:** Tài liệu chuẩn hóa toàn diện về bảng màu thương hiệu hiện đại, quy chuẩn Responsive 100%, danh sách thư viện chỉ định và quy tắc xây dựng component cho cả 2 phân hệ **Khách hàng (Storefront)** và **Kênh Người Bán (Seller Center)**.

---

## 1. QUY CHUẨN RESPONSIVE & MOBILE-FIRST (BẮT BUỘC TUÂN THỦ)

Tất cả các trang, component, layout khi tạo mới hoặc sửa đổi **BẮT BUỘC** phải hỗ trợ responsive mượt mà trên mọi thiết bị:

| Thiết bị | Breakpoint (Tailwind) | Quy tắc hiển thị |
| :--- | :--- | :--- |
| **Mobile nhỏ** | `< 640px` (Mặc định) | Lưới 1-2 cột, Sidebar ẩn vào Drawer, Nút bấm tối thiểu cao 36-40px |
| **Tablet** | `sm: 640px` - `md: 768px`| Lưới 2-3 cột, Menu thu gọn, Table cuộn ngang `overflow-x-auto` |
| **Laptop** | `lg: 1024px` | Sidebar mở cố định, Lưới 4-6 cột, Hiển thị đầy đủ bộ lọc |
| **Desktop lớn** | `xl: 1280px` - `2xl: 1536px`| Container căn giữa `max-w-7xl mx-auto`, hiển thị thoáng đãng |

### Các nguyên tắc Responsive bắt buộc:
1. **Sidebars / Navigation (Kênh Người Bán & Bộ lọc):** Phải có Drawer trượt ra trên Mobile kèm nút Hamburger (☰) và nút Đóng (✕).
2. **Bảng dữ liệu (Data Tables):** Luôn bọc trong `<div className="overflow-x-auto">` để không bao giờ bị vỡ khung hình trên màn hình nhỏ.
3. **Lưới sản phẩm (Product Grid):** Luôn chia linh hoạt `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4`.
4. **Không để tràn màn hình ngang:** Tuyệt đối không để xảy ra hiện tượng thanh cuộn ngang ở cấp trang web.

---

## 2. BẢNG MÀU CHỦ ĐẠO (MODERN COLOR PALETTE - 60:30:10 RULE)

Hệ thống màu được thiết kế theo chuẩn giao diện Platform hiện đại (tương tự Linear, Shopify, Stripe): **Nền Slate sạch sẽ (60%) + Thương hiệu Indigo công nghệ (30%) + Điểm nhấn Sunset Coral kích thích mua sắm (10%)**.

### 2.1 Bảng màu chính (Brand & Conversion Colors)

| Nhóm màu | Mã HEX | Tên màu | Ứng dụng cụ thể |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `#4F46E5` | **Modern Indigo** | Header, Tab đang chọn, Icon chính, Link active, Border focus |
| **Brand Hover** | `#4338CA` | **Deep Indigo** | Trạng thái hover của các nút thương hiệu / icon |
| **Brand Light** | `#EEF2FF` | **Soft Indigo** | Nền của tab đang active, nền badge thông báo nhẹ |
| **CTA / Sale Accent** | `#FF5722` | **Sunset Coral** | **Nút "Mua ngay"**, Giá khuyến mãi, Đếm ngược Flash Sale, Tag Giảm giá |
| **CTA Hover** | `#E64A19` | **Deep Coral** | Trạng thái hover của nút Mua ngay / Nút thanh toán |
| **CTA Light** | `#FFF1EE` | **Peach Mist** | Nền nút "Thêm vào giỏ hàng", Nền tag mã giảm giá |
| **Perks / FreeShip** | `#10B981` | **Emerald Mint** | Tag "Freeship Extra", "Đã thanh toán", "Còn hàng", Đơn thành công |
| **Rating / Highlight**| `#FBBF24` | **Warm Amber** | Ngôi sao đánh giá (Rating 5 sao), Huy hiệu Top bán chạy |
| **Danger / Cancel** | `#EF4444` | **Rose Red** | Nút Hủy đơn hàng, Báo lỗi form, Xóa sản phẩm trong Admin |

---

### 2.2 Bảng màu Nền & Trung tính (Neutral & Surface Colors)

| Nhóm màu | Mã HEX | Ứng dụng |
| :--- | :--- | :--- |
| **Page Background** | `#F8FAFC` | Nền toàn bộ trang web (Tone Slate dịu mắt, làm nổi bật thẻ trắng) |
| **Card / Surface** | `#FFFFFF` | Nền Thẻ sản phẩm, Modal, Dropdown Menu, Form nhập liệu |
| **Border / Divider** | `#E2E8F0` | Đường kẻ phân cách, Viền thẻ Card, Viền ô Input |
| **Text Primary** | `#0F172A` | Tên sản phẩm, Tiêu đề chính (Đậm nét, tương phản chuẩn a11y) |
| **Text Secondary** | `#64748B` | Số lượng đã bán, Tên shop, Mô tả ngắn, Thông số phụ |
| **Text Placeholder**| `#94A3B8` | Chữ gợi ý trong ô tìm kiếm và form |
| **Seller Sidebar** | `#0F172A` | Nền thanh Menu điều hướng Kênh Người Bán (Slate tối sang trọng) |

---

## 3. DANH SÁCH THƯ VIỆN UI BÊN NGOÀI ĐƯỢC CHỈ ĐỊNH (THIRD-PARTY LIBRARIES)

Khi tạo code các thành phần giao diện, **bắt buộc sử dụng các thư viện đã được thống nhất dưới đây**:

| Hạng mục UI | Thư viện chỉ định | Gói cài đặt (pnpm) | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Icons** | **Lucide Icons** | `lucide-react` | Toàn bộ icon trong hệ thống (Search, Cart, User, Star, Package, Orders...) |
| **Component Primitives** | **Radix UI / shadcn/ui** | `@radix-ui/react-*` | Dialog (Modal), Dropdown Menu, Tooltip, Select, Tabs, Popover, Sheet |
| **Bảng dữ liệu (Table)** | **TanStack Table** | `@tanstack/react-table` | Bảng quản lý Sản phẩm, Đơn hàng trong Kênh Người Bán |
| **Biểu đồ (Charts)** | **Recharts** | `recharts` | Biểu đồ Doanh thu (Area/Bar), Thống kê đơn hàng ở Kênh Người Bán |
| **Slider / Carousel** | **Embla Carousel** | `embla-carousel-react` | Banner quảng cáo Trang chủ, Slider ảnh chi tiết sản phẩm |
| **Thông báo (Toast)** | **Sonner** | `sonner` | Toast thông báo khi "Thêm vào giỏ thành công", "Cập nhật thành công", "Báo lỗi" |
| **Hiệu ứng & Animation**| **Framer Motion** | `framer-motion` | Animation mở Drawer giỏ hàng, Banner trượt, Micro-interactions |
| **Trình soạn thảo văn bản**| **Tiptap** | `@tiptap/react` | Soạn thảo mô tả sản phẩm (Rich text, chèn ảnh) trong Kênh Người Bán |
| **Chọn ngày (Date Picker)**| **React Day Picker** | `react-day-picker` + `date-fns` | Lọc đơn hàng theo ngày, Chọn thời gian chạy Flash Sale / Voucher |
| **Form & Validation** | **React Hook Form + Zod** | `react-hook-form` `@hookform/resolvers` `zod` | Quản lý & Validate form (Đăng nhập, Thêm sản phẩm, Địa chỉ nhận hàng) |
| **Class Utilities** | **clsx & tailwind-merge**| `clsx` `tailwind-merge` | Hàm `cn()` gộp class Tailwind tiện lợi không bị trùng lặp |

---

## 4. QUY CHUẨN CẤU TRÚC PHÂN HỆ VÀ ROLE

- `app/(shop)/`: Toàn bộ giao diện dành cho Khách hàng & Người mua (URL: `/`).
- `app/(seller)/`: Toàn bộ giao diện Kênh Người Bán / Shop (URL: `/seller`).
- `components/shop/`: Component riêng cho giao diện Mua sắm (Header, Footer, Product Feed).
- `components/seller/`: Component riêng cho Kênh Người Bán (SellerSidebar, SellerTopbar).
- `components/ui/`: Thư viện Component gốc dùng chung (Button, Card, Input, Badge, Textarea...).
