import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  User,
  LayoutDashboard,
  Home,
  Compass,
  Sparkles,
  CreditCard,
  HelpCircle,
  LogOut,
  Shield,
  Globe,
  Instagram,
  Facebook,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Settings,
} from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const {
    user,
    wallet,
    lang,
    setLang,
    t,
    currentView,
    setCurrentView,
    dashboardTab,
    setDashboardTab,
    logout,
    openAdminAuthModal,
  } = useApp();

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;

  if (!isOpen) return null;

  const navigateTo = (view: string, tab?: string) => {
    setCurrentView(view);
    if (tab) {
      setDashboardTab(tab);
    }
    onClose();
  };

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Sliding in from Right for RTL, Left for LTR) */}
      <aside
        className={`relative z-10 w-[85%] max-w-sm h-full bg-[#FAF9F5] border-x border-[#E6DFD8] shadow-2xl flex flex-col justify-between overflow-y-auto transition-transform duration-300 ${
          isAr ? 'mr-auto' : 'ml-auto'
        }`}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#E6DFD8] flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#CC785C] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
              O
            </div>
            <span className="font-extrabold text-base tracking-tight text-[#141413]">
              ORVEX <span className="text-[#CC785C]">AI</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6C6A64] hover:text-[#141413] hover:bg-[#EFE9DE] transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-5 bg-gradient-to-b from-white/90 to-[#FAF9F5] border-b border-[#E6DFD8] space-y-4">
          <div className="flex items-center gap-3.5">
            {/* Circle Avatar (دائرة البروفايل) */}
            <div
              onClick={() => {
                if (user) navigateTo('dashboard', 'profile');
                else navigateTo('auth');
              }}
              className="relative w-14 h-14 rounded-full bg-[#CC785C]/15 border-2 border-[#CC785C] flex items-center justify-center cursor-pointer shadow-sm overflow-hidden shrink-0 group"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : user ? (
                <span className="text-base font-black text-[#CC785C]">{userInitials}</span>
              ) : (
                <User className="w-6 h-6 text-[#CC785C]" />
              )}
              {user && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#5DB8A6] border-2 border-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {user ? (
                <>
                  <h3 className="font-bold text-sm text-[#141413] truncate">{user.name}</h3>
                  <p className="text-xs text-[#6C6A64] truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-[#181715] text-[#E8A55A]'
                          : 'bg-[#5DB8A6]/15 text-[#5DB8A6]'
                      }`}
                    >
                      {user.role === 'admin'
                        ? isAr
                          ? 'مدير المنصة'
                          : 'Super Admin'
                        : isAr
                        ? 'صانع محتوى'
                        : 'Creator'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-sm text-[#141413]">
                    {isAr ? 'مرحباً بك' : 'Welcome'}
                  </h3>
                  <p className="text-xs text-[#6C6A64]">
                    {isAr ? 'سجل دخولك لبدء التحليلات' : 'Sign in to access analytics'}
                  </p>
                  <button
                    onClick={() => navigateTo('auth')}
                    className="mt-2 text-xs font-bold text-[#CC785C] hover:underline"
                  >
                    {isAr ? 'تسجيل الدخول عبر Google' : 'Sign In with Google'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Dual Wallet Summary for Logged-In User */}
          {user && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6DFD8]/80 text-xs">
              <div
                onClick={() => navigateTo('dashboard', 'wallets')}
                className="p-2.5 rounded-xl bg-white border border-[#E6DFD8] flex items-center gap-2 cursor-pointer hover:border-[#CC785C] transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#CC785C] shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] text-[#6C6A64] truncate">{t.dashboard.balanceIg}</div>
                  <div className="font-extrabold text-[#141413] tabular-nums">
                    {wallet?.instagramCredits || 0} {t.dashboard.trialsUnit}
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigateTo('dashboard', 'wallets')}
                className="p-2.5 rounded-xl bg-white border border-[#E6DFD8] flex items-center gap-2 cursor-pointer hover:border-[#1877F2] transition-colors"
              >
                <Facebook className="w-4 h-4 text-[#1877F2] shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] text-[#6C6A64] truncate">{t.dashboard.balanceFb}</div>
                  <div className="font-extrabold text-[#141413] tabular-nums">
                    {wallet?.facebookCredits || 0} {t.dashboard.trialsUnit}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="p-4 flex-1 space-y-1">
          <button
            onClick={() => navigateTo('home')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'home'
                ? 'bg-[#181715] text-[#FAF9F5]'
                : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-[#CC785C]" />
              <span>{t.nav.home}</span>
            </div>
            <ArrowIcon className="w-4 h-4 text-[#A09C94]" />
          </button>

          {user && (
            <button
              onClick={() => navigateTo('dashboard', 'overview')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                currentView === 'dashboard' && dashboardTab !== 'ya-ai'
                  ? 'bg-[#181715] text-[#FAF9F5]'
                  : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-[#5DB8A6]" />
                <span>{t.nav.dashboard}</span>
              </div>
              <ArrowIcon className="w-4 h-4 text-[#A09C94]" />
            </button>
          )}

          {user && (
            <button
              onClick={() => navigateTo('dashboard', 'ya-ai')}
              className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                currentView === 'dashboard' && dashboardTab === 'ya-ai'
                  ? 'bg-[#181715] text-[#FAF9F5]'
                  : 'text-[#3D3D3A] hover:bg-[#EFE9DE] bg-[#FAF0EA]/60 border border-[#CC785C]/25'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-[#CC785C] animate-pulse" />
                <span>{isAr ? 'شات الذكاء الاصطناعي' : 'YA ai Strategic Chat'}</span>
              </div>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#CC785C] text-white">
                YA ai
              </span>
            </button>
          )}

          <button
            onClick={() => navigateTo('how-it-works')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'how-it-works'
                ? 'bg-[#181715] text-[#FAF9F5]'
                : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-4 h-4 text-[#6C6A64]" />
              <span>{t.nav.howItWorks}</span>
            </div>
            <ArrowIcon className="w-4 h-4 text-[#A09C94]" />
          </button>

          <button
            onClick={() => navigateTo('features')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'features'
                ? 'bg-[#181715] text-[#FAF9F5]'
                : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#E8A55A]" />
              <span>{t.nav.features}</span>
            </div>
            <ArrowIcon className="w-4 h-4 text-[#A09C94]" />
          </button>

          <button
            onClick={() => navigateTo('pricing')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'pricing'
                ? 'bg-[#181715] text-[#FAF9F5]'
                : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-[#1877F2]" />
              <span>{t.nav.pricing}</span>
            </div>
            <ArrowIcon className="w-4 h-4 text-[#A09C94]" />
          </button>

          <button
            onClick={() => navigateTo('faq')}
            className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
              currentView === 'faq'
                ? 'bg-[#181715] text-[#FAF9F5]'
                : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-[#6C6A64]" />
              <span>{t.nav.faq}</span>
            </div>
            <ArrowIcon className="w-4 h-4 text-[#A09C94]" />
          </button>

          {/* Admin shortcut (Only for verified admin session) */}
          {user?.role === 'admin' && (
            <button
              onClick={() => navigateTo('admin')}
              className="w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer mt-2 bg-[#181715] text-[#FAF9F5] border border-[#35322D] shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#E8A55A]" />
                <span>{isAr ? 'لوحة تحكم الإدارة' : 'Admin Dashboard'}</span>
              </div>
              <ArrowIcon className="w-4 h-4 text-[#E8A55A]" />
            </button>
          )}
        </div>

        {/* Footer Area: Language Toggle + Logout */}
        <div className="p-4 border-t border-[#E6DFD8] bg-white/70 space-y-2">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="w-full py-2.5 px-3 rounded-xl border border-[#E6DFD8] bg-[#FAF9F5] hover:bg-[#EFE9DE] text-xs font-semibold text-[#141413] flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#6C6A64]" />
              <span>{isAr ? 'اللغة الحالية: العربية' : 'Current Language: English'}</span>
            </div>
            <span className="text-[11px] text-[#CC785C] font-bold">
              {isAr ? 'English' : 'العربية'}
            </span>
          </button>

          {/* Logout button (inside the drawer where it's clean and accessible) */}
          {user ? (
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-[#C64545] hover:bg-[#C64545]/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.nav.logout}</span>
            </button>
          ) : (
            <button
              onClick={() => navigateTo('auth')}
              className="w-full py-2.5 px-3 rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>{t.nav.getStarted}</span>
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};
