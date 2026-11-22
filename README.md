# E-commerce Platform — FE người dùng

Giao diện người mua và chủ shop, viết bằng Next.js 16 (App Router), React 19, Tailwind CSS 4. Ứng dụng chạy phía server: đọc cookie httpOnly, gọi Gateway qua `BACKEND_API_URL`, nên cần Node.js khi chạy, không host được như trang tĩnh.

## Yêu cầu

- Backend (Gateway) đang chạy, mặc định tại `http://localhost:8080`. Xem repo `E-commerce-platform-microservice`.
- Chạy local: Node.js 20.9 trở lên (khuyên dùng 22) và pnpm 11.25.0.
- Chạy bằng Docker: chỉ cần Docker, không cần cài Node hay pnpm.

## Biến môi trường

Mẫu đầy đủ nằm trong `.env.example`.

| Biến | Đọc lúc | Ý nghĩa |
|------|---------|---------|
| `BACKEND_API_URL` | chạy (server) | URL Gateway mà server Next gọi tới |
| `BACKEND_PUBLIC_URL` | chạy (server) | URL Gateway trình duyệt truy cập được, dùng cho đăng nhập Google; mặc định bằng `BACKEND_API_URL` |
| `AUTH_ROLE_COOKIE_SECRET` | chạy (server) | Secret ký cookie quyền, tối thiểu 32 ký tự |
| `ACCESS_TOKEN_COOKIE_NAME`, `REFRESH_TOKEN_COOKIE_NAME`, `ROLE_COOKIE_NAME` | chạy (server) | Tên cookie; có giá trị mặc định nếu bỏ trống |
| `AUTH_COOKIE_SECURE` | chạy (server) | Mặc định `true`: cookie đăng nhập có cờ `Secure`. Đặt `false` khi mở FE qua HTTP bằng địa chỉ khác `localhost` (IP LAN, tên máy); nếu không, trình duyệt bỏ cookie và không giữ được phiên đăng nhập |
| `NEXT_PUBLIC_CHAT_WS_URL` | build (local) / chạy (Docker) | URL WebSocket của Gateway cho trình duyệt. Chạy local thì được nhúng lúc `pnpm build`; image Docker thay giá trị khi container khởi động |

## Chạy local

Sau khi clone, repo chưa có `node_modules` và `.env`, cần cài trước:

```sh
git clone https://github.com/quang10122003/E-commerce-platform-microservice-FE.git
cd E-commerce-platform-microservice-FE

corepack enable          # hoặc: npm install -g pnpm@11.25.0
pnpm install

cp .env.example .env     # PowerShell: Copy-Item .env.example .env
```

Sửa `.env` cho đúng địa chỉ Gateway và đặt `AUTH_ROLE_COOKIE_SECRET` riêng, rồi:

```sh
pnpm dev                 # chế độ phát triển, http://localhost:3000
```

Chạy bản production trên máy:

```sh
pnpm build
pnpm start               # http://localhost:3000
```

## Chạy bằng Docker

`Dockerfile` tự cài dependency và build bên trong image, nên clone về là build được ngay, không cần `pnpm install` trước. `.dockerignore` loại `node_modules`, `.next` và `.env*` khỏi build context.

Docker dùng chung file `.env` với `pnpm dev`, không cần file env riêng.

**1. Chạy backend trước** bằng Docker (`docker compose up -d --build` trong repo `E-commerce-platform-microservice`). Backend tạo mạng `ecommerce-net` mà FE sẽ tham gia.

**2. Chuẩn bị `.env`** như phần chạy local, giữ nguyên `localhost:8080`. `docker-compose.yml` tự ghi đè hai biến cho môi trường Docker:

- `BACKEND_API_URL=http://gateway:8080`: server Next gọi thẳng Gateway trong mạng Docker, không vòng qua cổng của máy host (cách vòng qua `host.docker.internal` bị nghẽn kết nối khi nhiều người dùng).
- `BACKEND_PUBLIC_URL=http://localhost:8080`: trình duyệt dùng URL này khi chuyển sang đăng nhập Google.

**3. Build và chạy:**

```sh
docker compose up -d --build
```

Mở `http://localhost:3000`.

Lưu ý:

- Mọi biến, kể cả `NEXT_PUBLIC_CHAT_WS_URL`, đều đọc khi container khởi động. Đổi `.env` chỉ cần `docker compose up -d` lại, không phải build lại image.
- Cảnh báo `network ecommerce-net ... was not created for project` là bình thường: mạng do backend tạo, FE chỉ dùng chung.
- Container giới hạn 1 GB RAM để FE không chiếm hết bộ nhớ của máy khi tải cao.
- Xem log: `docker compose logs -f`. Dừng: `docker compose down`.
