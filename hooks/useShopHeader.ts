import { useEffect, useRef, useState } from "react";

import { useMounted } from "@/lib/hooks";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useLogoutMutation } from "@/lib/redux/services/auth-api";
import { clearUser } from "@/lib/redux/slices/auth-slice";

// Quản lý state, quyền truy cập và side-effect của header mua sắm.
export function useShopHeader() {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthChecking = useAppSelector((state) => state.auth.isCheckingAuth);

  // Kiểm tra quyền mở kênh quản lý dành riêng cho người bán.
  const canAccessSellerChannel = user?.role.includes("ROLE_SHOP") ?? false;

  // Gọi API logout và xóa thông tin user khỏi Redux sau khi thành công.
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUser());
      setIsAccountMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch(e) {
      throw Error("lỗi khi khi server logout "+e)
    }
  };

  // Đóng dropdown tài khoản khi người dùng bấm ra bên ngoài.
  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isAccountMenuOpen]);

  // Khóa cuộn trang khi drawer menu trên mobile đang mở.
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return {
    accountMenuRef,
    authModalTab,
    canAccessSellerChannel,
    closeMenu: () => setIsMobileMenuOpen(false),
    isAccountMenuOpen,
    isAuthChecking,
    isAuthModalOpen,
    isMobileMenuOpen,
    isLogoutLoading,
    mounted,
    openMenu: () => setIsMobileMenuOpen(true),
    searchQuery,
    setAuthModalTab,
    setIsAccountMenuOpen,
    setIsAuthModalOpen,
    setSearchQuery,
    handleLogout,
    user,
  };
}
