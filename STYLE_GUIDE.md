# BẢNG QUY CHUẨN GIAO DIỆN & THƯ VIỆN UI (STYLE GUIDE & UI LIBRARIES)
## Dự án: Sàn Thương Mại Điện Tử Hiện Đại (Modern & Vibrant E-Commerce Platform)

> **Mục tiêu:** Chuẩn hóa toàn diện ngôn ngữ thiết kế thương mại điện tử hiện đại, sống động, giàu tương tác, loại bỏ phong cách AI nhạt nhòa, đảm bảo trải nghiệm mua sắm hấp dẫn và tối ưu chuyển đổi 100% trên cả **Storefront** và **Seller Center**.

---

## 1. BẢNG MÀU THƯƠNG HIỆU & CHUYỂN ĐỔI (VIBRANT COLOR PALETTE - 60:30:10)

| Nhóm màu | Mã HEX | Tên màu | Ứng dụng cụ thể |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `#4F46E5` | **Electric Indigo** | Header, Tab đang chọn, Icon thương hiệu, Link active, Border focus |
| **Brand Hover** | `#4338CA` | **Deep Indigo** | Trạng thái hover của các nút thương hiệu / icon |
| **Brand Light** | `#EEF2FF` | **Soft Indigo** | Nền tab active, badge thương hiệu nhẹ |
| **CTA / Sale Accent** | `#FF5722` | **Sunset Coral** | **Nút "Mua ngay"**, Giá khuyến mãi, Đếm ngược Flash Sale, Tag Giảm giá |
| **CTA Flame** | `#FF3D00` | **Flame Red** | Nút hành động nổi bật, thanh tiến độ Flash Sale, biểu tượng lửa |
| **CTA Light** | `#FFF1EE` | **Peach Mist** | Nền nút "Thêm vào giỏ hàng", Nền tag mã giảm giá |
| **Perks / FreeShip** | `#10B981` | **Emerald Mint** | Tag "Freeship Extra", "Đã thanh toán", "Chính hãng 100%", Đơn thành công |
| **Rating / Star** | `#F59E0B` | **Amber Gold** | Ngôi sao đánh giá (Rating 5 sao), Huy hiệu Top bán chạy, Xu thưởng |
| **Danger / Alert** | `#EF4444` | **Rose Red** | Nút Hủy đơn hàng, Báo lỗi form, Xóa sản phẩm, Tag giảm giá sốc |
| **Surface Canvas** | `#F8FAFC` | **Soft Slate** | Nền toàn bộ trang web (dịu mắt, làm nổi bật thẻ sản phẩm trắng) |
| **Card / Glass** | `#FFFFFF` | **Pure White** | Nền Thẻ sản phẩm, Modal, Dropdown Menu, Form nhập liệu |
| **Surface Canvas** | `#EEF2F6` | **Cool Slate** | Nền toàn bộ trang web (Tương phản cao, làm nổi bật thẻ sản phẩm trắng 3D) |
| **Card / Glass** | `#FFFFFF` | **Pure White** | Nền Thẻ sản phẩm, Modal, Dropdown Menu, Form nhập liệu (Đổ bóng 3D) |
| **Text Primary** | `#0F172A` | **Deep Slate** | Tên sản phẩm, Tiêu đề chính (Tương phản cao chuẩn a11y) |
| **Text Secondary**| `#64748B` | **Muted Slate** | Số lượng đã bán, Tên shop, Mô tả ngắn, Thông số phụ |

---

## 2. NGUYÊN TẮC THIẾT KẾ SẢN PHẨM & TRẢI NGHIỆM MUA SẮM

1. **Hình ảnh sản phẩm:** Tuyệt đối không dùng hình xám tĩnh ("Ảnh 1:1"). Phải dùng ảnh sắc nét, tỉ lệ 1:1, hover zoom mượt mà (`group-hover:scale-105 transition-transform duration-300`).
2. **Hệ thống Badges đa dạng:**
   - Badge "Mall" (Đỏ rượu): Đảm bảo hàng chính hãng.
   - Badge "Freeship Xtra" (Xanh mint): Miễn phí vận chuyển.
   - Badge "-XX%" (Cam đỏ): Tỷ lệ giảm giá hấp dẫn.
3. **Thẻ sản phẩm chuẩn TMĐT:**
   - Tiêu đề sản phẩm giới hạn 2 dòng `line-clamp-2`.
   - Cụm giá gồm Giá Sale nổi bật + Giá gốc gạch ngang.
   - Đánh giá sao vàng + Số lượng đã bán (*"Đã bán 1.5k"*).
   - Địa điểm xuất kho (*"Hà Nội"*, *"TP. Hồ Chí Minh"*).
4. **Hiệu ứng Thẻ:** Nâng nhẹ khi hover (`hover:-translate-y-1 hover:shadow-xl`), đổ bóng mềm mại có chiều sâu.

---

## 3. QUY CHUẨN RESPONSIVE 100% (MOBILE-FIRST)

| Thiết bị | Breakpoint | Quy tắc hiển thị |
| :--- | :--- | :--- |
| **Mobile** | `< 640px` | Lưới 2 cột (`grid-cols-2 gap-2.5`), Sidebar dạng Drawer trượt, Header gọn gàng |
| **Tablet** | `sm: 640px - md: 768px` | Lưới 3-4 cột, Table cuộn ngang `overflow-x-auto` |
| **Desktop** | `lg: 1024px - xl: 1280px`| Container căn giữa `max-w-7xl mx-auto`, Lưới 4-6 cột thoáng đãng |

---

## 4. DANH SÁCH THƯ VIỆN CHỈ ĐỊNH
- **Icons:** `lucide-react`
- **Primitives:** Radix UI / shadcn/ui
- **Table:** `@tanstack/react-table`
- **Charts:** `recharts`
- **Carousel:** `embla-carousel-react`
- **Toast:** `sonner`
- **Form:** `react-hook-form` + `zod`
- **Utils:** `clsx` & `tailwind-merge` (`cn()`)
