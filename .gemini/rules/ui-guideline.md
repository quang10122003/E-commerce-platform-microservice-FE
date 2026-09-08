# QUY CHUẨN THIẾT KẾ GIAO DIỆN HIỆN ĐẠI, SỐNG ĐỘNG (ANTI-AI-BLAND UI RULES)

Mọi tác vụ thiết kế, tạo mới hoặc chỉnh sửa giao diện người dùng (UI Components, Layouts, Pages) **BẮT BUỘC** phải tuân thủ nghiêm ngặt các nguyên tắc sau để đảm bảo giao diện luôn **sống động, có chiều sâu, tính thương mại cao và loại bỏ hoàn toàn phong cách AI nhạt nhòa**:

---

## 1. 🚫 LOẠI BỎ TRIỆT ĐỂ PHONG CÁCH "AI GENERIC" (ANTI-BLAND RULES)

1. **TUYỆT ĐỐI KHÔNG dùng placeholder tĩnh xám xịt ("Ảnh 1:1", khung xám trơn, thẻ phẳng lì):**
   - Luôn sử dụng hình ảnh sản phẩm thực tế, chất lượng cao, đúng ngữ cảnh (sử dụng ảnh Unsplash chuẩn e-commerce có chọn lọc với aspect ratio chuẩn 1:1, ảnh rõ nét, ánh sáng đẹp).
2. **KHÔNG dùng bảng màu đơn điệu, xám xịt:**
   - Kết hợp bảng màu rực rỡ với tỷ lệ 60-30-10: Nền Slate tinh tế (`#F8FAFC`), Brand Electric Indigo (`#4F46E5`), Điểm nhấn mua sắm Sunset Coral / Flame (`#FF5722` / `#FF4500`), Freeship Emerald (`#10B981`), Amber Rating (`#F59E0B`).
   - Sử dụng gradient nhẹ nhàng, có chủ đích (`bg-gradient-to-br from-orange-500 to-rose-500`, `bg-gradient-to-r from-primary to-indigo-600`) cho các vùng kêu gọi hành động (CTA, Flash Sale, Voucher).
3. **CHIỀU SÂU THỊ GIÁC & LAYER (Depth & Glassmorphism):**
   - Sử dụng shadow đa tầng (`shadow-card`, `shadow-glow-cta`, `shadow-lg`) kết hợp với border mảnh mờ (`border-slate-100/80` hoặc `border-white/20`).
   - Ứng dụng hiệu ứng kính mờ (`backdrop-blur-md bg-white/90`) cho Header, Navigation Drawer, Floating Bar.
2. **BẢNG MÀU TƯƠNG PHẢN RÕ RỆT (60-30-10 & 3D CONTRAST):**
   - **Nền trang (Page Canvas):** `#EEF2F6` (Slate-100 / Cool-Gray) tạo độ tương phản rõ rệt giúp các thẻ card trắng `#FFFFFF` nổi khối 3D rõ nét, không bị chìm hoặc lẫn vào nền.
   - **Thẻ Card / Panels:** `#FFFFFF` thuần trắng kết hợp với border mảnh sắc nét `border-slate-200/90` và shadow 3 tầng (`shadow-card`, `shadow-3d`, `shadow-3d-hover`).
   - **Brand Electric Indigo:** `#4F46E5`
   - **Điểm nhấn mua sắm Sunset Coral / Flame:** `#FF5722` / `#FF3D00`
   - **Freeship Emerald:** `#10B981`
   - **Amber Rating:** `#F59E0B`

3. **CHIỀU SÂU THỊ GIÁC & NỔI KHỐI 3D (3D Elevation & Shadows):**
   - Mọi Card, Box, Panel, Modal bắt buộc phải có hiệu ứng đổ bóng đa tầng (`shadow-card` hoặc `shadow-3d`) để tách biệt hoàn toàn khỏi nền trang.
   - Hiệu ứng hover nổi khối 3D: `hover:-translate-y-1.5 hover:shadow-3d-hover transition-all duration-300`.
   - Ứng dụng hiệu ứng kính mờ (`glass-header`: `backdrop-blur-md bg-white/95`) cho Header và Navigation.

---

## 2. 🛍️ BẢN SẮC SÀN THƯƠNG MẠI ĐIỆN TỬ CHÂN THỰC (E-COMMERCE REALISM)

Mỗi thẻ sản phẩm và khối hiển thị bắt buộc phải có đầy đủ các yếu tố chân thực của sàn TMĐT hàng đầu:
1. **Hệ thống nhãn mác (Badges đa tầng):**
   - **Mall / Yêu Thích+:** Đỏ đô / Đỏ cam nổi bật góc trên (`bg-gradient-to-r from-red-600 to-rose-600 text-white`).
   - **Freeship Xtra / Hoàn Xu:** Xanh ngọc mint (`bg-emerald-50 text-emerald-700 border-emerald-200`).
   - **Giảm giá:** Tag phần trăm giảm đỏ cam (`-45%`).
2. **Thông tin giá và ưu đãi:**
   - Giá khuyến mãi to đậm, màu cam đỏ CTA (`text-cta font-bold text-base sm:text-lg`).
   - Giá gốc gạch ngang mờ (`line-through text-xs text-muted-foreground`).
3. **Độ tin cậy & Tương tác xã hội:**
   - Đánh giá sao vàng rực (`⭐ 4.9`), số lượng đã bán thực tế (*"Đã bán 1.2k"*, *"Đã bán 850"*).
   - Địa điểm xuất kho (*"Hà Nội"*, *"TP. Hồ Chí Minh"*).
4. **Flash Sale lôi cuốn:**
   - Đồng hồ đếm ngược động (Countdown ticker).
   - Thanh tiến độ bán hàng gradient có hiệu ứng lửa cháy (*"ĐANG BÁN CHẠY"*, *"SẮP CHÁY HÀNG"*).

---

## 3. 📱 RESPONSIVE 100% & MICRO-INTERACTIONS

1. **Hiệu ứng Micro-interactions mượt mà:**
   - Card sản phẩm khi hover: nâng nhẹ `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`, ảnh zoom nhẹ `group-hover:scale-105`.
   - Nút bấm (Button): active scale `active:scale-95`, hiệu ứng phát sáng nhẹ khi hover.
2. **Breakpoints bắt buộc:**
   - **Mobile (< 640px):** Lưới 2 cột (`grid-cols-2 gap-2.5`), Sidebar ẩn vào Drawer, nút tối thiểu 36-40px.
   - **Tablet (640px - 1024px):** Lưới 3-4 cột, Table `overflow-x-auto`.
   - **Desktop (1024px+):** Container `max-w-7xl mx-auto`, Lưới 4-6 cột, thoáng đãng, hiệu ứng hoàn chỉnh.

---

## 4. 🎨 DANH MỤC THƯ VIỆN ĐƯỢC PHÉP DÙNG
- Icons: `lucide-react`
- UI Components: Radix UI / Shadcn UI
- Biểu đồ: `recharts`
- Bảng: `@tanstack/react-table`
- Toast: `sonner`
- Slider: `embla-carousel-react`
- Form: `react-hook-form` + `zod`
