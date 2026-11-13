"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, ChevronRight, Loader2, MessageSquare, Package, RefreshCw, Store } from "lucide-react";
import { useAvatarUpload } from "@/hooks/user/profile/useAvatarUpload";
import type { UserRole } from "@/types/shared/auth";
import type { UserProfile } from "@/types/user/profile";
import { ChangePasswordAction } from "./ChangePasswordAction";
import { ProfileInfoForm } from "./ProfileInfoForm";

const ROLE_LABELS: Record<UserRole, string> = { ROLE_USER: "Người mua", ROLE_SHOP: "Người bán", ROLE_ADMIN: "Quản trị viên" };

// Ảnh đại diện có nút đổi ảnh; chưa có ảnh thì hiện chữ cái đầu của tên.
function AvatarPicker({ profile }: { profile: UserProfile }) {
  const { avatarUrl, isUploading, changeAvatar } = useAvatarUpload(profile.avatarUrl);
  return (
    <div className="relative size-24 shrink-0">
      <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-full bg-primary text-3xl font-black text-white ring-4 ring-white shadow-md">
        {avatarUrl
          ? <Image src={avatarUrl} alt={`Ảnh đại diện của ${profile.fullName}`} fill unoptimized sizes="96px" className="object-cover" />
          : profile.fullName.trim().charAt(0).toUpperCase() || "U"}
        {isUploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/40" role="status" aria-label="Đang tải ảnh lên">
            <Loader2 className="size-6 animate-spin text-white" aria-hidden="true" />
          </span>
        )}
      </div>
      <label className="absolute -bottom-1 -right-1 flex size-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-cta text-white shadow transition hover:brightness-110 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cta/40">
        <Camera className="size-4" aria-hidden="true" />
        <span className="sr-only">Đổi ảnh đại diện</span>
        <input type="file" accept="image/*" className="sr-only" onChange={changeAvatar} disabled={isUploading} />
      </label>
    </div>
  );
}

// Trang thông tin cá nhân: ảnh đại diện, thông tin tài khoản và lối tắt; lỗi tải thì cho thử lại.
export function ProfileView({ profile }: { profile: UserProfile | null }) {
  const router = useRouter();
  const quickLinks = [
    { href: "/user/orders", label: "Đơn mua", icon: Package },
    { href: "/user/chat", label: "Tin nhắn", icon: MessageSquare },
    ...(profile?.roles.includes("ROLE_SHOP") ? [{ href: "/shop", label: "Kênh Người Bán", icon: Store }] : []),
  ];

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5">
      <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Thông tin cá nhân</h1>

      {!profile ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-600">Không thể tải thông tin cá nhân.</p>
          <button type="button" onClick={() => router.refresh()} className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary">
            <RefreshCw className="size-4" aria-hidden="true" /> Thử lại
          </button>
        </div>
      ) : (
        <>
          {/* Một khối liền nền gradient nhạt, avatar nằm trong khối thay vì đè lên dải màu. */}
          <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-primary-light via-white to-indigo-50/60" aria-label="Tổng quan tài khoản">
            <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
            <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <AvatarPicker profile={profile} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-black tracking-tight text-slate-900">{profile.fullName}</p>
                <p className="truncate text-sm text-slate-500">{profile.email}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.roles.map((role) => (
                    <span key={role} className="rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold text-primary">{ROLE_LABELS[role]}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-5 lg:grid-cols-3">
            <ProfileInfoForm profile={profile} />

            <section className="rounded-2xl border border-slate-200/90 bg-white p-4" aria-labelledby="quick-links-title">
              <h2 id="quick-links-title" className="px-2 pb-2 text-sm font-bold text-slate-900">Lối tắt</h2>
              <ul className="space-y-1">
                {quickLinks.map(({ href, label, icon: Icon }) => (
                  <li key={href}>
                    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-primary">
                      <Icon className="size-4 text-primary" aria-hidden="true" />
                      <span className="flex-1">{label}</span>
                      <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
                <li><ChangePasswordAction /></li>
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
