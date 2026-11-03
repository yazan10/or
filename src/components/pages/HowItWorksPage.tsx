import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Sparkles, Calendar, ArrowRight, ArrowLeft, CheckCircle2, Lock, Instagram, Facebook } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { lang, t, setCurrentView } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16 animate-fade-in text-[#141413]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#CC785C] uppercase tracking-wider">
          {isAr ? 'دليل التشغيل والمنهجية العلمية' : 'Methodology & Step-by-Step Architecture'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t.howItWorks.title}
        </h1>
        <p className="text-sm sm:text-base text-[#6C6A64] leading-relaxed">
          {t.howItWorks.subtitle}
        </p>
      </div>

      {/* Chapters Breakdown */}
      <div className="space-y-12">
        {/* Step 1 */}
        <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EFE9DE] border border-[#E6DFD8] text-2xl font-black text-[#CC785C] flex items-center justify-center">
              01
            </div>
          </div>
          <div className="md:col-span-10 space-y-3">
            <h2 className="text-xl font-bold">{t.howItWorks.step1Title}</h2>
            <p className="text-sm text-[#6C6A64] leading-relaxed">
              {t.howItWorks.step1Desc}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#3D3D3A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6]" />
                <span>{isAr ? 'طلب أقل مجموعة صلاحيات قراءة' : 'Strictly read-only access scopes'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6]" />
                <span>{isAr ? 'تشفير الرموز في الخادم فقط' : 'Zero browser token storage'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EFE9DE] border border-[#E6DFD8] text-2xl font-black text-[#5DB8A6] flex items-center justify-center">
              02
            </div>
          </div>
          <div className="md:col-span-10 space-y-3">
            <h2 className="text-xl font-bold">{t.howItWorks.step2Title}</h2>
            <p className="text-sm text-[#6C6A64] leading-relaxed">
              {t.howItWorks.step2Desc}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#3D3D3A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6]" />
                <span>{isAr ? 'مؤشر أداء من 100 مشروح المعادلة' : 'Explainable 0–100 Performance Score'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6]" />
                <span>{isAr ? 'تحليل SWOT موضوعي بالأرقام' : 'Grounded mathematical SWOT'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-2 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#EFE9DE] border border-[#E6DFD8] text-2xl font-black text-[#1877F2] flex items-center justify-center">
              03
            </div>
          </div>
          <div className="md:col-span-10 space-y-3">
            <h2 className="text-xl font-bold">{t.howItWorks.step3Title}</h2>
            <p className="text-sm text-[#6C6A64] leading-relaxed">
              {t.howItWorks.step3Desc}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#3D3D3A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6]" />
                <span>{isAr ? 'تصدير الخطة كملف CSV بنقرة واحدة' : 'One-click CSV calendar export'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6]" />
                <span>{isAr ? 'سؤال متابعة ودردشة استشارية مشمولان مجاناً' : 'Follow-up Q&A and Chat included free'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#FAF0EA] border border-[#CC785C]/30 rounded-3xl p-8 sm:p-12 text-center space-y-5">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
          {isAr ? 'ابدأ أول تشخيص لحسابك الآن' : 'Launch Your First Diagnostic Audit'}
        </h3>
        <p className="text-xs sm:text-sm text-[#6C6A64] max-w-xl mx-auto">
          {isAr ? 'سجل دخولك عبر Google واربط قناتك في ثوانٍ معدودة.' : 'Sign in with Google and link your channel in seconds.'}
        </p>
        <button
          onClick={() => setCurrentView('auth')}
          className="px-7 py-3 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>{isAr ? 'تسجيل الدخول عبر Google للبدء' : 'Sign In with Google to Start'}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
