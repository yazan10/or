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
} from 'lucide-react';

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
      {/* ================= HERO ================= */}
      <section className="pt-14 sm:pt-20 px-5 sm:px-8 max-w-4xl mx-auto text-center space-y-7">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-xs sm:text-sm font-semibold tracking-[0.18em] text-[#CC785C] uppercase"
        >
          {t.hero.kicker}
        </motion.p>

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
          <button
            onClick={() => (user ? setCurrentView('dashboard') : setCurrentView('auth'))}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.hero.primaryCta}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => document.getElementById('papers-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-[#EFE9DE] hover:bg-[#E8E0D2] text-[#141413] border border-[#E6DFD8] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isAr ? 'استكشف القدرات' : 'Explore capabilities'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="pt-6 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-[#6C6A64]"
        >
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
        </motion.div>
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

      {/* ================= PRICING STRIP ================= */}
      <section className="px-5 sm:px-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {[
            {
              icon: <Instagram className="w-5 h-5 text-[#CC785C]" />,
              title: 'Instagram',
              desc: isAr ? '3 محاولات بـ 12 شيقل · ثم 10 بـ 8' : '3 trials for 12 ILS · then 10 for 8',
            },
            {
              icon: <Facebook className="w-5 h-5 text-[#1877F2]" />,
              title: 'Facebook',
              desc: isAr ? '3 محاولات بـ 15 شيقل · ثم 10 بـ 10' : '3 trials for 15 ILS · then 10 for 10',
            },
            {
              icon: <MessageSquare className="w-5 h-5 text-[#5DB8A6]" />,
              title: isAr ? 'مشمول مجاناً' : 'Included free',
              desc: isAr ? 'سؤال متابعة + دردشة استشارية' : 'Follow-up + advisory chat',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-4.5 sm:p-5 rounded-2xl bg-white border border-[#E6DFD8] flex items-start gap-3 shadow-sm"
            >
              <div className="mt-0.5">{item.icon}</div>
              <div>
                <p className="text-sm font-bold text-[#141413]">{item.title}</p>
                <p className="text-xs text-[#6C6A64] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
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
