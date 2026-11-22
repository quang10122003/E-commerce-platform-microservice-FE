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

**1. Chuẩn bị `.env`** như phần chạy local, giữ nguyên `localhost:8080`.

Trong container, `localhost` là chính container. Vì vậy khi khởi động, container tự đổi `localhost`/`127.0.0.1` trong `BACKEND_API_URL` thành `host.docker.internal` để server Next gọi được Gateway trên máy host. `BACKEND_PUBLIC_URL` và `NEXT_PUBLIC_CHAT_WS_URL` do trình duyệt dùng nên giữ nguyên `localhost`. Nếu không khai báo `BACKEND_PUBLIC_URL`, nó nhận giá trị `localhost` gốc của `BACKEND_API_URL`.

**2. Build image** (không cần tham số):

```sh
docker build -t ecommerce-fe .
```

**3. Chạy container** với file env:

```sh
docker run -d --name ecommerce-fe -p 3000:3000 --env-file .env ecommerce-fe
```

Mở `http://localhost:3000`.

Lưu ý:

- Trên Linux (không có Docker Desktop), thêm `--add-host=host.docker.internal:host-gateway` vào lệnh `docker run`.
- Gateway chạy trong cùng mạng Docker thì đặt `BACKEND_API_URL` theo tên service, ví dụ `http://gateway:8080`, và thêm `--network <tên mạng>` khi chạy; giá trị không phải `localhost` được giữ nguyên.
- Mọi biến, kể cả `NEXT_PUBLIC_CHAT_WS_URL`, đều đọc khi container khởi động. Đổi `.env` chỉ cần `docker rm -f ecommerce-fe` rồi `docker run` lại, không phải build lại image.
- Xem log: `docker logs -f ecommerce-fe`. Dừng: `docker rm -f ecommerce-fe`.
