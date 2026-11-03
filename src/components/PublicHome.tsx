import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Facebook,
  CheckCircle2,
  Calendar,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  FileText,
  BarChart2,
  ChevronDown,
  Layers,
  Monitor,
} from 'lucide-react';

export const PublicHome: React.FC = () => {
  const { lang, t, setCurrentView, openAuthModal, user, deviceMode, activateDesktopForAnalytics } = useApp();
  const [demoPlatform, setDemoPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const faqs = [
    {
      q: isAr ? 'هل تطلب المنصة كلمة مرور حسابي على Instagram أو Facebook؟' : 'Does ORVEX AI ever ask for my Instagram or Facebook password?',
      a: isAr
        ? 'قطعاً لا. يتم الربط حصرياً عبر تدفق OAuth الرسمي والآمن من شركة Meta. تمنحنا صلاحيات قراءة مؤشرات الأداء فقط دون الوصول لكلمة المرور أو الرسائل الخاصة.'
        : 'Never. Authorization happens strictly through Meta’s official OAuth dialog. We only receive encrypted, read-only analytics permissions without ever seeing your password.',
    },
    {
      q: isAr ? 'هل يضمن التحليل وصول المنشورات إلى أعداد محددة من المشاهدات؟' : 'Does the audit guarantee a specific number of views or viral reach?',
      a: isAr
        ? 'لا نعد بأي أرقام وهمية أو وصول مضمون. خوارزميات التوصية تعتمد على سلوك الجمهور المتغير. دورنا هو تزويدك بتشخيص حقيقي بالأرقام وخطة محتوى مبنية على ما أثبت كفاءته لتزيد احتمالات نموك بأمان.'
        : 'We do not make false viral guarantees. Social recommendation engines depend on real-time audience behavior. We provide objective mathematical audits and proven frameworks to maximize organic consistency.',
    },
    {
      q: isAr ? 'هل تنتهي صلاحية رصيد المحاولات إذا لم أستخدمها فوراً؟' : 'Do my trial credits expire if I do not use them immediately?',
      a: isAr
        ? 'الرصيد لا تنتهي صلاحيته أبداً! يظل محفوظاً في محفظتك بشكل دائم حتى تقرر استخدامه لإجراء تحليل.'
        : 'Your trial credits never expire! They remain permanently stored in your account wallet until you choose to conduct an audit.',
    },
    {
      q: isAr ? 'ما الذي تشمله المحاولة الواحدة؟' : 'What is included in a single trial credit?',
      a: isAr
        ? 'تشمل المحاولة الواحدة: التقرير التشخيصي الكامل، درجة الأداء مع شرح الحساب، تحليل أفضل وأسوأ المنشورات، خطة محتوى مخصصة لـ 30 يوماً، سؤال متابعة إضافي (حتى 500 حرف)، وجلسة استشارة ذكية (حتى 3000 حرف).'
        : 'A single credit includes: full diagnostic audit, weighted 0–100 performance score, top/bottom content postmortem, 30-day content calendar, follow-up Q&A (500 chars), and advisory chat (3,000 chars).',
    },
    {
      q: isAr ? 'لماذا يختلف سعر باقة Facebook عن باقة Instagram؟' : 'Why does Facebook pricing differ from Instagram pricing?',
      a: isAr
        ? 'لأن طبيعة الصلاحيات والبيانات تختلف؛ فإحصائيات صفحات فيسبوك العامة تتطلب استدعاءات أعمق لواجهات Meta وتكاليف معالجة مختلفة، لذلك حافظنا على محفظة وتسعير مستقل لكل منصة.'
        : 'Because Meta API capabilities, scope requirements, and processing pipelines differ between Instagram accounts and Facebook Pages, we operate independent wallets with platform-specific pricing.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* ----------------- HERO SECTION ----------------- */}
      <section className="pt-12 sm:pt-20 px-6 sm:px-8 max-w-5xl mx-auto text-center space-y-8">
        {/* Subtle Pill-Free Editorial Kicker */}
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-[#CC785C] uppercase">
          {t.hero.kicker}
        </p>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#141413] tracking-tight leading-[1.25] text-balance">
          {t.hero.title}
        </h1>

        {/* Hero Description */}
        <p className="text-base sm:text-lg text-[#6C6A64] max-w-3xl mx-auto leading-relaxed">
          {t.hero.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              if (user) {
                setCurrentView('dashboard');
              } else {
                setCurrentView('auth');
              }
            }}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.hero.primaryCta}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-[#EFE9DE] hover:bg-[#E8E0D2] text-[#141413] border border-[#E6DFD8] transition-colors cursor-pointer"
          >
            {t.hero.secondaryCta}
          </button>
        </div>

        {/* Trust Markers Bar */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#6C6A64] border-t border-[#E6DFD8]/80 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5DB8A6]" />
            <span>{t.hero.badgeOfficial}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#CC785C]" />
            <span>{t.hero.badgeNoScraping}</span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#5DB8A6]" />
            <span>{t.hero.badgeCreditsNeverExpire}</span>
          </div>
        </div>
      </section>

      {/* ----------------- INTERACTIVE DEMO AUDIT PREVIEW ----------------- */}
      <section id="demo-section" className="px-6 sm:px-8 max-w-6xl mx-auto">
        <div className="bg-[#181715] rounded-3xl p-6 sm:p-10 text-[#FAF9F5] shadow-2xl border border-[#35322D] space-y-8">
          {/* Header of Demo */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#35322D] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#CC785C] font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.demoSection.title}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {demoPlatform === 'instagram'
                  ? (isAr ? 'تقرير تشخيصي: @culinary_studio' : 'Diagnostic Audit: @culinary_studio')
                  : (isAr ? 'تقرير تشخيصي: مختبر التقنية الحديثة' : 'Diagnostic Audit: Modern Tech Labs')}
              </h2>
              <p className="text-xs text-[#A09C94] mt-1">{t.demoSection.subtitle}</p>
            </div>

            {/* Platform Switcher Buttons */}
            <div className="flex items-center p-1 bg-[#252320] rounded-xl border border-[#35322D] shrink-0">
              <button
                onClick={() => setDemoPlatform('instagram')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  demoPlatform === 'instagram'
                    ? 'bg-[#CC785C] text-white shadow-sm'
                    : 'text-[#A09C94] hover:text-white'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </button>
              <button
                onClick={() => setDemoPlatform('facebook')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                  demoPlatform === 'facebook'
                    ? 'bg-[#CC785C] text-white shadow-sm'
                    : 'text-[#A09C94] hover:text-white'
                }`}
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Analytics Quality Notice for Mobile */}
          {deviceMode === 'mobile' && (
            <div className="p-3.5 bg-[#252320] border border-[#35322D] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#FAF9F5]">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span className="text-[11px] text-[#A09C94] leading-relaxed">
                  {isAr
                    ? '💡 لضمان جودة قراءة المؤشرات البيانية المتقدمة وجدول الـ 30 يوماً بالتفصيل، يُطلب فتح التحليلات في وضع ديسكتوب.'
                    : '💡 For maximum fidelity & complete 30-day matrices, in-depth analytics require desktop view.'}
                </span>
              </div>
              <button
                onClick={activateDesktopForAnalytics}
                className="px-3 py-1.5 text-[11px] font-bold bg-[#CC785C] hover:bg-[#A9583E] text-white rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {isAr ? 'تفعيل وضع الديسكتوب' : 'Switch Desktop'}
              </button>
            </div>
          )}

          {/* Performance Score & Executive Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="bg-[#252320] p-6 rounded-2xl border border-[#35322D] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#A09C94] uppercase tracking-wider">
                  {t.demoSection.scoreLabel}
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black tracking-tight text-[#5DB8A6] tabular-nums">
                    {demoPlatform === 'instagram' ? '78' : '72'}
                  </span>
                  <span className="text-sm text-[#A09C94]">/ 100</span>
                </div>
              </div>
              <p className="text-xs text-[#A09C94] leading-relaxed border-t border-[#35322D] pt-3">
                {t.demoSection.scoreExplanation}
              </p>
            </div>

            {/* Executive Summary Card */}
            <div className="lg:col-span-2 bg-[#252320] p-6 rounded-2xl border border-[#35322D] space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-[#E8A55A] uppercase tracking-wider">
                  {isAr ? 'الملخص التنفيذي التشخيصي' : 'Executive Diagnostic Summary'}
                </span>
                <p className="text-sm text-[#FAF9F5] leading-relaxed mt-2">
                  {demoPlatform === 'instagram'
                    ? (isAr
                      ? 'الحساب يتمتع بجاذبية بصرية عالية ومعدل حفظ مرتفع للوصفات (4.8% تفاعل)، إلا أن معدل النشر متذبذب مما يقلل ظهور الـ Reels في خانة الاستكشاف. زيادة الاعتماد على الـ Carousels التفاعلية في أيام منتصف الأسبوع سترفع متوسط الوصول بنسبة ملحوظة.'
                      : 'Account shows strong visual appeal and recipe bookmarking rates (4.8% ER), but irregular publishing frequency limits Reels algorithm momentum. Introducing mid-week interactive Carousels will reliably compound reach.')
                    : (isAr
                      ? 'صفحة فيسبوك تمتلك قاعدة جماهيرية وفية وتفاعلاً قوياً على المقالات التقنية الطويلة، لكن مقاطع الفيديو القصيرة تعاني من انخفاض المشاهدة بعد الثانية الخامسة. ينصح بتحسين الافتتاحية خلال أول 3 ثوانٍ وتركيز المنشورات الصباحية.'
                      : 'Facebook Page maintains an engaged readership for in-depth tech analyses, but short-form videos experience early drop-off at second 5. Optimizing first-3-second hooks and morning publishing schedules is recommended.')}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#A09C94] pt-2 border-t border-[#35322D]">
                <span>{isAr ? 'الثقة: مرتفعة' : 'Confidence: High'}</span>
                <span>·</span>
                <span>{isAr ? 'تم فحص 30 يوماً سابقة' : '30-Day Verified Window'}</span>
                <span>·</span>
                <span>{isAr ? 'مصدر البيانات: Meta Graph API' : 'Source: Official Meta API'}</span>
              </div>
            </div>
          </div>

          {/* SWOT Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#252320]/60 border border-[#35322D] space-y-2">
              <span className="text-xs font-bold text-[#5DB8A6]">{t.reportView.strengths}</span>
              <p className="text-xs text-[#FAF9F5]/90 leading-relaxed">
                {isAr
                  ? 'معدل حفظ ومشاركة المنشورات يتفوق على متوسط المجال بـ 38%.'
                  : 'Post saves and shares exceed domain benchmark by 38%.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#252320]/60 border border-[#35322D] space-y-2">
              <span className="text-xs font-bold text-[#E8A55A]">{t.reportView.weaknesses}</span>
              <p className="text-xs text-[#FAF9F5]/90 leading-relaxed">
                {isAr
                  ? 'فجوات نشر تصل أحياناً إلى 5 أيام متتالية دون ظهور.'
                  : 'Publishing gaps extending up to 5 days without content.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#252320]/60 border border-[#35322D] space-y-2">
              <span className="text-xs font-bold text-[#5DB8A6]">{t.reportView.opportunities}</span>
              <p className="text-xs text-[#FAF9F5]/90 leading-relaxed">
                {isAr
                  ? 'إطلاق سلسلة أسبوعية ثابتة تحت وسم موحد لتثبيت عادة المتابعة.'
                  : 'Launch recurring weekly series under a signature branded tag.'}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#252320]/60 border border-[#35322D] space-y-2">
              <span className="text-xs font-bold text-[#C64545]">{t.reportView.risks}</span>
              <p className="text-xs text-[#FAF9F5]/90 leading-relaxed">
                {isAr
                  ? 'تقلبات خوارزميات التوصية عند الاعتماد على شكل واحد فقط.'
                  : 'Algorithm distribution volatility if over-relying on one format.'}
              </p>
            </div>
          </div>

          {/* 30-Day Content Plan Snapshot */}
          <div className="p-5 rounded-2xl bg-[#252320] border border-[#35322D] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#CC785C]" />
                <span className="text-xs font-bold text-[#FAF9F5]">
                  {isAr ? 'عينة من خطة المحتوى (اليوم 1 و اليوم 2)' : 'Content Calendar Sample (Day 1 & Day 2)'}
                </span>
              </div>
              <span className="text-xs text-[#A09C94]">{isAr ? '30 يوماً كاملة متوفرة بالتقرير' : 'Full 30 Days Included'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-[#181715] border border-[#35322D] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#CC785C]">{isAr ? 'اليوم 1 · Reel' : 'Day 1 · Reel'}</span>
                  <span className="text-[#A09C94]">{isAr ? 'هدف: وعي بالعلامة' : 'Awareness'}</span>
                </div>
                <p className="text-xs font-medium text-[#FAF9F5]">
                  {isAr ? 'افتتاحية: ٩٠٪ من الناس يرتكبون هذا الخطأ دون أن يعلموا!' : 'Hook: 90% of creators get this backwards—here is why.'}
                </p>
                <p className="text-[11px] text-[#A09C94] line-clamp-2">
                  {isAr ? 'السيناريو: 0-3 ثوانٍ صدمة بصرية ثم استعراض الحل البديل في 3 نقاط محددة وسريعة.' : 'Script: 0-3s visual punch stating the problem, delivering 3 tight bullet steps.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#181715] border border-[#35322D] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#5DB8A6]">{isAr ? 'اليوم 2 · Carousel' : 'Day 2 · Carousel'}</span>
                  <span className="text-[#A09C94]">{isAr ? 'هدف: معدل حفظ' : 'Retention & Saves'}</span>
                </div>
                <p className="text-xs font-medium text-[#FAF9F5]">
                  {isAr ? 'افتتاحية: دليل عملي من 5 خطوات لحل مشكلة متكررة.' : 'Hook: 5-step practical guide solving a daily friction.'}
                </p>
                <p className="text-[11px] text-[#A09C94] line-clamp-2">
                  {isAr ? 'الشرائح: شرح مرئي مركز يختتم بدعوة لحفظ المنشور والرجوع إليه.' : 'Slides: Focused visual breakdown ending with a strong bookmark prompt.'}
                </p>
              </div>
            </div>
          </div>

          {/* Legal / Reality Notice */}
          <p className="text-[11px] text-[#A09C94] text-center border-t border-[#35322D] pt-4">
            {t.demoSection.disclaimer}
          </p>
        </div>
      </section>

      {/* ----------------- HOW IT WORKS ----------------- */}
      <section id="how-it-works" className="px-6 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#141413] tracking-tight">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6C6A64] max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#FAF9F5] p-7 rounded-2xl border border-[#E6DFD8] space-y-3.5 shadow-sm">
            <span className="text-xs font-bold text-[#CC785C]">01</span>
            <h3 className="text-base font-bold text-[#141413]">{t.howItWorks.step1Title}</h3>
            <p className="text-xs sm:text-sm text-[#6C6A64] leading-relaxed">
              {t.howItWorks.step1Desc}
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-7 rounded-2xl border border-[#E6DFD8] space-y-3.5 shadow-sm">
            <span className="text-xs font-bold text-[#CC785C]">02</span>
            <h3 className="text-base font-bold text-[#141413]">{t.howItWorks.step2Title}</h3>
            <p className="text-xs sm:text-sm text-[#6C6A64] leading-relaxed">
              {t.howItWorks.step2Desc}
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-7 rounded-2xl border border-[#E6DFD8] space-y-3.5 shadow-sm">
            <span className="text-xs font-bold text-[#CC785C]">03</span>
            <h3 className="text-base font-bold text-[#141413]">{t.howItWorks.step3Title}</h3>
            <p className="text-xs sm:text-sm text-[#6C6A64] leading-relaxed">
              {t.howItWorks.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* ----------------- PLATFORM DIFFERENCES (IG vs FB) ----------------- */}
      <section className="px-6 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#141413] tracking-tight">
            {t.platformDifference.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6C6A64] max-w-2xl mx-auto">
            {t.platformDifference.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instagram Card */}
          <div className="bg-[#FAF9F5] p-8 rounded-2xl border border-[#E6DFD8] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#141413]">{t.platformDifference.igTitle}</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#3D3D3A] leading-relaxed">
              {t.platformDifference.igPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Facebook Card */}
          <div className="bg-[#FAF9F5] p-8 rounded-2xl border border-[#E6DFD8] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#141413]">{t.platformDifference.fbTitle}</h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#3D3D3A] leading-relaxed">
              {t.platformDifference.fbPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ----------------- PRICING SECTION ----------------- */}
      <section id="pricing" className="px-6 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#141413] tracking-tight">
            {t.pricing.title}
          </h2>
          <p className="text-sm sm:text-base text-[#6C6A64] max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instagram Pricing Card */}
          <div className="bg-[#FAF9F5] p-8 rounded-3xl border-2 border-[#CC785C]/30 relative overflow-hidden shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Instagram className="w-5 h-5 text-[#CC785C]" />
                <h3 className="text-lg font-bold text-[#141413]">{t.pricing.igCardTitle}</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#CC785C] bg-[#CC785C]/10 px-2.5 py-1 rounded-md">
                Instagram
              </span>
            </div>

            {/* Pricing Tiers Box */}
            <div className="space-y-3 bg-[#EFE9DE] p-4 rounded-xl border border-[#E6DFD8]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#141413]">{t.pricing.firstPurchaseBadge}</p>
                  <p className="text-[11px] text-[#6C6A64]">{t.pricing.igFirstTrials}</p>
                </div>
                <span className="text-lg font-extrabold text-[#CC785C] tabular-nums">
                  {t.pricing.igFirstPrice}
                </span>
              </div>
              <div className="h-px bg-[#E6DFD8]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#141413]">{t.pricing.recurringPurchaseBadge}</p>
                  <p className="text-[11px] text-[#6C6A64]">{t.pricing.igSubsequentTrials}</p>
                </div>
                <span className="text-lg font-extrabold text-[#141413] tabular-nums">
                  {t.pricing.igSubsequentPrice}
                </span>
              </div>
            </div>

            {/* Inclusions */}
            <ul className="space-y-2.5 text-xs text-[#3D3D3A]">
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

            <button
              onClick={() => {
                if (user) {
                  setCurrentView('dashboard');
                } else {
                  setCurrentView('auth');
                }
              }}
              className="w-full py-3 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer"
            >
              {t.pricing.buyNow}
            </button>
          </div>

          {/* Facebook Pricing Card */}
          <div className="bg-[#FAF9F5] p-8 rounded-3xl border border-[#E6DFD8] relative overflow-hidden shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <h3 className="text-lg font-bold text-[#141413]">{t.pricing.fbCardTitle}</h3>
              </div>
              <span className="text-[11px] font-semibold text-[#1877F2] bg-[#1877F2]/10 px-2.5 py-1 rounded-md">
                Facebook
              </span>
            </div>

            {/* Pricing Tiers Box */}
            <div className="space-y-3 bg-[#EFE9DE] p-4 rounded-xl border border-[#E6DFD8]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#141413]">{t.pricing.firstPurchaseBadge}</p>
                  <p className="text-[11px] text-[#6C6A64]">{t.pricing.fbFirstTrials}</p>
                </div>
                <span className="text-lg font-extrabold text-[#CC785C] tabular-nums">
                  {t.pricing.fbFirstPrice}
                </span>
              </div>
              <div className="h-px bg-[#E6DFD8]" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#141413]">{t.pricing.recurringPurchaseBadge}</p>
                  <p className="text-[11px] text-[#6C6A64]">{t.pricing.fbSubsequentTrials}</p>
                </div>
                <span className="text-lg font-extrabold text-[#141413] tabular-nums">
                  {t.pricing.fbSubsequentPrice}
                </span>
              </div>
            </div>

            {/* Inclusions */}
            <ul className="space-y-2.5 text-xs text-[#3D3D3A]">
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

            <button
              onClick={() => {
                if (user) {
                  setCurrentView('dashboard');
                } else {
                  setCurrentView('auth');
                }
              }}
              className="w-full py-3 text-xs font-bold rounded-xl bg-[#181715] hover:bg-[#252320] text-white shadow-sm transition-colors cursor-pointer"
            >
              {t.pricing.buyNow}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#6C6A64]">
          {t.pricing.paypalNotice}
        </p>
      </section>

      {/* ----------------- FAQ SECTION ----------------- */}
      <section id="faq" className="px-6 sm:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight">
            {t.nav.faq}
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6A64]">
            {isAr ? 'إجابات واضحة ومباشرة عن الأمان والبيانات والرصيد' : 'Direct answers regarding security, data provenance, and credits'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-5 text-left rtl:text-right flex items-center justify-between gap-4 font-bold text-sm text-[#141413] cursor-pointer hover:bg-[#EFE9DE]/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#6C6A64] transition-transform duration-200 shrink-0 ${
                    expandedFaq === idx ? 'rotate-180 text-[#CC785C]' : ''
                  }`}
                />
              </button>
              {expandedFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#6C6A64] leading-relaxed border-t border-[#E6DFD8]/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ----------------- FINAL CTA ----------------- */}
      <section className="px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="bg-[#FAF0EA] border border-[#CC785C]/30 rounded-3xl p-8 sm:p-14 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#141413] tracking-tight">
            {isAr ? 'جاهز للتوقف عن العشوائية وبدء خطة تسويق مدعومة بالبيانات؟' : 'Ready to trade content guesswork for a data-backed 30-day plan?'}
          </h2>
          <p className="text-sm text-[#6C6A64] max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'اربط حسابك في دقيقة واحدة عبر Meta الرسمية، واكتشف أين تكمن فرصتك الحقيقية للشهر القادم.'
              : 'Connect your channel in 60 seconds via official Meta OAuth and uncover your highest-leverage growth opportunities.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (user) {
                  setCurrentView('dashboard');
                } else {
                  setCurrentView('auth');
                }
              }}
              className="px-8 py-3.5 text-sm font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>{t.hero.primaryCta}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
