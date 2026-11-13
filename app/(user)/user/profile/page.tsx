import type { Metadata } from "next";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { ProfileView } from "@/components/user/profile/ProfileView";
import { getMyProfile } from "@/lib/service/userService";
import type { UserProfile } from "@/types/user/profile";

export const metadata: Metadata = {
  title: "Thông tin cá nhân | ModernShop",
};

// Trang thông tin cá nhân, tải hồ sơ trên server; lỗi thì view hiện nút thử lại.
export default async function ProfilePage() {
  let profile: UserProfile | null = null;

  try {
    profile = await getMyProfile();
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }

  return <ProfileView profile={profile} />;
}
