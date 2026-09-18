# FE Coding Rules

## Ranh giới Server và Client Component

- Mặc định sử dụng Server Component cho page, layout và UI không cần tương tác; chỉ dùng Client Component khi bắt buộc bởi state, event handler, hook phía client hoặc Web API. Đẩy ranh giới Client xuống component lá nhỏ nhất có thể.

Các quy tắc này áp dụng cho toàn bộ mã nguồn frontend:

1. Component chỉ chịu trách nhiệm render UI, nhận dữ liệu qua props hoặc một custom hook.
2. Không viết fetch API, xử lý business logic hoặc side-effect phức tạp trực tiếp trong component.
3. Mọi logic state và side-effect phải đặt trong custom hook (`hooks/useXxx.ts`).
4. Mọi lời gọi API phải đặt trong `services/`, không gọi trực tiếp trong hook UI hoặc component.
5. Business logic (transform, validate, calculate) phải là pure function trong `utils/`, có thể unit test riêng.
6. Không được import trực tiếp global store vào component UI, phải qua hook trung gian.
7. Nếu component vượt quá khoảng 150 dòng hoặc xử lý nhiều hơn một trách nhiệm, phải tách nhỏ.
8. Đặt tên rõ ràng theo vai trò: `*View`/`*Component` cho UI, `use*.ts` cho logic, `*Service.ts` cho API, `*.utils.ts` cho pure logic.
9. Trước khi viết code, xác định rõ đây là UI, logic hay service rồi đặt đúng file/thư mục.
10. Ưu tiên composition: component cha gọi nhiều component con nhỏ kết hợp với hook, thay vì một file lớn xử lý toàn bộ.
11. Khi hiển thị hình ảnh, bắt buộc ưu tiên dùng `Image` từ `next/image`; không dùng trực tiếp thẻ `<img>` trong component UI.

## Quy tắc quản lý form

12. Ưu tiên sử dụng `react-hook-form` cho mọi form có submit hoặc validation.
13. Khai báo type dữ liệu form rõ ràng, đặt validation theo từng field và hiển thị lỗi ngay tại field tương ứng.
14. Logic submit, gọi mutation/API và side-effect phải nằm trong custom hook; component chỉ render form và nhận handler từ hook.
15. Không dùng `useState` để quản lý giá trị, lỗi hoặc trạng thái submit của form nếu `react-hook-form` có thể đảm nhiệm.
16. Không chuyển input tìm kiếm tức thời, bộ lọc hoặc điều khiển UI sang form nếu không có submit/validation thực sự.
