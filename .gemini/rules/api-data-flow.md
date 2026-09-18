# QUY CHUẨN KIẾN TRÚC GỌI API & QUẢN LÝ TOKEN

## 1. Luồng gọi API

- Server Component hoặc server service gọi trực tiếp serverFetch từ lib/api/server-client.
- Client Component và Redux chỉ gọi BFF nội bộ qua /api/....
- Route Handler tại app/api/[...path]/route.ts gọi trực tiếp serverFetch để chuyển tiếp request đến backend.
- Không gọi backend trực tiếp từ Client Component, Redux service hoặc Route Handler.

Luồng chuẩn:

[Server Component / server service] ---> serverFetch() ---> [Backend Microservices]

[Client Component / Redux] ---> /api/... ---> [Route Handler] ---> serverFetch() ---> [Backend Microservices]

## 2. Trách nhiệm duy nhất của serverFetch

serverFetch là base orchestrator duy nhất cho mọi request phía server. Hàm này chịu trách nhiệm:

- Chuẩn hóa endpoint và tạo URL backend.
- Tự quyết định endpoint public/private dựa trên PUBLIC_ENDPOINTS.
- Với private endpoint, tự đọc access token từ cookie httpOnly và gắn Authorization.
- Khi private request nhận 401, tự đọc refresh token, gọi refresh và retry request một lần.
- Lưu token mới hoặc xóa session khi refresh thất bại.
- Xử lý lifecycle đặc biệt của login, register và logout.
- Parse response về ApiResponse<T> thống nhất.

Không tạo authenticatedRequest, loginRequest, registerRequest, logoutRequest hoặc request-strategies riêng. Không gọi fetch backend ngoài serverFetch.

## 3. Chính sách public/private

- Danh sách endpoint public duy nhất nằm trong PUBLIC_ENDPOINTS tại lib/api/public-endpoints.
- Endpoint không nằm trong PUBLIC_ENDPOINTS mặc định là private.
- Caller không tự quyết định public/private và không tự gắn Authorization.
- skipAuth chỉ dùng bên trong serverFetch cho flow nội bộ như refresh token; không dùng để tạo wrapper nghiệp vụ riêng.
- AUTHORIZATION_HEADER là hằng số dùng chung trong lib/api/constants.

## 4. Quy tắc cho từng lớp

- Server Component: gọi serverFetch trực tiếp hoặc gọi server service chỉ có nhiệm vụ tổ chức dữ liệu; server service vẫn phải gọi serverFetch.
- Route Handler: chỉ nhận request, tạo options và gọi serverFetch; không chứa logic auth hoặc strategy endpoint.
- Redux/Client service: gọi URL BFF /api/... bằng RTK Query; không đọc cookie và không gọi backend trực tiếp.
- Component UI: không gọi API; nhận dữ liệu qua props hoặc custom hook theo đúng ranh giới Server/Client.
- Không tạo wrapper auth hoặc helper fetch mới nếu chỉ chuyển tiếp sang serverFetch.

## 5. Bảo mật token

- Không lưu access_token hoặc refresh_token trong Redux state, localStorage hoặc client state.
- Token chỉ được quản lý qua cookie httpOnly và serverFetch.
- Không truyền token từ Client Component xuống props.