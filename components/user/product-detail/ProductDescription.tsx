"use client";

import { useState } from "react";

// Nội dung mô tả chi tiết sản phẩm cứng, chia thành các mục rõ ràng.
const DESCRIPTION_SECTIONS = [
  {
    title: "Tổng quan sản phẩm",
    content:
      "Đồng hồ thông minh cao cấp thế hệ mới với thiết kế tinh tế, mặt kính sapphire cứng cáp và khung titanium nguyên khối. Tích hợp công nghệ theo dõi sức khỏe toàn diện 24/7, màn hình AMOLED siêu nét, pin bền bỉ đến 7 ngày sử dụng liên tục.",
  },
  {
    title: "Thông số kỹ thuật",
    content: [
      "Màn hình: AMOLED 1.9 inch, 410 x 502 px, 326 PPI",
      "Chất liệu: Khung Titanium Grade 5, Kính Sapphire Crystal",
      "Kết nối: Bluetooth 5.3, WiFi 802.11 b/g/n, GPS tích hợp",
      "Cảm biến: Nhịp tim, SpO2, nhiệt độ cơ thể, ECG",
      "Pin: 300mAh – lên đến 7 ngày, sạc không dây 5W",
      "Kháng nước: 5ATM (50m) và IP68",
      "Tương thích: iOS 14+, Android 8.0+",
    ],
  },
  {
    title: "Chế độ tập luyện",
    content:
      "Hỗ trợ hơn 120 chế độ tập luyện gồm chạy bộ ngoài trời, đạp xe, bơi lội, yoga, leo núi và nhiều hơn nữa. Tự động nhận diện 8 hoạt động phổ biến nhất không cần bấm nút.",
  },
  {
    title: "Bảo hành và dịch vụ",
    content:
      "Bảo hành chính hãng 24 tháng, 1 đổi 1 trong 30 ngày nếu lỗi nhà sản xuất. Hệ thống bảo hành toàn quốc với hơn 200 trung tâm dịch vụ.",
  },
];

// Tab mô tả chi tiết sản phẩm với khả năng mở rộng / thu gọn nội dung.
export function ProductDescription() {
  // Trạng thái mở rộng toàn bộ mô tả dài, mặc định chỉ hiện phần tóm tắt.
  const [isExpanded, setIsExpanded] = useState(false);

  // Chỉ hiện 2 mục đầu khi thu gọn.
  const visibleSections = isExpanded ? DESCRIPTION_SECTIONS : DESCRIPTION_SECTIONS.slice(0, 2);

  return (
    <div className="space-y-5">
      <div className={`space-y-4 overflow-hidden transition-all duration-500 ${!isExpanded ? "max-h-[320px]" : "max-h-none"}`}>
        {visibleSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-sm font-bold text-main">{section.title}</h4>
            {/* Hiển thị dạng danh sách nếu nội dung là mảng, ngược lại hiển thị đoạn văn. */}
            {Array.isArray(section.content) ? (
              <ul className="space-y-1.5 text-sm leading-relaxed text-slate-600">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm leading-relaxed text-slate-600">{section.content}</p>
            )}
          </div>
        ))}
      </div>

      {/* Nút mở rộng / thu gọn mô tả. */}
      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary-light active:scale-95"
      >
        {isExpanded ? "Thu gọn mô tả" : "Xem đầy đủ mô tả sản phẩm"}
        <span className="text-lg leading-none">{isExpanded ? "↑" : "↓"}</span>
      </button>
    </div>
  );
}
