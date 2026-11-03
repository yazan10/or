import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe, User as UserIcon, Shield, Sparkles, LayoutDashboard, Smartphone, Monitor } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    lang,
    setLang,
    t,
    currentView,
    setCurrentView,
    openAuthModal,
    logout,
    deviceMode,
    toggleDeviceMode,
  } = useApp();

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E6DFD8] px-4 sm:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left rtl:text-right group cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#CC785C] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-[#A9583E] transition-colors">
              O
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#141413] whitespace-nowrap shrink-0 leading-tight">
                ORVEX <span className="text-[#CC785C]">AI</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Nav Links (Clean single-line prose) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#6C6A64]">
          <button
            onClick={() => setCurrentView('home')}
            className={`whitespace-nowrap shrink-0 hover:text-[#141413] transition-colors ${
              currentView === 'home' ? 'text-[#141413] font-semibold' : ''
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => setCurrentView('how-it-works')}
            className={`whitespace-nowrap shrink-0 hover:text-[#141413] transition-colors ${
              currentView === 'how-it-works' ? 'text-[#141413] font-semibold' : ''
            }`}
          >
            {t.nav.howItWorks}
          </button>
          <button
            onClick={() => setCurrentView('features')}
            className={`whitespace-nowrap shrink-0 hover:text-[#141413] transition-colors ${
              currentView === 'features' ? 'text-[#141413] font-semibold' : ''
            }`}
          >
            {t.nav.features}
          </button>
          <button
            onClick={() => setCurrentView('pricing')}
            className={`whitespace-nowrap shrink-0 hover:text-[#141413] transition-colors ${
              currentView === 'pricing' ? 'text-[#141413] font-semibold' : ''
            }`}
          >
            {t.nav.pricing}
          </button>
          <button
            onClick={() => setCurrentView('faq')}
            className={`whitespace-nowrap shrink-0 hover:text-[#141413] transition-colors ${
              currentView === 'faq' ? 'text-[#141413] font-semibold' : ''
            }`}
          >
            {t.nav.faq}
          </button>
        </nav>

        {/* Zone 3: Actions (Language Switcher + Device View Switcher + User Profile / CTA) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Device Mode Switcher (Mobile Web App / Desktop) */}
          <button
            onClick={toggleDeviceMode}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-all flex items-center gap-1.5 cursor-pointer ${
              deviceMode === 'desktop'
                ? 'bg-[#181715] text-[#FAF9F5] border-[#181715] shadow-xs'
                : 'bg-[#FAF0EA] text-[#CC785C] border-[#CC785C]/40 hover:bg-[#F5E6DC]'
            }`}
            title={deviceMode === 'mobile' ? t.mobileApp.switchToDesktop : t.mobileApp.switchToMobile}
          >
            {deviceMode === 'mobile' ? (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap hidden sm:inline">{t.mobileApp.mobileMode}</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap hidden sm:inline">{t.mobileApp.desktopMode}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 text-xs font-medium rounded-md border border-[#E6DFD8] text-[#3D3D3A] hover:bg-[#EFE9DE] transition-colors flex items-center gap-1.5 cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#6C6A64]" />
            <span className="whitespace-nowrap font-semibold">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView(currentView === 'dashboard' ? 'home' : 'dashboard')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#EFE9DE] hover:bg-[#E8E0D2] text-[#141413] border border-[#E6DFD8] transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#CC785C]" />
                <span>{t.nav.dashboard}</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#181715] hover:bg-[#252320] text-[#FAF9F5] transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#E8A55A]" />
                  <span className="hidden sm:inline">{t.nav.admin}</span>
                </button>
              )}

              <button
                onClick={logout}
                className="px-2.5 py-1.5 text-xs text-[#6C6A64] hover:text-[#C64545] transition-colors whitespace-nowrap cursor-pointer"
                title={t.nav.logout}
              >
                {t.nav.logout}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('auth')}
                className="px-3 py-1.5 text-xs font-medium text-[#3D3D3A] hover:text-[#141413] transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.nav.login}
              </button>
              <button
                onClick={() => setCurrentView('auth')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.nav.getStarted}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
