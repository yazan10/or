import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LogOut,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  Home,
  User,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const LogoutPage: React.FC = () => {
  const { lang, setCurrentView } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [countdown, setCountdown] = useState(8);
  const [autoRedirectPaused, setAutoRedirectPaused] = useState(false);

  useEffect(() => {
    if (autoRedirectPaused) return;

    if (countdown <= 0) {
      setCurrentView('home');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, autoRedirectPaused, setCurrentView]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-8 py-16 animate-fade-in">
      <div className="max-w-md w-full bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl p-6 sm:p-10 shadow-xl space-y-6 text-[#141413] text-center">
        {/* Animated Icon Ring */}
        <div className="relative w-16 h-16 rounded-2xl bg-[#5DB8A6]/15 border border-[#5DB8A6]/30 text-[#5DB8A6] flex items-center justify-center mx-auto shadow-inner">
          <LogOut className="w-8 h-8" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#5DB8A6] text-white flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Title & Reassuring Copy */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#141413]">
            {isAr ? 'تم تسجيل الخروج بنجاح' : 'Successfully Signed Out'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6C6A64] leading-relaxed max-w-sm mx-auto">
            {isAr
              ? 'تم إنهاء جلستك وحماية كافة الرموز والبيانات المرتبطة بحسابك بأمان تام.'
              : 'Your session has ended safely and all tokens and account data remain strictly secured.'}
          </p>
        </div>

        {/* Security & Data Guarantee Box */}
        <div className="bg-[#EFE9DE]/70 rounded-2xl p-4 text-xs text-[#3D3D3A] space-y-2.5 border border-[#E6DFD8] text-left rtl:text-right">
          <div className="flex items-center gap-2 text-[#5DB8A6] font-bold text-[11px] uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>{isAr ? 'ضمانات الأمان والحماية' : 'Security Guarantees'}</span>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-[#6C6A64]">
            <Lock className="w-3.5 h-3.5 text-[#CC785C] shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'تم مسح رموز الجلسة المؤقتة من المتصفح بشكل كامل.'
                : 'Session tokens have been purged from local browser memory.'}
            </span>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-[#6C6A64]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5DB8A6] shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'أرصدة محاولاتك في المحفظة محفوظة دائماً ولا تنتهي صلاحيتها.'
                : 'Your wallet credits remain permanently stored and never expire.'}
            </span>
          </div>
        </div>

        {/* Auto Redirect Countdown */}
        <div className="bg-white rounded-xl p-3 border border-[#E6DFD8] flex items-center justify-between text-xs text-[#6C6A64]">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-3.5 h-3.5 text-[#CC785C] ${!autoRedirectPaused ? 'animate-spin' : ''}`} />
            <span>
              {isAr
                ? `إعادة التوجيه للرئيسية خلال ${countdown} ثوانٍ...`
                : `Redirecting home in ${countdown}s...`}
            </span>
          </div>

          <button
            onClick={() => setAutoRedirectPaused(!autoRedirectPaused)}
            className="text-[11px] font-bold text-[#CC785C] hover:underline cursor-pointer"
          >
            {autoRedirectPaused ? (isAr ? 'استئناف' : 'Resume') : (isAr ? 'إيقاف' : 'Pause')}
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {/* Primary Action: Sign back in */}
          <button
            onClick={() => setCurrentView('auth')}
            className="w-full py-3.5 px-4 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>{isAr ? 'تسجيل الدخول مجدداً عبر Google' : 'Sign In Again with Google'}</span>
          </button>

          {/* Secondary Action: Return Home */}
          <button
            onClick={() => setCurrentView('home')}
            className="w-full py-3 px-4 text-xs font-semibold rounded-xl bg-white hover:bg-[#EFE9DE] border border-[#E6DFD8] text-[#141413] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#6C6A64]" />
            <span>{isAr ? 'العودة إلى الصفحة الرئيسية' : 'Return to Home Page'}</span>
            <ArrowIcon className="w-3.5 h-3.5 text-[#6C6A64]" />
          </button>
        </div>
      </div>
    </div>
  );
};
