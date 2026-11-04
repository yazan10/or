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

  const handlePaperClick = (id: PaperId) => {
    setActivePaper((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative min-h-[80vh]">
      {/* Background subtle paper texture feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ========== HERO ========== */}
      <section className="pt-16 sm:pt-24 px-6 sm:px-8 max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#CC785C] uppercase"
        >
          {t.hero.kicker}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#141413] tracking-tight leading-[1.15] text-balance"
        >
          {t.hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-base sm:text-lg text-[#6C6A64] max-w-2xl mx-auto leading-relaxed"
        >
          {t.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <button
            onClick={() => (user ? setCurrentView('dashboard') : setCurrentView('auth'))}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t.hero.primaryCta}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => document.getElementById('papers')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold rounded-xl bg-[#EFE9DE] hover:bg-[#E8E0D2] text-[#141413] border border-[#E6DFD8] transition-colors cursor-pointer"
          >
            {isAr ? 'استكشف القدرات' : 'Explore capabilities'}
          </button>
        </motion.div>

        {/* Trust markers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#6C6A64]"
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

      {/* ========== CREASEFOLD-STYLE PAPER STACK ========== */}
      <section id="papers" className="mt-20 sm:mt-28 px-4 sm:px-8 max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 space-y-3">
          <p className="text-xs font-bold tracking-widest text-[#CC785C] uppercase">
            {isAr ? 'الأوراق المفتوحة' : 'Unfold the work'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
            {isAr ? 'اضغط على الورقة لتفردها' : 'Press a paper to flatten it'}
          </h2>
          <p className="text-sm text-[#6C6A64] max-w-md mx-auto">
            {isAr
              ? 'كل ورقة تمثل قدرة أساسية في ORVEX AI. اضغط لتكشف التفاصيل.'
              : 'Each paper represents a core capability of ORVEX AI. Press to reveal the details.'}
          </p>
        </div>

        {/* Paper stack */}
        <div className="relative perspective-[1200px] min-h-[420px] sm:min-h-[480px]">
          <div className="relative w-full max-w-lg mx-auto">
            {papers.map((paper, index) => {
              const isActive = activePaper === paper.id;
              const isAnyActive = activePaper !== null;
              const stackOffset = isAnyActive && !isActive ? 0 : index * 14;
              const rotate = isAnyActive && !isActive ? 0 : (index - 1.5) * 2.2;

              return (
                <motion.div
                  key={paper.id}
                  layout
                  onClick={() => handlePaperClick(paper.id)}
                  className="absolute left-0 right-0 cursor-pointer origin-bottom"
                  style={{
                    zIndex: isActive ? 50 : 10 + index,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={false}
                  animate={{
                    y: isActive ? -20 : stackOffset,
                    rotateZ: isActive ? 0 : rotate,
                    scale: isActive ? 1.03 : 1,
                    opacity: isAnyActive && !isActive ? 0.35 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                >
                  {/* Paper card */}
                  <div
                    className={`
                      relative rounded-2xl border shadow-xl overflow-hidden
                      transition-shadow duration-300
                      ${isActive ? 'shadow-2xl border-[#E6DFD8]' : 'border-[#E6DFD8]/80 shadow-lg'}
                    `}
                    style={{
                      background: '#FAF9F5',
                      minHeight: isActive ? 280 : 160,
                    }}
                  >
                    {/* Fold crease line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-px origin-left"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${paper.color}40, transparent)`,
                      }}
                    />

                    {/* Header of paper */}
                    <div className="p-5 sm:p-6 flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: paper.color }}
                      >
                        {paper.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-[#141413] leading-tight">
                          {paper.title}
                        </h3>
                        <p className="text-xs text-[#6C6A64] mt-0.5">{paper.subtitle}</p>
                      </div>
                      <div className="text-[10px] font-medium text-[#A09C94] uppercase tracking-wider pt-1">
                        {isActive ? (isAr ? 'مفتوحة' : 'Open') : (isAr ? 'مطوية' : 'Folded')}
                      </div>
                    </div>

                    {/* Expanded content */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-6 pb-6 pt-1 space-y-4">
                            <p className="text-sm text-[#3D3D3A] leading-relaxed border-t border-[#E6DFD8] pt-4">
                              {paper.content}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (user) setCurrentView('dashboard');
                                else setCurrentView('auth');
                              }}
                              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg text-white transition-colors"
                              style={{ backgroundColor: paper.color }}
                            >
                              {isAr ? 'ابدأ الآن' : 'Start now'}
                              <ArrowIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom edge shadow to simulate paper thickness */}
                    <div className="absolute bottom-0 left-3 right-3 h-1 rounded-b-full bg-black/5" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-[#A09C94] mt-8">
          {isAr ? 'اضغط مرة أخرى لإغلاق الورقة' : 'Press again to fold the paper back'}
        </p>
      </section>

      {/* ========== QUICK VALUE STRIP ========== */}
      <section className="mt-28 sm:mt-36 px-6 sm:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Instagram className="w-5 h-5 text-[#CC785C]" />,
              title: isAr ? 'Instagram' : 'Instagram',
              desc: isAr ? '3 محاولات بـ 12 شيقل · ثم 10 بـ 8' : '3 trials for 12 ILS · then 10 for 8',
            },
            {
              icon: <Facebook className="w-5 h-5 text-[#1877F2]" />,
              title: isAr ? 'Facebook' : 'Facebook',
              desc: isAr ? '3 محاولات بـ 15 شيقل · ثم 10 بـ 10' : '3 trials for 15 ILS · then 10 for 10',
            },
            {
              icon: <MessageSquare className="w-5 h-5 text-[#5DB8A6]" />,
              title: isAr ? 'مشمول مجاناً' : 'Included free',
              desc: isAr ? 'سؤال متابعة + دردشة استشارية مع كل تقرير' : 'Follow-up + advisory chat with every report',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] flex items-start gap-3"
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

      {/* ========== FINAL CTA ========== */}
      <section className="mt-20 sm:mt-28 mb-16 px-6 sm:px-8 max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
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
