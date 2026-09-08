# QUY CHUẨN KIẾN TRÚC GỌI API & QUẢN LÝ TOKEN (DATA FETCHING & API RULES)

Mọi tác vụ phát triển tính năng, gọi API hoặc xử lý dữ liệu bắt buộc tuân thủ đúng 2 luồng chuẩn sau:

---

## 1. LUỒNG GỌI DỮ LIỆU (DATA FETCHING FLOWS)

### Luồng 1: Server Components (RSC)
* **Cách gọi:** Sử dụng trực tiếp `serverFetch` từ `@/lib/api/server-client`.
* **Cơ chế:** 
  - `serverFetch` chạy trên Server (được bảo vệ bởi `import "server-only"`).
  - Tự động đọc `access_token` từ cookie `httpOnly` (thông qua `next/headers`).
  - Gắn header `Authorization: Bearer <access_token>` (nếu không phải public endpoint) và gọi trực tiếp Backend (`BACKEND_API_URL`).

```
[Server Component (RSC)] ---> serverFetch() ---> [Backend Microservices]
                                  ^ (tự đọc httpOnly cookie)
```

---

### Luồng 2: Client Components (Redux Toolkit Query / Client Hooks)
* **Cách gọi:** 
  - Redux Toolkit Query / RTK Query / Client fetch gửi request đến Next.js Route Handler nội bộ (BFF) qua URL `/api/...` (ví dụ: `/api/auth/login`, `/api/products`).
* **Cơ chế:** 
  - Client gọi đến `/api/[...path]` (`app/api/[...path]/route.ts`).
  - Route Handler nhận request và chuyển tiếp qua `serverFetch`.
  - `serverFetch` xử lý đính kèm `access_token` từ `httpOnly` cookie và gửi đến Backend Microservices.
  - Kết quả từ Backend được trả ngược về cho Client.

```
[Client Component / RTK Query] 
             |
             v
   [Next.js Route Handler] (/api/[...path]/route.ts)
             |
             v
        serverFetch() (server-side, tự động tương tác với httpOnly cookie)
             |
             v
   [Backend Microservices]
```

---

## 2. NGUYÊN TẮC BẢO MẬT & QUẢN LÝ TOKEN
1. **Mảng PUBLIC_ENDPOINTS:** Trong `@/lib/api/server-client`, mảng string `PUBLIC_ENDPOINTS` chứa danh sách các endpoint công khai (ví dụ: `auth/login`, `auth/register`, v.v.). `serverFetch` sẽ kiểm tra danh sách này trước tiên: nếu thuộc public endpoint thì sẽ KHÔNG đọc cookie và KHÔNG đính kèm header `Authorization`.
2. **Tuyệt đối không lưu Token ở Client State/LocalStorage:** Toàn bộ `access_token` và `refresh_token` phải được bảo vệ trong cookie `httpOnly`.
3. **Không tạo hàm wrapper dư thừa:** Không viết các hàm gọi API phân mảnh/thừa thãi. Mọi tương tác gọi backend từ phía server đều quy về `serverFetch`.
4. **Phân tách rõ ràng:**
   - Server Component: `serverFetch`
   - Client Component / Redux: RTK Query -> `/api/...` proxy route -> `serverFetch`

