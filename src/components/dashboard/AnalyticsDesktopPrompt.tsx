import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Monitor, Smartphone, Copy, Check, Sparkles, X, AlertTriangle } from 'lucide-react';

interface AnalyticsDesktopPromptProps {
  currentTabName?: string;
}

export const AnalyticsDesktopPrompt: React.FC<AnalyticsDesktopPromptProps> = ({ currentTabName }) => {
  const {
    deviceMode,
    activateDesktopForAnalytics,
    analyticsQualityDismissed,
    setAnalyticsQualityDismissed,
    showToast,
    lang,
    t,
  } = useApp();

  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  // If in desktop mode, we don't need to block or gate, but can show a small quality assurance indicator
  if (deviceMode === 'desktop') {
    return (
      <div className="bg-[#181715] text-[#FAF9F5] border border-[#35322D] rounded-xl px-4 py-2.5 flex items-center justify-between text-xs shadow-sm">
        <div className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-[#5DB8A6]" />
          <span className="font-semibold">
            {isAr ? 'وضع سطح المكتب مفعّل — عرض التحليلات بكامل الدقة' : 'Desktop Mode Active — Full High-Fidelity Analytics Rendered'}
          </span>
        </div>
        <span className="text-[11px] text-[#A09C94] hidden sm:inline">
          {isAr ? 'عرض شامل للجداول ومصفوفة الأداء' : 'Comprehensive view for matrices & 30-day planner'}
        </span>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast(t.analyticsQualityGate.linkCopied, 'success');
      setTimeout(() => setCopied(false), 3000);
    } else {
      showToast(t.analyticsQualityGate.linkCopied, 'info');
    }
  };

  // If user already clicked "Continue in mobile", show an unobtrusive top banner reminder
  if (analyticsQualityDismissed) {
    return (
      <div className="bg-[#FAF0EA] border border-[#CC785C]/40 rounded-xl p-3 flex items-center justify-between gap-3 text-xs text-[#141413] shadow-sm animate-fade-in">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#CC785C] shrink-0" />
          <span className="text-[11px] font-medium leading-relaxed">
            {t.analyticsQualityGate.mobileBannerReminder}
          </span>
        </div>
        <button
          onClick={activateDesktopForAnalytics}
          className="shrink-0 px-3 py-1.5 rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>{isAr ? 'تفعيل الديسكتوب' : 'Switch Desktop'}</span>
        </button>
      </div>
    );
  }

  // Full High-Fidelity Quality Gate Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl text-[#141413]">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#CC785C] uppercase tracking-wider">
            <Monitor className="w-4 h-4" />
            <span>{t.analyticsQualityGate.badge}</span>
          </div>
          <button
            onClick={() => setAnalyticsQualityDismissed(true)}
            className="text-[#6C6A64] hover:text-[#141413] p-1 cursor-pointer"
            title={isAr ? 'إغلاق ومتابعة بالجوال' : 'Close and continue on mobile'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Device Comparison Illustration */}
        <div className="p-4 bg-white rounded-2xl border border-[#E6DFD8] flex items-center justify-around text-center">
          <div className="space-y-1.5 opacity-60">
            <div className="w-12 h-12 rounded-xl bg-[#EFE9DE] flex items-center justify-center mx-auto text-[#6C6A64]">
              <Smartphone className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-[#6C6A64]">{isAr ? 'شاشة الجوال' : 'Mobile Phone'}</p>
            <p className="text-[10px] text-[#A09C94]">{isAr ? 'عرض ملخص فقط' : 'Summarized'}</p>
          </div>

          <div className="text-[#CC785C] font-bold text-lg">➔</div>

          <div className="space-y-1.5">
            <div className="w-12 h-12 rounded-xl bg-[#CC785C]/15 flex items-center justify-center mx-auto text-[#CC785C]">
              <Monitor className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-[#CC785C]">{isAr ? 'سطح المكتب (مُوصى به)' : 'Desktop (Optimal)'}</p>
            <p className="text-[10px] text-[#5DB8A6] font-semibold">{isAr ? 'دقة 100% للجداول' : 'Full 100% Fidelity'}</p>
          </div>
        </div>

        {/* Title & Explanation */}
        <div className="space-y-2 text-center sm:text-left rtl:sm:text-right">
          <h3 className="text-lg sm:text-xl font-extrabold text-[#141413] tracking-tight">
            {t.analyticsQualityGate.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#6C6A64] leading-relaxed">
            {t.analyticsQualityGate.description}
          </p>
        </div>

        {/* Bullet checklist of why desktop is required */}
        <div className="bg-[#EFE9DE]/60 rounded-xl p-3.5 space-y-2 text-xs text-[#3D3D3A]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5DB8A6]"></span>
            <span>{isAr ? 'استعراض خطة الـ 30 يوماً كجدول زمني متكامل بدون ضغط' : 'Full 30-day interactive calendar matrix without clipping'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5DB8A6]"></span>
            <span>{isAr ? 'قراءة تفكيك درجات التفاعل ومصفوفة SWOT بدقة تامة' : 'High-resolution breakdown of engagement weights & SWOT analysis'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5DB8A6]"></span>
            <span>{isAr ? 'تصدير التقارير بـ CSV وإدارة المحادثة الاستشارية بسهولة' : 'Convenient CSV exports and extended 3,000-char advisory chat'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2.5 pt-2">
          {/* Primary: Switch to Desktop Mode */}
          <button
            onClick={activateDesktopForAnalytics}
            className="w-full py-3.5 px-4 rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Monitor className="w-4 h-4" />
            <span>{t.analyticsQualityGate.switchDesktopBtn}</span>
          </button>

          {/* Secondary: Copy Link to PC */}
          <button
            onClick={handleCopyLink}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#EFE9DE] border border-[#E6DFD8] text-[#141413] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#5DB8A6]" /> : <Copy className="w-4 h-4 text-[#6C6A64]" />}
            <span>{copied ? (isAr ? 'تم نسخ الرابط بنجاح!' : 'Link Copied!') : t.analyticsQualityGate.copyLinkBtn}</span>
          </button>

          {/* Tertiary: Continue with Mobile Preview */}
          <button
            onClick={() => setAnalyticsQualityDismissed(true)}
            className="w-full py-2.5 text-center text-xs font-medium text-[#6C6A64] hover:text-[#141413] transition-colors cursor-pointer"
          >
            {t.analyticsQualityGate.continueMobileBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
