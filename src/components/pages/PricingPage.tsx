import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialPlatform } from '../../types';
import { Instagram, Facebook, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, Lock } from 'lucide-react';
import { PayPalCheckoutModal } from '../payment/PayPalCheckoutModal';

export const PricingPage: React.FC = () => {
  const { lang, t, setCurrentView, user, setDashboardTab } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [checkoutPlatform, setCheckoutPlatform] = useState<SocialPlatform | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handlePurchase = (platform: SocialPlatform) => {
    if (user) {
      setCheckoutPlatform(platform);
      setIsCheckoutOpen(true);
    } else {
      setCurrentView('auth');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16 animate-fade-in text-[#141413]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#CC785C] uppercase tracking-wider">
          {isAr ? 'أسعار شفافة ومحافظ دائمة' : 'Transparent Pricing & Non-Expiring Wallets'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t.pricing.title}
        </h1>
        <p className="text-sm sm:text-base text-[#6C6A64] leading-relaxed">
          {t.pricing.subtitle}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Instagram Card */}
        <div className="bg-[#FAF9F5] p-8 sm:p-10 rounded-3xl border-2 border-[#CC785C]/40 relative overflow-hidden shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#141413]">{t.pricing.igCardTitle}</h2>
              </div>
              <span className="text-xs font-bold text-[#CC785C] bg-[#CC785C]/10 px-2.5 py-1 rounded-md">
                Instagram
              </span>
            </div>

            {/* Pricing Tiers Box */}
            <div className="space-y-3 bg-[#EFE9DE] p-5 rounded-2xl border border-[#E6DFD8]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#141413]">{t.pricing.firstPurchaseBadge}</p>
                  <p className="text-[11px] text-[#6C6A64]">{t.pricing.igFirstTrials}</p>
                </div>
                <span className="text-xl font-black text-[#CC785C] tabular-nums">
                  {t.pricing.igFirstPrice}
                </span>
              </div>
              <div className="h-px bg-[#E6DFD8]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#141413]">{t.pricing.recurringPurchaseBadge}</p>
                  <p className="text-[11px] text-[#6C6A64]">{t.pricing.igSubsequentTrials}</p>
                </div>
                <span className="text-xl font-black text-[#141413] tabular-nums">
                  {t.pricing.igSubsequentPrice}
                </span>
              </div>
            </div>

            {/* Inclusions */}
            <ul className="space-y-3 text-xs text-[#3D3D3A]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature1}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature2}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature3}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature4}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature5}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handlePurchase('instagram')}
            className="w-full py-3.5 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer"
          >
            {user ? (isAr ? 'شحن رصيد Instagram الآن' : 'Purchase Instagram Package') : t.pricing.buyNow}
          </button>
        </div>

        {/* Facebook Card */}
        <div className="bg-[#FAF9F5] p-8 sm:p-10 rounded-3xl border border-[#E6DFD8] relative overflow-hidden shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#141413]">{t.pricing.fbCardTitle}</h2>
              </div>
              <span className="text-xs font-bold text-[#1877F2] bg-[#1877F2]/10 px-2.5 py-1 rounded-md">
                Facebook
              </span>
            </div>

            {/* Pricing Tiers Box */}
            <div className="space-y-3 bg-[#EFE9DE] p-5 rounded-2xl border border-[#E6DFD8]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#141413]">{t.pricing.firstPurchaseBadge}</p>
                  <p className="text-[11px] text-[#6C6A64]">{t.pricing.fbFirstTrials}</p>
                </div>
                <span className="text-xl font-black text-[#CC785C] tabular-nums">
                  {t.pricing.fbFirstPrice}
                </span>
              </div>
              <div className="h-px bg-[#E6DFD8]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#141413]">{t.pricing.recurringPurchaseBadge}</p>
                  <p className="text-[11px] text-[#6C6A64]">{t.pricing.fbSubsequentTrials}</p>
                </div>
                <span className="text-xl font-black text-[#141413] tabular-nums">
                  {t.pricing.fbSubsequentPrice}
                </span>
              </div>
            </div>

            {/* Inclusions */}
            <ul className="space-y-3 text-xs text-[#3D3D3A]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature1}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature2}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature3}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature4}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{t.pricing.feature5}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handlePurchase('facebook')}
            className="w-full py-3.5 text-xs font-bold rounded-xl bg-[#181715] hover:bg-[#252320] text-white shadow-sm transition-colors cursor-pointer"
          >
            {user ? (isAr ? 'شحن رصيد Facebook الآن' : 'Purchase Facebook Package') : t.pricing.buyNow}
          </button>
        </div>
      </div>

      {/* Trust & Policy Details */}
      <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] text-xs text-[#6C6A64] space-y-2 text-center leading-relaxed">
        <p className="font-semibold text-[#141413]">{t.pricing.paypalNotice}</p>
        <p>{isAr ? 'جميع الأسعار المعروضة نهائية ومحسوبة بالشيقل المحلي، وتُحصّل عبر حسابك في PayPal وبطاقات Visa / MasterCard بأمان تام وبدون أي رسوم خفية.' : 'All local prices are denominated in ILS and securely processed through PayPal Checkout and Visa / MasterCard cards.'}</p>
      </div>

      {/* Checkout Modal */}
      {checkoutPlatform && (
        <PayPalCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          platform={checkoutPlatform}
        />
      )}
    </div>
  );
};
