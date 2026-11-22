FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* bị nhúng vào bundle lúc build, nên build bằng placeholder rồi thay giá trị thật khi container khởi động.
ENV NEXT_PUBLIC_CHAT_WS_URL=__NEXT_PUBLIC_CHAT_WS_URL__ \
    NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
# Dùng chung .env với pnpm dev: localhost trong container là chính nó, nên server Next gọi Gateway qua host.docker.internal.
# BACKEND_PUBLIC_URL do trình duyệt dùng, nên giữ giá trị localhost gốc khi không khai báo riêng.
# shortcut: giá trị chứa ký tự | sẽ làm hỏng lệnh sed; chỉ cần sửa nếu URL có ký tự này.
CMD export BACKEND_PUBLIC_URL="${BACKEND_PUBLIC_URL:-$BACKEND_API_URL}"; \
    export BACKEND_API_URL="$(echo "$BACKEND_API_URL" | sed -E 's#//(localhost|127\.0\.0\.1)([:/]|$)#//host.docker.internal\2#')"; \
    grep -rl __NEXT_PUBLIC_CHAT_WS_URL__ .next | xargs -r sed -i "s|__NEXT_PUBLIC_CHAT_WS_URL__|$NEXT_PUBLIC_CHAT_WS_URL|g"; \
    exec node server.js
