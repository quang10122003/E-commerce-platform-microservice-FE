# QUY CHUẨN KIẾN TRÚC GỌI API & QUẢN LÝ TOKEN (DATA FETCHING & API RULES)

Mọi tác vụ phát triển tính năng, gọi API hoặc xử lý dữ liệu bắt buộc tuân thủ đúng 2 luồng chuẩn sau:

---

## 1. LUỒNG GỌI DỮ LIỆU (DATA FETCHING FLOWS)

### Luồng 1: Server Components (RSC)
* **Cách gọi:** Sử dụng trực tiếp `serverFetch` từ `@/lib/api/server-client`.
* **Cơ chế:**
  - `serverFetch` chạy trên Server (được bảo vệ bởi `import "server-only"`).
  - Nhận `accessToken`, `skipAuth` và interceptor qua options; không tự chứa logic nghiệp vụ auth.
  - Wrapper auth đọc token từ cookie `httpOnly`, cấu hình hook và tiếp tục gọi qua `serverFetch`.

```
[Server Component (RSC)] ---> serverFetch() ---> [Backend Microservices]
                         hoặc wrapper auth cấu hình hook
```

---

### Luồng 2: Client Components (Redux Toolkit Query / Client Hooks)
* **Cách gọi:** 
  - Redux Toolkit Query / RTK Query / Client fetch gửi request đến Next.js Route Handler nội bộ (BFF) qua URL `/api/...` (ví dụ: `/api/auth/login`, `/api/products`).
* **Cơ chế:** 
  - Client gọi đến `/api/[...path]` (`app/api/[...path]/route.ts`).
  - Route Handler nhận request và chuyển tiếp qua `serverFetch` hoặc wrapper gọi `serverFetch`.
  - Wrapper auth xử lý token cookie và hook đặc biệt trước khi `serverFetch` gửi request đến Backend Microservices.
  - Kết quả từ Backend được trả ngược về cho Client.

```
[Client Component / RTK Query] 
             |
             v
   [Next.js Route Handler] (/api/[...path]/route.ts)
             |
             v
        serverFetch() (server-side, nhận token và hook từ caller)
             |
             v
   [Backend Microservices]
```

---

## 2. NGUYÊN TẮC BẢO MẬT & QUẢN LÝ TOKEN
1. **Mảng PUBLIC_ENDPOINTS:** Trong `@/lib/api/public-endpoints`, mảng string `PUBLIC_ENDPOINTS` chứa danh sách các endpoint công khai. Caller kiểm tra danh sách và truyền `skipAuth: true`; `serverFetch` không đọc cookie và không đính kèm header `Authorization` khi option này được bật.
2. **Tuyệt đối không lưu Token ở Client State/LocalStorage:** Toàn bộ `access_token` và `refresh_token` phải được bảo vệ trong cookie `httpOnly`.
3. **Không tạo hàm wrapper dư thừa:** Không viết các hàm gọi API phân mảnh/thừa thãi. Mọi tương tác gọi backend từ phía server đều quy về `serverFetch`.
4. **Phân tách rõ ràng:**
   - Server Component: `serverFetch`
   - Client Component / Redux: RTK Query -> `/api/...` proxy route -> `serverFetch`

## 3. NGOẠI LỆ TRONG serverFetch
- Mọi API backend phải đi qua `serverFetch`; Route Handler không được gọi backend trực tiếp.
- `serverFetch` là luồng generic dùng chung, không chèn business logic riêng cho từng endpoint.
- Nếu API có flow đặc biệt, tách flow đó thành wrapper/helper riêng, truyền hook vào `serverFetch` và không thêm endpoint-specific logic vào core.

