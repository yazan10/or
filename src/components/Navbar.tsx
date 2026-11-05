import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import {
  Globe,
  Shield,
  LayoutDashboard,
  Bell,
  Menu,
  User as UserIcon,
} from 'lucide-react';
import { MobileSidebar } from './MobileSidebar';

export const Navbar: React.FC = () => {
  const {
    user,
    lang,
    setLang,
    t,
    currentView,
    setCurrentView,
    setDashboardTab,
    openAdminAuthModal,
    showToast,
  } = useApp();

  const isAr = lang === 'ar';
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 6-Clicks Secret Access Tracker exclusively on Platform Logo Image Icon
  const [logoClicks, setLogoClicks] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);

    if (nextCount === 6) {
      // 6 Clicks reached on platform logo! Open Administrative Gate quietly
      setLogoClicks(0);
      openAdminAuthModal();
      return;
    }

    // Reset counter after 2.8s of inactivity
    clickTimeoutRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 2800);

    // Normal single click navigates home
    if (nextCount === 1) {
      setCurrentView('home');
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'how-it-works', label: t.nav.howItWorks },
    { id: 'features', label: t.nav.features },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'faq', label: t.nav.faq },
  ];

  const userInitials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E6DFD8] px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
          {/* Zone 1: Platform Brand Logo (6 clicks on the logo image icon triggers admin) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div
              onClick={handleLogoIconClick}
              className="flex items-center gap-2 sm:gap-2.5 text-left rtl:text-right group cursor-pointer focus:outline-none select-none relative"
              title="ORVEX AI"
            >
              <div className="relative w-8 h-8 rounded-lg bg-[#CC785C] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:bg-[#A9583E] transition-all transform group-active:scale-95">
                O
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#141413] whitespace-nowrap shrink-0 leading-tight">
                  ORVEX <span className="text-[#CC785C]">AI</span>
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs lg:text-sm font-medium text-[#6C6A64]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id)}
                className={`whitespace-nowrap shrink-0 hover:text-[#141413] transition-colors cursor-pointer ${
                  currentView === link.id
                    ? 'text-[#141413] font-bold border-b-2 border-[#CC785C] pb-0.5'
                    : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Actions (Notification + Language Switcher + دائرة بروفايلي + Mobile Hamburger) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Platform Notification Icon (Clean notifications indicator) */}
            <button
              onClick={() => showToast(isAr ? 'لا توجد إشعارات جديدة حالياً' : 'No new notifications at this time', 'info')}
              className="p-2 rounded-xl border border-[#E6DFD8] text-[#6C6A64] hover:text-[#141413] hover:bg-[#EFE9DE] transition-colors relative cursor-pointer"
              title={isAr ? 'الإشعارات' : 'Notifications'}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#5DB8A6]"></span>
            </button>

            {/* Language Switcher (Desktop and Tablet) */}
            <button
              onClick={toggleLanguage}
              className="hidden sm:flex px-2.5 py-1.5 text-xs font-medium rounded-xl border border-[#E6DFD8] text-[#3D3D3A] hover:bg-[#EFE9DE] transition-colors items-center gap-1.5 cursor-pointer"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#6C6A64]" />
              <span className="whitespace-nowrap font-semibold">
                {lang === 'ar' ? 'English' : 'العربية'}
              </span>
            </button>

            {/* Admin Badge (if logged in as admin) */}
            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'dashboard' : 'admin')}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-[#181715] hover:bg-[#252320] text-[#FAF9F5] border border-[#35322D] transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-xs"
              >
                <Shield className="w-3.5 h-3.5 text-[#E8A55A]" />
                <span className="hidden sm:inline">{isAr ? 'لوحة الإدارة' : 'Admin'}</span>
              </button>
            )}

            {/* Dashboard Quick Button (Desktop only) */}
            {user && (
              <button
                onClick={() => setCurrentView(currentView === 'dashboard' ? 'home' : 'dashboard')}
                className="hidden lg:flex px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#EFE9DE] hover:bg-[#E8E0D2] text-[#141413] border border-[#E6DFD8] transition-colors items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#CC785C]" />
                <span>{t.nav.dashboard}</span>
              </button>
            )}

            {/* Get Started button (Desktop only if guest) */}
            {!user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView('auth')}
                className="hidden sm:flex px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-[#CC785C] to-[#A9583E] hover:from-[#A9583E] hover:to-[#924732] text-white shadow-sm transition-all whitespace-nowrap cursor-pointer items-center gap-1 btn-shimmer"
              >
                <span>{t.nav.getStarted}</span>
              </motion.button>
            )}

            {/* دائرة بروفايلي (Profile Circle Avatar) */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                // On mobile: open mobile sidebar. On desktop: open dashboard profile tab or sidebar
                if (window.innerWidth < 768) {
                  setMobileSidebarOpen(true);
                } else if (user) {
                  setCurrentView('dashboard');
                  setDashboardTab('profile');
                } else {
                  setCurrentView('auth');
                }
              }}
              className="relative p-0.5 rounded-full border-2 border-[#CC785C]/40 hover:border-[#CC785C] transition-all cursor-pointer flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-[#CC785C]/40 group shadow-2xs hover:shadow-[0_0_12px_rgba(204,120,92,0.35)]"
              title={
                user
                  ? isAr
                    ? `بروفايلي: ${user.name}`
                    : `My Profile: ${user.name}`
                  : isAr
                  ? 'بروفايلي / تسجيل الدخول'
                  : 'My Profile / Sign In'
              }
              aria-label="Profile Avatar"
            >
              <div className="w-8 h-8 rounded-full bg-[#EFE9DE] flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                ) : user ? (
                  <span className="text-xs font-black text-[#CC785C]">{userInitials}</span>
                ) : (
                  <UserIcon className="w-4 h-4 text-[#6C6A64]" />
                )}
              </div>
              {user && (
                <span className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-2.5 h-2.5 rounded-full bg-[#5DB8A6] border-2 border-white animate-pulse" />
              )}
            </motion.button>

            {/* Mobile Hamburger Menu Toggle (Opens Side Drawer) */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#6C6A64] hover:text-[#141413] hover:bg-[#EFE9DE] transition-colors cursor-pointer border border-[#E6DFD8]"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Modern Slide-over Mobile Sidebar Drawer */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />
    </>
  );
};
