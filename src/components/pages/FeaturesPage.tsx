import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  BarChart2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const { lang, t, setCurrentView } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const features = [
    {
      icon: BarChart2,
      title: isAr ? 'مؤشر أداء من 100 مشروح المعادلة' : 'Explainable 0–100 Performance Score',
      desc: isAr
        ? 'لا نضع رقماً عشوائياً، بل نحسب النتيجة بناءً على: 35% التفاعل الفعلي، 25% ثبات النشر، 20% تنوع الأشكال، 20% استبقاء الجمهور.'
        : 'Zero opaque scores. Derived from: 35% net engagement, 25% cadence consistency, 20% format diversification, and 20% audience retention.',
      color: 'text-[#5DB8A6]',
    },
    {
      icon: TrendingUp,
      title: isAr ? 'تشخيص أفضل وأسوأ المنشورات' : 'Postmortem of Top & Bottom Content',
      desc: isAr
        ? 'تحليل دقيق لأسباب نجاح مقاطع الـ Reels أو الـ Carousels الأعلى وصولاً، مع تشخيص موضوعي للمحتوى الأقل تفاعلاً لتفادي تكراره.'
        : 'Detailed postmortem pinpointing why specific hooks succeeded and diagnosing why other posts failed to engage.',
      color: 'text-[#CC785C]',
    },
    {
      icon: Calendar,
      title: isAr ? 'خطة محتوى تفصيلية لمدة 30 يوماً' : 'Structured 30-Day Content Roadmap',
      desc: isAr
        ? 'جدول نشر متكامل يحدد نوع المحتوى، الافتتاحية الجاذبة (Hook)، محاور السيناريو، الـ CTA، مسودة الـ Caption، وتصدير الخطة كملف CSV.'
        : 'Daily publishing calendar specifying content format, scroll-stopping hooks, script outlines, CTAs, captions, and CSV download.',
      color: 'text-[#1877F2]',
    },
    {
      icon: HelpCircle,
      title: isAr ? 'سؤال متابعة إضافي (حتى 500 حرف)' : '500-Character Follow-Up Q&A',
      desc: isAr
        ? 'اطرح سؤالاً محدداً حول نتائج التقرير، وسيجيبك المحرك بدقة بالاستناد إلى بيانات حسابك، وهو مشمول مجاناً ضمن المحاولة.'
        : 'Ask a targeted strategic question about your audit. The advisor responds based strictly on your account data—included free.',
      color: 'text-[#E8A55A]',
    },
    {
      icon: MessageSquare,
      title: isAr ? 'جلسة استشارة استراتيجية (حتى 3000 حرف)' : '3,000-Character Advisory Consultation',
      desc: isAr
        ? 'حوار تفاعلي معمق لمناقشة طرق تنفيذ الأفكار وصياغة الرسائل التسويقية مع تتبع دقيق لسقف الحروف التراكمي.'
        : 'Deep interactive dialogue to refine marketing angles and production logistics with clear cumulative character monitoring.',
      color: 'text-[#CC785C]',
    },
    {
      icon: ShieldCheck,
      title: isAr ? 'رصيد دائم ومحافظ مستقلة' : 'Permanent Credits & Dual Wallets',
      desc: isAr
        ? 'رصيد محفظة Instagram ورصيد محفظة Facebook لا تنتهي صلاحيتهما أبداً، وتُسجل كل حركة بسجل تدقيق محاسبي غير قابل للتعديل.'
        : 'Trial credits in both Instagram and Facebook wallets never expire, backed by an immutable ledger transaction log.',
      color: 'text-[#5DB8A6]',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16 animate-fade-in text-[#141413]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-[#CC785C] uppercase tracking-wider">
          {isAr ? 'منصة متكاملة لتحليل الأداء والتخطيط' : 'Complete Intelligence & Planning Suite'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {isAr ? 'مميزات منصة ORVEX AI' : 'ORVEX AI Core Capabilities'}
        </h1>
        <p className="text-sm sm:text-base text-[#6C6A64] leading-relaxed">
          {isAr
            ? 'صُممت كل ميزة لمساعدتك على الخروج من دوامة العشوائية، وبناء استراتيجية نمو مستدامة وموثوقة بالأرقام.'
            : 'Engineered to replace trial-and-error guesswork with objective diagnostics and a disciplined monthly roadmap.'}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl p-7 space-y-4 hover:border-[#CC785C] transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EFE9DE] flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <h3 className="text-base font-bold text-[#141413] group-hover:text-[#CC785C] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6C6A64] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-[#FAF0EA] border border-[#CC785C]/30 rounded-3xl p-8 sm:p-12 text-center space-y-5">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
          {isAr ? 'ابدأ تجربة المميزات مجاناً الآن' : 'Experience All Features Today'}
        </h3>
        <p className="text-xs sm:text-sm text-[#6C6A64] max-w-xl mx-auto">
          {isAr ? 'سجل دخولك عبر Google واحصل على 3 محاولات ترحيبية فورية.' : 'Sign in with Google to receive 3 complimentary starter credits.'}
        </p>
        <button
          onClick={() => setCurrentView('auth')}
          className="px-7 py-3 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>{isAr ? 'تسجيل الدخول عبر Google' : 'Sign In with Google'}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
