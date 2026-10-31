import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { AUTH_COOKIE_NAMES, TIME } from "@/lib/constants";
import type { AccessTokenValidationResponse, UserRole } from "@/types/shared/auth";

export const ROLE_COOKIE_NAME = process.env.ROLE_COOKIE_NAME ?? AUTH_COOKIE_NAMES.ROLE;
const ROLE_COOKIE_TTL_MS = 15 * TIME.MINUTE_MS;
const USER_ROLES: UserRole[] = ["ROLE_USER", "ROLE_SHOP", "ROLE_ADMIN"];

type RoleSession = Pick<AccessTokenValidationResponse, "userId" | "role"> & {
  tokenHash: string;
  expiresAt: number;
};

// Chữ ký dùng secret riêng phía server, không dùng token người dùng làm khóa ký.
function getSigningSecret() {
  const secret = process.env.AUTH_ROLE_COOKIE_SECRET;
  if (!secret || secret.length < 32) throw new Error("AUTH_ROLE_COOKIE_SECRET phải có ít nhất 32 ký tự.");
  return secret;
}

// Ràng buộc quyền với đúng access token để cookie cũ không dùng được cho phiên khác.
function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Cookie quyền không sống lâu hơn access token; token opaque dùng TTL ngắn dự phòng.
function getExpiresAt(accessToken: string) {
  const fallback = Date.now() + ROLE_COOKIE_TTL_MS;
  try {
    const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64url").toString()) as { exp?: number };
    return typeof payload.exp === "number" && Number.isFinite(payload.exp)
      ? Math.min(fallback, payload.exp * 1_000) : fallback;
  } catch {
    return fallback;
  }
}

// Chỉ ký thông tin quyền lấy từ response xác thực thành công của backend.
export function createRoleCookie(user: Pick<AccessTokenValidationResponse, "userId" | "role">, accessToken: string) {
  if (!Number.isSafeInteger(user.userId) || user.userId <= 0 || !Array.isArray(user.role)
    || !user.role.every((role) => USER_ROLES.includes(role))) {
    throw new Error("Backend trả thông tin quyền không hợp lệ.");
  }
  const session: RoleSession = { userId: user.userId, role: user.role, tokenHash: hashToken(accessToken), expiresAt: getExpiresAt(accessToken) };
  const data = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", getSigningSecret()).update(data).digest("base64url");
  return `${data}.${signature}`;
}

// Cho phép đọc bản hết hạn chỉ để chuyển quyền đã ký sang token vừa refresh.
export function readRoleCookie(value: string | undefined, accessToken: string | undefined, allowExpired = false): RoleSession | undefined {
  if (!value || !accessToken) return undefined;
  const parts = value.split(".");
  if (parts.length !== 2) return undefined;
  const [data, signature] = parts;
  const expected = createHmac("sha256", getSigningSecret()).update(data).digest();
  const received = Buffer.from(signature, "base64url");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return undefined;
  try {
    const session = JSON.parse(Buffer.from(data, "base64url").toString()) as RoleSession;
    if (!Number.isSafeInteger(session.userId) || session.userId <= 0 || !Array.isArray(session.role)
      || !session.role.every((role) => USER_ROLES.includes(role)) || session.tokenHash !== hashToken(accessToken)
      || !Number.isFinite(session.expiresAt) || (!allowExpired && session.expiresAt <= Date.now())) return undefined;
    return session;
  } catch {
    return undefined;
  }
}
