import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, CreditCard, BarChart3, User, Shield } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, user, wallet, t, lang, setDashboardTab, dashboardTab } = useApp();
  const isAr = lang === 'ar';

  const totalCredits = (wallet?.instagramCredits || 0) + (wallet?.facebookCredits || 0);

  const handleNav = (view: string, tab?: string) => {
    setCurrentView(view);
    if (tab) {
      setDashboardTab(tab);
    }
  };

  const isHomeActive = currentView === 'home';
  const isHowActive = currentView === 'how-it-works';
  const isPricingActive = currentView === 'pricing';
  const isDashboardActive = currentView === 'dashboard';
  const isAdminActive = currentView === 'admin';
  const isAuthOrProfileActive = currentView === 'auth' || (currentView === 'dashboard' && dashboardTab === 'profile');

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-lg border-t border-[#E6DFD8] px-2 py-1.5 transition-all shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            isHomeActive ? 'text-[#CC785C]' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-semibold mt-1 leading-tight tracking-tight">
            {t.mobileApp.bottomNavHome}
          </span>
        </button>

        {/* How It Works */}
        <button
          onClick={() => handleNav('how-it-works')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors cursor-pointer ${
            isHowActive ? 'text-[#CC785C]' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          <Compass className={`w-5 h-5 ${isHowActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-semibold mt-1 leading-tight tracking-tight">
            {t.mobileApp.bottomNavHowItWorks}
          </span>
        </button>

        {/* Pricing */}
        <button
          onClick={() => handleNav('pricing')}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors cursor-pointer relative ${
            isPricingActive ? 'text-[#CC785C]' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${isPricingActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-semibold mt-1 leading-tight tracking-tight">
            {t.mobileApp.bottomNavPricing}
          </span>
        </button>

        {/* Analytics / Dashboard */}
        <button
          onClick={() => {
            if (user) {
              handleNav('dashboard', 'overview');
            } else {
              handleNav('auth');
            }
          }}
          className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors cursor-pointer relative ${
            isDashboardActive ? 'text-[#CC785C]' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          <div className="relative">
            <BarChart3 className={`w-5 h-5 ${isDashboardActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            {totalCredits > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#5DB8A6] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {totalCredits}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-1 leading-tight tracking-tight">
            {t.mobileApp.bottomNavDashboard}
          </span>
        </button>

        {/* Admin or Profile */}
        {user?.role === 'admin' ? (
          <button
            onClick={() => handleNav('admin')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors cursor-pointer ${
              isAdminActive ? 'text-[#E8A55A]' : 'text-[#6C6A64] hover:text-[#141413]'
            }`}
          >
            <Shield className={`w-5 h-5 ${isAdminActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[10px] font-semibold mt-1 leading-tight tracking-tight">
              {isAr ? 'الإدارة' : 'Admin'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (user) {
                handleNav('dashboard', 'profile');
              } else {
                handleNav('auth');
              }
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-colors cursor-pointer ${
              isAuthOrProfileActive ? 'text-[#CC785C]' : 'text-[#6C6A64] hover:text-[#141413]'
            }`}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="w-5 h-5 rounded-full object-cover border border-[#E6DFD8]"
              />
            ) : (
              <User className={`w-5 h-5 ${isAuthOrProfileActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            )}
            <span className="text-[10px] font-semibold mt-1 leading-tight tracking-tight">
              {user ? t.mobileApp.bottomNavProfile : t.nav.login}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
