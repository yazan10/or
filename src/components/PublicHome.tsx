import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Facebook,
  Calendar,
  BarChart2,
  Wallet,
  MessageSquare,
  ChevronDown,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { AnalysisTerminal } from './AnalysisTerminal';

type PaperId = 'audit' | 'plan' | 'wallet' | 'meta' | null;

export const PublicHome: React.FC = () => {
  const { lang, t, setCurrentView, user } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const [activePaper, setActivePaper] = useState<PaperId>(null);

  const papers = [
    {
      id: 'audit' as const,
      title: isAr ? 'التقرير التشخيصي' : 'Diagnostic Audit',
      subtitle: isAr ? 'درجة أداء + SWOT + توصيات' : 'Score + SWOT + Recommendations',
      icon: <BarChart2 className="w-5 h-5" />,
      color: '#CC785C',
      content: isAr
        ? 'تقرير كامل بالأرقام: درجة أداء من 0–100، تحليل SWOT، أفضل وأسوأ المنشورات، وتوصيات مرتبة حسب الأولوية. كل شيء مبني على بيانات Meta الرسمية.'
        : 'Full numbered report: 0–100 performance score, SWOT analysis, top & bottom posts, prioritized recommendations. Built exclusively on official Meta data.',
    },
    {
      id: 'plan' as const,
      title: isAr ? 'خطة المحتوى 30 يوماً' : '30-Day Content Plan',
      subtitle: isAr ? 'يوم بيوم · جاهزة للتنفيذ' : 'Day-by-day · Ready to execute',
      icon: <Calendar className="w-5 h-5" />,
      color: '#5DB8A6',
      content: isAr
        ? 'جدول يومي كامل: نوع المحتوى، الهدف التسويقي، الـ Hook، السيناريو، الـ CTA، والـ Caption المقترح. قابل للتصدير كـ CSV.'
        : 'Complete daily calendar: content type, marketing goal, hook, script, CTA and proposed caption. Exportable as CSV.',
    },
    {
      id: 'wallet' as const,
      title: isAr ? 'محفظة مزدوجة' : 'Dual Wallet',
      subtitle: isAr ? 'Instagram و Facebook منفصلان' : 'Instagram & Facebook independent',
      icon: <Wallet className="w-5 h-5" />,
      color: '#1877F2',
      content: isAr
        ? 'رصيد مستقل لكل منصة. المحاولات لا تنتهي صلاحيتها أبداً. كل محاولة تشمل التقرير + الخطة + سؤال متابعة + دردشة استشارية.'
        : 'Independent balance per platform. Credits never expire. Every trial includes the report + plan + follow-up + advisory chat.',
    },
    {
      id: 'meta' as const,
      title: isAr ? 'ربط Meta الرسمي' : 'Official Meta Connect',
      subtitle: isAr ? 'OAuth آمن · بدون كلمات مرور' : 'Secure OAuth · No passwords',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: '#E8A55A',
      content: isAr
        ? 'ربط حصري عبر Meta OAuth. صلاحيات قراءة فقط. لا نطلب كلمة المرور ولا نقرأ الرسائل الخاصة. يمكنك فصل الحساب في أي وقت.'
        : 'Exclusive Meta OAuth connection. Read-only permissions. We never ask for passwords and never read DMs. Disconnect anytime.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* ================= HERO WITH DYNAMIC MOTION ACCENTS ================= */}
      <section className="pt-14 sm:pt-20 px-5 sm:px-8 max-w-4xl mx-auto text-center space-y-7 relative">
        {/* Subtle Floating AI Tech Background Accents */}
        <div className="absolute -top-10 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-[#CC785C]/15 to-[#E8A55A]/10 blur-3xl pointer-events-none animate-float" />
        <div className="absolute top-20 -right-12 w-56 h-56 rounded-full bg-gradient-to-bl from-[#5DB8A6]/15 to-[#1877F2]/10 blur-3xl pointer-events-none animate-float-reverse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CC785C]/10 border border-[#CC785C]/30 text-xs font-bold text-[#CC785C] shadow-xs animate-badge-sparkle"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="tracking-[0.15em] uppercase">{t.hero.kicker}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#141413] tracking-tight leading-[1.2] text-balance"
        >
          {t.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-[15px] sm:text-lg text-[#6C6A64] max-w-2xl mx-auto leading-relaxed"
        >
          {t.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => (user ? setCurrentView('dashboard') : setCurrentView('auth'))}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-xl bg-gradient-to-r from-[#CC785C] to-[#A9583E] hover:from-[#A9583E] hover:to-[#924732] text-white shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
          >
            <span>{t.hero.primaryCta}</span>
            <ArrowIcon className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById('papers-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-[#EFE9DE] hover:bg-[#E8E0D2] text-[#141413] border border-[#E6DFD8] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isAr ? 'استكشف القدرات' : 'Explore capabilities'}</span>
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-[#6C6A64]"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5DB8A6]" />
            <span>{t.hero.badgeOfficial}</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#CC785C]" />
            <span>{t.hero.badgeNoScraping}</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#5DB8A6]" />
            <span>{t.hero.badgeCreditsNeverExpire}</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ================= LIVE ANALYSIS ENGINE TERMINAL ================= */}
      <section className="px-4 sm:px-8 max-w-4xl mx-auto space-y-5">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CC785C]/15 border border-[#CC785C]/30 text-[#CC785C] text-[11px] font-bold">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>{isAr ? 'محاكاة حية لمحرك التحليل (Live Engine Terminal)' : 'Live Engine Simulation Terminal'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
            {isAr ? 'شاهد كيف يعالج الذكاء الاصطناعي بيانات حسابك لحظياً' : 'Watch How the AI Ingests & Analyzes Your Data in Real Time'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6A64] max-w-xl mx-auto leading-relaxed">
            {isAr
              ? 'تدفق حي لأسطر الأكواد والعمليات التحليلية: مصادقة Meta API، استخراج مؤشرات التفاعل، وتوليد استنتاجات SWOT وخطة الـ 30 يوماً.'
              : 'Live stream of analytical code execution: Meta API ingestion, net engagement computation, and 30-day calendar token generation.'}
          </p>
        </div>

        <AnalysisTerminal />
      </section>

      {/* ================= PAPER STACK (Creasefold style) ================= */}
      <section id="papers-section" className="px-4 sm:px-8 max-w-2xl mx-auto">
        <div className="text-center mb-8 space-y-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#CC785C] uppercase">
            {isAr ? 'الأوراق' : 'The Papers'}
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
            {isAr ? 'اضغط على الورقة لتفردها' : 'Press a paper to flatten it'}
          </h2>
          <p className="text-sm text-[#6C6A64]">
            {isAr
              ? 'كل ورقة تمثل قدرة أساسية في المنصة'
              : 'Each paper represents a core capability'}
          </p>
        </div>

        <div className="relative" style={{ minHeight: activePaper ? 340 : 280 }}>
          {papers.map((paper, index) => {
            const isActive = activePaper === paper.id;
            const isAnyActive = activePaper !== null;
            const offsetY = isAnyActive ? (isActive ? 0 : 8 + index * 4) : index * 18;
            const scale = isActive ? 1 : isAnyActive ? 0.97 : 1;
            const opacity = isAnyActive && !isActive ? 0.45 : 1;
            const rotate = isAnyActive && !isActive ? 0 : (index - 1.5) * 1.8;
            const z = isActive ? 40 : 10 + index;

            return (
              <motion.div
                key={paper.id}
                layout
                onClick={() => setActivePaper(isActive ? null : paper.id)}
                className="absolute left-0 right-0 cursor-pointer"
                style={{ zIndex: z, originX: 0.5, originY: 1 }}
                initial={false}
                animate={{
                  y: offsetY,
                  scale,
                  opacity,
                  rotateZ: rotate,
                }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              >
                <div
                  className={`
                    relative rounded-2xl border overflow-hidden
                    ${isActive ? 'shadow-2xl border-[#E6DFD8]' : 'shadow-lg border-[#E6DFD8]/90'}
                  `}
                  style={{ background: '#FAF9F5' }}
                >
                  <div
                    className="absolute top-0 inset-x-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent 5%, ${paper.color}55 50%, transparent 95%)`,
                    }}
                  />

                  <div className="p-5 flex items-start gap-3.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: paper.color }}
                    >
                      {paper.icon}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="text-[15px] sm:text-base font-bold text-[#141413] leading-snug">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-[#6C6A64] mt-0.5">{paper.subtitle}</p>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A09C94] pt-1 shrink-0">
                      {isActive ? (isAr ? 'مفتوحة' : 'Open') : (isAr ? 'مطوية' : 'Folded')}
                    </span>
                  </div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0 space-y-4">
                          <p className="text-sm text-[#3D3D3A] leading-relaxed border-t border-[#E6DFD8] pt-4">
                            {paper.content}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (user) setCurrentView('dashboard');
                              else setCurrentView('auth');
                            }}
                            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: paper.color }}
                          >
                            {isAr ? 'ابدأ الآن' : 'Start now'}
                            <ArrowIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute bottom-0 left-4 right-4 h-[3px] rounded-b-full bg-black/[0.04]" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-[#A09C94] mt-6">
          {isAr ? 'اضغط مرة أخرى لإغلاق الورقة' : 'Press again to fold it back'}
        </p>
      </section>

      {/* ================= PRICING PACKAGES SECTION ================= */}
      <section id="pricing-section" className="px-5 sm:px-8 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CC785C]/15 border border-[#CC785C]/30 text-[#CC785C] text-xs font-bold">
            <Wallet className="w-3.5 h-3.5" />
            <span>{isAr ? 'باقات التسعير والمحافظ الذكية' : 'Transparent Pricing & Permanent Wallets'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#141413] tracking-tight">
            {isAr ? 'محاولات تحليل وخطة محتوى لا تنتهي صلاحيتها' : 'Analysis Trials & Content Calendars That Never Expire'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6A64] leading-relaxed">
            {isAr
              ? 'محفظة مستقلة لكل منصة، بدون أي اشتراكات دورية إجبارية. كل محاولة تتضمن تقريراً تشخيصياً شاملاً، وخطة محتوى 30 يوماً، ومحادثة استشارية مع موديل YA ai.'
              : 'Independent balance per platform. No recurring locks. Every trial includes full SWOT audit, 30-day calendar, and advisory chat with YA ai model.'}
          </p>
        </div>

        {/* The Two Distinct Pricing Cards with Motion Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Instagram Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.015 }}
            data-cursor="ai"
            className="bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border-2 border-[#CC785C]/50 shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-[#CC785C] hover:shadow-[0_20px_40px_-15px_rgba(204,120,92,0.25)] transition-all cursor-default"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#141413]">Instagram Intelligence</h3>
                    <p className="text-[11px] text-[#6C6A64]">{isAr ? 'لحسابات الأعمال والمبدعين' : 'For Business & Creator Accounts'}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#CC785C]/15 text-[#CC785C] border border-[#CC785C]/30 animate-badge-sparkle">
                  {isAr ? 'الأكثر طلباً' : 'Most Popular'}
                </span>
              </div>

              {/* Tiers Pricing Grid */}
              <div className="space-y-3 bg-[#EFE9DE] p-4 sm:p-5 rounded-2xl border border-[#E6DFD8] group-hover:border-[#CC785C]/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#CC785C] px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E6DFD8] inline-block mb-1">
                      {isAr ? 'أول عملية شراء' : 'First Purchase'}
                    </span>
                    <p className="text-xs font-bold text-[#141413]">
                      {isAr ? '3 محاولات تحليل شاملة' : '3 Full Analysis Trials'}
                    </p>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-2xl font-black text-[#CC785C] tabular-nums">12 ILS</span>
                    <p className="text-[10px] text-[#6C6A64]">{isAr ? 'فقط 4 شيقل / محاولة' : '4 ILS / trial'}</p>
                  </div>
                </div>

                <div className="h-px bg-[#E6DFD8]" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#3D3D3A] px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E6DFD8] inline-block mb-1">
                      {isAr ? 'المشتريات اللاحقة' : 'Subsequent Purchases'}
                    </span>
                    <p className="text-xs font-bold text-[#141413]">
                      {isAr ? '10 محاولات إضافية' : '10 Additional Trials'}
                    </p>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-2xl font-black text-[#141413] tabular-nums">8 ILS</span>
                    <p className="text-[10px] text-[#5DB8A6] font-semibold">{isAr ? 'أفضل قيمة اقتصادية' : 'Best Unit Value'}</p>
                  </div>
                </div>
              </div>

              {/* Feature Inclusions */}
              <ul className="space-y-2.5 text-xs text-[#3D3D3A]">
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'تقرير تشخيصي كامل (درجة أداء 0–100 + تحليل SWOT)' : 'Full Diagnostic Audit (0-100 Performance Score + SWOT)'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'خطة محتوى 30 يوماً يوم بيوم مع Hooks و CTAs وسيناريو' : '30-Day Day-by-Day Content Plan with Hooks, CTAs & Scripts'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'استشارات غير محدودة مع موديل YA ai الذكي' : 'Unlimited advisory chat with smart YA ai model'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'رصيد دائم ومحاولات لا تنتهي صلاحيتها أبداً' : 'Permanent balance — trials never expire'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'دفع إلكتروني آمن ومباشر عبر PayPal' : 'Secure instant checkout via PayPal'}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (user) {
                    setCurrentView('dashboard');
                  } else {
                    setCurrentView('auth');
                  }
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#CC785C] to-[#A9583E] hover:from-[#A9583E] hover:to-[#924732] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
              >
                <span>{user ? (isAr ? 'شحن محفظة Instagram' : 'Top up Instagram Wallet') : (isAr ? 'ابدأ الآن مع Instagram' : 'Get Started with Instagram')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>

          {/* Facebook Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.015 }}
            data-cursor="ai"
            className="bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border border-[#E6DFD8] shadow-sm relative overflow-hidden flex flex-col justify-between group hover:border-[#1877F2] hover:shadow-[0_20px_40px_-15px_rgba(24,119,242,0.25)] transition-all cursor-default"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <Facebook className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#141413]">Facebook Intelligence</h3>
                    <p className="text-[11px] text-[#6C6A64]">{isAr ? 'لصفحات فيسبوك العامة والتجارية' : 'For Public Pages & Media Outlets'}</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20">
                  Facebook
                </span>
              </div>

              {/* Tiers Pricing Grid */}
              <div className="space-y-3 bg-[#EFE9DE] p-4 sm:p-5 rounded-2xl border border-[#E6DFD8] group-hover:border-[#1877F2]/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#1877F2] px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E6DFD8] inline-block mb-1">
                      {isAr ? 'أول عملية شراء' : 'First Purchase'}
                    </span>
                    <p className="text-xs font-bold text-[#141413]">
                      {isAr ? '3 محاولات تحليل شاملة' : '3 Full Analysis Trials'}
                    </p>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-2xl font-black text-[#1877F2] tabular-nums">15 ILS</span>
                    <p className="text-[10px] text-[#6C6A64]">{isAr ? 'فقط 5 شيقل / محاولة' : '5 ILS / trial'}</p>
                  </div>
                </div>

                <div className="h-px bg-[#E6DFD8]" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#3D3D3A] px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E6DFD8] inline-block mb-1">
                      {isAr ? 'المشتريات اللاحقة' : 'Subsequent Purchases'}
                    </span>
                    <p className="text-xs font-bold text-[#141413]">
                      {isAr ? '10 محاولات إضافية' : '10 Additional Trials'}
                    </p>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-2xl font-black text-[#141413] tabular-nums">10 ILS</span>
                    <p className="text-[10px] text-[#5DB8A6] font-semibold">{isAr ? 'فقط 1 شيقل / محاولة' : '1 ILS / trial'}</p>
                  </div>
                </div>
              </div>

              {/* Feature Inclusions */}
              <ul className="space-y-2.5 text-xs text-[#3D3D3A]">
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'تدقيق شامل لأداء منشورات الصفحة والوصول العضوي' : 'Full Page Posts Audit & Organic Reach Insights'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'خطة محتوى 30 يوماً مفصلة لصفحات فيسبوك' : 'Detailed 30-day content calendar tailored for Facebook'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'استشارات مباشرة وتوليد أفكار مع موديل YA ai' : 'Direct consulting and concept drafting with YA ai model'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'رصيد دائم ومحاولات لا تنتهي صلاحيتها أبداً' : 'Permanent balance — trials never expire'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span>{isAr ? 'دفع إلكتروني آمن ومباشر عبر PayPal' : 'Secure instant checkout via PayPal'}</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (user) {
                    setCurrentView('dashboard');
                  } else {
                    setCurrentView('auth');
                  }
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#181715] hover:bg-[#252320] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer btn-shimmer"
              >
                <span>{user ? (isAr ? 'شحن محفظة Facebook' : 'Top up Facebook Wallet') : (isAr ? 'ابدأ الآن مع Facebook' : 'Get Started with Facebook')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* PayPal & Security Guarantee Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6DFD8] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6C6A64]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#5DB8A6]" />
            <div>
              <p className="font-bold text-[#141413]">{isAr ? 'ضمان الدفع الآمن وسياسة الشيقل المحلي' : 'Secure Payment Guarantee & Local ILS Billing'}</p>
              <p className="text-[11px] text-[#6C6A64]">{isAr ? 'جميع الأسعار محسوبة بالشيقل وتُحصّل عبر حسابك في PayPal بدون رسوم خفية' : 'All prices denominated in ILS and billed transparently via PayPal Checkout'}</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('pricing')}
            className="text-xs font-bold text-[#CC785C] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>{isAr ? 'عرض صفحة الأسعار الكاملة' : 'View Full Pricing Page'}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto text-center space-y-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] text-balance">
          {isAr ? 'جاهز لفهم حسابك بعمق؟' : 'Ready to understand your account deeply?'}
        </h2>
        <p className="text-sm text-[#6C6A64]">
          {isAr
            ? 'اربط حسابك عبر Meta، اختر المنصة، وابدأ أول تحليل خلال دقائق.'
            : 'Connect via Meta, choose the platform, and run your first analysis in minutes.'}
        </p>
        <button
          onClick={() => (user ? setCurrentView('dashboard') : setCurrentView('auth'))}
          className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.hero.primaryCta}</span>
        </button>
      </section>
    </div>
  );
};
