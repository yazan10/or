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

        {/* Payment Methods & Security Trust Section */}
        <div className="py-8 border-b border-[#E6DFD8] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-right rtl:md:text-right ltr:md:text-left">
            <h4 className="text-xs font-bold text-[#141413] tracking-wide flex items-center justify-center md:justify-start gap-2">
              <Lock className="w-3.5 h-3.5 text-[#CC785C]" />
              <span>{lang === 'ar' ? 'طرق الدفع والشحن المعتمدة والمشفرة' : 'Secure & Accepted Payment Methods'}</span>
            </h4>
            <p className="text-[11px] text-[#6C6A64]">
              {lang === 'ar'
                ? 'جميع المعاملات المالية محمية بتشفير 256-Bit SSL وتُعالج رسمياً عبر خوادم PayPal الآمنة.'
                : 'All transactions are 256-Bit SSL encrypted and processed through official PayPal servers.'}
            </p>
          </div>

          {/* Payment Badges & Brand Logos */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* PayPal Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6DFD8] shadow-xs hover:border-[#0070BA] transition-colors" title="PayPal Official">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M7.076 21.337H2.47a.64.64 0 0 1-.633-.74L4.944 3.73a.853.853 0 0 1 .842-.716h6.974c2.87 0 4.96.64 5.918 1.84.887 1.11.97 2.68.257 4.79-.04.12-.084.24-.132.36-.93 2.76-2.95 4.18-6.19 4.33h-2.1a.853.853 0 0 0-.843.72l-1.042 5.922a.64.64 0 0 1-.552.361z" fill="#003087"/>
                <path d="M8.618 14.244h1.728c3.24 0 5.26-1.42 6.19-4.18.048-.12.092-.24.132-.36.713-2.11.63-3.68-.257-4.79C15.453 3.714 13.363 3.074 10.493 3.074H4.512c-.42 0-.77.308-.842.716L1.837 20.597a.64.64 0 0 0 .633.74h4.606l1.542-7.093z" fill="#0079C1"/>
                <path d="M8.618 14.244h1.728c3.24 0 5.26-1.42 6.19-4.18.048-.12.092-.24.132-.36.713-2.11.63-3.68-.257-4.79-.204-.256-.45-.486-.732-.69-.94 2.82-3.02 4.28-6.33 4.28H6.55L5.008 21.337h3.61z" fill="#00457C"/>
              </svg>
              <span className="font-extrabold text-xs tracking-tight text-[#003087]">
                Pay<span className="text-[#0079C1]">Pal</span>
              </span>
            </div>

            {/* Visa Badge */}
            <div className="flex items-center px-3 py-1.5 rounded-xl bg-white border border-[#E6DFD8] shadow-xs hover:border-[#1A1F71] transition-colors" title="Visa">
              <span className="font-black italic text-xs tracking-wider text-[#1A1F71]">
                VISA
              </span>
            </div>

            {/* MasterCard Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E6DFD8] shadow-xs hover:border-[#EB001B] transition-colors" title="MasterCard">
              <div className="flex items-center -space-x-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#EB001B] inline-block opacity-95"></span>
                <span className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] inline-block opacity-95"></span>
              </div>
              <span className="font-bold text-xs tracking-tight text-[#141413]">
                mastercard
              </span>
            </div>

            {/* American Express Badge */}
            <div className="flex items-center px-2.5 py-1.5 rounded-xl bg-[#002663] text-white shadow-xs" title="American Express">
              <span className="font-black text-[10px] tracking-widest text-[#007AC1] bg-white px-1 rounded-xs">
                AMEX
              </span>
            </div>

            {/* 256-Bit SSL Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FAF9F5] border border-[#E6DFD8] text-[11px] font-semibold text-[#3D3D3A]" title="SSL Secure 256-Bit">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5DB8A6]" />
              <span>256-Bit SSL</span>
            </div>

            {/* Instant Delivery Badge */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#5DB8A6]/10 border border-[#5DB8A6]/20 text-[11px] font-bold text-[#2C7A6D]" title="Instant Balance Crediting">
              <RefreshCw className="w-3 h-3 text-[#5DB8A6]" />
              <span>{lang === 'ar' ? 'شحن فوري' : 'Instant Credit'}</span>
            </div>
          </div>
        </div>

        {/* Bottom — Platform rights only */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6C6A64]">
          <p>{t.footer.rights}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#5DB8A6] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5DB8A6] animate-pulse"></span>
              {lang === 'ar' ? 'بوابة الدفع نشطة 100%' : 'Payment Gateway Online'}
            </span>
            <button
              onClick={() => setCurrentView('deposit')}
              className="text-[#CC785C] hover:underline font-bold"
            >
              {lang === 'ar' ? 'شحن المحفظة الآن ←' : 'Deposit & Top Up Now →'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
