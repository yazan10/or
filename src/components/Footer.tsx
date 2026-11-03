import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Lock, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setCurrentView, lang } = useApp();

  return (
    <footer className="w-full bg-[#FAF9F5] border-t border-[#E6DFD8] pt-14 pb-12 px-6 sm:px-8 mt-20 text-[#3D3D3A]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E6DFD8]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#CC785C] flex items-center justify-center text-white font-bold text-xs">
                O
              </div>
              <span className="text-lg font-bold tracking-tight text-[#141413]">
                ORVEX <span className="text-[#CC785C]">AI</span>
              </span>
            </div>
            <p className="text-sm text-[#6C6A64] max-w-md leading-relaxed">
              {t.footer.desc}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6C6A64] pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5DB8A6]" />
                <span>{t.hero.badgeOfficial}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#CC785C]" />
                <span>{t.hero.badgeNoScraping}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#5DB8A6]" />
                <span>{t.hero.badgeCreditsNeverExpire}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-[#6C6A64]">
              <li>
                <button
                  onClick={() => setCurrentView('home')}
                  className="hover:text-[#141413] transition-colors cursor-pointer"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('how-it-works')}
                  className="hover:text-[#141413] transition-colors cursor-pointer"
                >
                  {t.nav.howItWorks}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('features')}
                  className="hover:text-[#141413] transition-colors cursor-pointer"
                >
                  {t.nav.features}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('pricing')}
                  className="hover:text-[#141413] transition-colors cursor-pointer"
                >
                  {t.nav.pricing}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('faq')}
                  className="hover:text-[#141413] transition-colors cursor-pointer"
                >
                  {t.nav.faq}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-[#141413] transition-colors cursor-pointer text-[#CC785C]"
                >
                  {lang === 'ar' ? 'تواصل معنا والدعم' : 'Contact Support'}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#141413] uppercase tracking-wider">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-sm text-[#6C6A64]">
              <li>
                <button
                  onClick={() => setCurrentView('privacy')}
                  className="hover:text-[#141413] transition-colors"
                >
                  {t.footer.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('terms')}
                  className="hover:text-[#141413] transition-colors"
                >
                  {t.footer.termsOfService}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('refund')}
                  className="hover:text-[#141413] transition-colors"
                >
                  {t.footer.refundPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('data-deletion')}
                  className="hover:text-[#141413] transition-colors text-[#CC785C]"
                >
                  {t.footer.dataDeletion}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6C6A64]">
          <p>{t.footer.rights}</p>
          <p className="max-w-xl text-center sm:text-left rtl:sm:text-right text-[11px] leading-relaxed">
            {t.footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
};
