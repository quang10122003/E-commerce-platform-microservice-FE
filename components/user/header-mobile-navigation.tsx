import Link from "next/link";
import { ChevronRight, HelpCircle, Package, Settings, User } from "lucide-react";

export function HeaderMobileNavigation({ closeMenu }: { closeMenu: () => void }) {
  return (
    <>
                {/* Navigation Links */}
                <nav className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Chức Năng Nổi Bật
                  </p>

                  {/* Liên kết tài khoản và cài đặt cá nhân. */}
                  <Link
                    href="/user/profile"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors border border-surface-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-primary flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">Tài khoản của tôi</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/user/settings"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors border border-surface-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">Cài đặt</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  {/* Đơn mua của tôi */}
                  <Link
                    href="/user/orders"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors border border-surface-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold block leading-tight">Đơn Mua</span>
                        <span className="text-[10px] text-muted-foreground">Theo dõi hành trình đơn</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  {/* Trợ giúp */}
                  <Link
                    href="/help"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Trung Tâm Trợ Giúp</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </nav>
    </>
  );
}
