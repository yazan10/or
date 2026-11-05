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
      docRef: 'DOSSIER #01 // AUDIT-CORE',
      dateStamp: 'META GRAPH API · VERIFIED',
      title: isAr ? 'التقرير التشخيصي الشامل للأداء' : 'Diagnostic Audit & SWOT Dossier',
      subtitle: isAr ? 'درجة أداء رقمية (0–100) + تحليل SWOT الرباعي + أولويات النمو' : '0–100 Performance Score + SWOT Breakdown + Action Items',
      icon: <BarChart2 className="w-5 h-5" />,
      color: '#CC785C',
      content: isAr
        ? 'وثيقة تحليلية رقمية تدون أداء الحساب بالأرقام الرسمية: درجة أداء شاملة موزونة، استخراج المنشورات الأعلى تفاعلاً والأدنى تفاعلاً، تحليل SWOT الرباعي لنقاط القوة والضعف والفرص والمخاطر، و3 سيناريوهات نمو واقعية مبنية على خوارزمية Meta.'
        : 'Official verified data audit: weighted composite performance score, top and bottom engagement benchmarks, exhaustive SWOT analysis, and 3 data-grounded growth projections.',
      highlights: isAr
        ? [
            'درجة كفاءة من 100 مع تفصيل أوزان التفاعل ومعدلات الاستبقاء الحقيقية',
            'تحليل SWOT رباعي مفصل مبني حصرياً على مؤشرات Meta الرسمية',
            'توصيات نمو مرتبة تصاعدياً وفق أعلى عائد متوقع وأقل كلفة جهد',
          ]
        : [
            'Weighted 0-100 score with retention analytics and format weights',
            'Verified SWOT matrix derived directly from official Meta Graph insights',
            'Prioritized execution roadmap categorized by impact and ROI',
          ],
    },
    {
      id: 'plan' as const,
      docRef: 'DOSSIER #02 // 30D-ROADMAP',
      dateStamp: 'EDITORIAL SUITE · CSV READY',
      title: isAr ? 'خطة المحتوى الاستراتيجية (30 يوماً)' : '30-Day Turnkey Editorial Roadmap',
      subtitle: isAr ? 'مفكرة يوم بيوم جاهزة للتصوير · Hooks وسيناريوهات و CTAs' : 'Day-by-Day Calendar · Ready-to-Shoot Scripts & Hooks',
      icon: <Calendar className="w-5 h-5" />,
      color: '#5DB8A6',
      content: isAr
        ? 'مفكرة شهرية متكاملة لـ 30 يوماً مصممة خصيصاً لهوية حسابك: نوع المنشور (Reel, Carousel, Post, Story)، الافتتاحية الخاطفة (Hook) في أول 3 ثوانٍ، السيناريو التوضيحي، الدعوة للإجراء (CTA)، والنص المقترح (Caption) مع إمكانية التصدير كملف CSV بنقرة واحدة.'
        : 'Complete 30-day turnkey editorial diary: content format, first-3-seconds retention hook, full production script, CTA, and proposed caption, with one-click CSV export.',
      highlights: isAr
        ? [
            'هندسة الافتتاحيات الخاطفة (Hooks) لمنع التمرير في أول 3 ثوانٍ',
            'سيناريوهات تفصيلية لمنشورات Carousels و Reels مع توقيت الانتقالات',
            'تصدير فوري بنقرة زر بصيغة CSV المتوافقة مع كافة أدوات الجدولة',
          ]
        : [
            'Scroll-stopping hook architecture engineered for peak video retention',
            'Turnkey scripts with second-by-second pacing and visual cues',
            'One-click CSV export ready for Meta Business Suite & scheduling tools',
          ],
    },
    {
      id: 'wallet' as const,
      docRef: 'DOSSIER #03 // DUAL-LEDGER',
      dateStamp: 'PERMANENT BALANCES · NO LOCKS',
      title: isAr ? 'نظام المحفظة المزدوجة الدائمة' : 'Permanent Dual Wallet Ledger',
      subtitle: isAr ? 'Instagram و Facebook مستقلان تماماً · المحاولات لا تنتهي صلاحيتها أبداً' : 'Independent IG & FB Balances · Credits Never Expire',
      icon: <Wallet className="w-5 h-5" />,
      color: '#1877F2',
      content: isAr
        ? 'محفظة مرنة تدير أرصدة Instagram و Facebook بشكل منفصل وبدون أي رسوم خفية أو تجديد تلقائي إجباري. كل محاولة تحليل تمنحك فحصاً تشخيصياً كاملاً، وخطة محتوى لـ 30 يوماً، ومحادثة استشارية فورية مع موديل YA ai، وتبقى محاولاتك في رصيدك إلى الأبد.'
        : 'Separate wallets for Instagram and Facebook without subscription locks. Each trial includes the full audit, 30-day plan, and direct YA ai advisory chat. Credits never expire.',
      highlights: isAr
        ? [
            'أرصدة دائمة في محفظتك لا تنتهي صلاحيتها بمرور الوقت أبداً',
            'تسعير اقتصادي عادل بالشيقل وتأكيد فوري وآمن عبر PayPal',
            'كل محاولة تتضمن التقرير + الخطة + سؤال متابعة + شات استشاري',
          ]
        : [
            'Non-expiring permanent trials preserved forever in your balance',
            'Transparent ILS pricing processed via secure PayPal Checkout',
            'Every credit grants full audit + 30-day plan + follow-up + chat',
          ],
    },
    {
      id: 'meta' as const,
      docRef: 'DOSSIER #04 // META-OAUTH',
      dateStamp: 'READ-ONLY · ZERO PASSWORDS',
      title: isAr ? 'المصادقة الرسمية والربط الآمن عبر Meta' : 'Official Meta OAuth Security Protocol',
      subtitle: isAr ? 'بروتوكول معتمد رسمياً · بدون كلمات مرور · بدون قراءة رسائل خاصة' : 'Verified OAuth Access · No Passwords · Zero Scraping',
      icon: <ShieldCheck className="w-5 h-5" />,
      color: '#E8A55A',
      content: isAr
        ? 'ربط مباشر عبر واجهة Meta Graph API الرسمية. صلاحيات محددة للقراءة والتحليلات فقط (Read-Only). نحن لا نطلب كلمة مرور حسابك، ولا نطلع على الرسائل الخاصة إطلاقاً، وتملك الحق الكامل في فصل الحساب أو طلب حذف البيانات فوراً في أي وقت.'
        : 'Direct connection via official Meta Graph API. Strictly read-only permissions for public metrics. We never ask for passwords, never access private messages, and support immediate disconnection.',
      highlights: isAr
        ? [
            'اتصال رسمي مشفر متوافق 100% مع معايير الأمان المعتمدة لدى Meta',
            'صلاحيات قراءة إحصائية فقط بدون أي وصول للرسائل الخاصة أو النشر التلقائي',
            'إمكانية فك الارتباط ومسح البيانات نهائياً في أي ثانية التزاماً بالخصوصية',
          ]
        : [
            'Encrypted official handshake adhering strictly to Meta API standards',
            'Read-only analytics access with zero inbox or publishing permissions',
            'Instant account disconnection and complete token purge anytime',
          ],
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

      {/* ================= ARCHIVAL NOTEBOOK DOSSIERS (Editorial Stationery Style) ================= */}
      <section id="papers-section" className="px-4 sm:px-8 max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CC785C]/10 border border-[#CC785C]/30 text-[11px] font-bold text-[#CC785C] uppercase tracking-[0.18em]">
            <span>{isAr ? 'وثائق المحرك الاستراتيجي' : 'Strategic Intelligence Dossiers'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413] tracking-tight text-balance">
            {isAr ? 'انقر على أي ملف لاستعراض وثائق التحليل والمخرجات' : 'Click Any Dossier to Unfold the Audit & Execution Documents'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6A64] leading-relaxed">
            {isAr
              ? 'مفكرة توثيقية ترسم أركان المنصة: التدقيق التشخيصي، خطة الـ 30 يوماً، المحفظة المزدوجة، والمصادقة الرسمية.'
              : 'Interactive editorial notebook documenting the core architecture: diagnostic audit, 30-day planner, dual wallet, and official Meta OAuth.'}
          </p>
        </div>

        {/* Tactile Notebook Paper Stack */}
        <div className="relative pb-6" style={{ minHeight: activePaper ? 480 : 360 }}>
          {papers.map((paper, index) => {
            const isActive = activePaper === paper.id;
            const isAnyActive = activePaper !== null;
            const offsetY = isAnyActive ? (isActive ? 0 : 12 + index * 6) : index * 26;
            const scale = isActive ? 1 : isAnyActive ? 0.98 : 1;
            const opacity = isAnyActive && !isActive ? 0.5 : 1;
            const rotate = isAnyActive && !isActive ? 0 : (index - 1.5) * 1.5;
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
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Physical Notebook Page Container */}
                <div
                  className={`
                    relative rounded-3xl border overflow-hidden transition-all duration-300
                    ${
                      isActive
                        ? 'shadow-[0_25px_50px_-12px_rgba(20,20,19,0.18),0_0_0_1px_rgba(204,120,92,0.3)] border-[#CC785C]/60 bg-[#FAF9F5]'
                        : 'shadow-[0_12px_30px_-8px_rgba(20,20,19,0.1)] border-[#E6DFD8] bg-[#FAF9F5] hover:border-[#CC785C]/40'
                    }
                  `}
                >
                  {/* Notebook Top Perforated Spiral Binder Edge */}
                  <div className="bg-[#F5EFE6] border-b border-[#E6DFD8] px-4 sm:px-6 py-2.5 flex items-center justify-between relative overflow-hidden">
                    {/* Ring binder punch holes */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FAF9F5] border border-[#D5CCC2] shadow-inner" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FAF9F5] border border-[#D5CCC2] shadow-inner" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FAF9F5] border border-[#D5CCC2] shadow-inner" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FAF9F5] border border-[#D5CCC2] shadow-inner" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-wider text-[#A09C94] uppercase mr-2 rtl:mr-0 rtl:ml-2">
                        {paper.docRef}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="text-[9px] font-mono text-[#6C6A64] bg-[#EFE9DE] px-2 py-0.5 rounded border border-[#E6DFD8]">
                        {paper.dateStamp}
                      </span>
                      {/* Corner washi tape accent */}
                      <div
                        className="w-12 h-3.5 rounded-xs shadow-2xs rotate-[-2deg] opacity-75 hidden sm:block border"
                        style={{ backgroundColor: `${paper.color}25`, borderColor: `${paper.color}60` }}
                      />
                    </div>
                  </div>

                  {/* Notebook Page Body with Ruled Lines & Margin Guide */}
                  <div
                    className="p-5 sm:p-7 relative"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(#FAF9F5, #FAF9F5 29px, #EFE9DE/70 30px)',
                      backgroundPosition: '0 8px',
                    }}
                  >
                    {/* Classic Red / Coral Vertical Margin Rule Line */}
                    <div className="absolute top-0 bottom-0 right-12 rtl:right-12 rtl:left-auto ltr:left-12 ltr:right-auto w-[1.5px] bg-[#CC785C]/25 pointer-events-none" />

                    {/* Paper Title Header */}
                    <div className="flex items-start justify-between gap-3.5 relative z-10">
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: paper.color }}
                        >
                          {paper.icon}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <h3 className="text-base sm:text-lg font-black text-[#141413] leading-snug">
                            {paper.title}
                          </h3>
                          <p className="text-xs text-[#6C6A64] mt-0.5 font-medium leading-relaxed">
                            {paper.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Interactive Open/Folded State Pill */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 transition-all flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-[#CC785C]/15 text-[#CC785C] border border-[#CC785C]/30 shadow-2xs'
                            : 'bg-[#EFE9DE] text-[#6C6A64] border border-[#E6DFD8]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-[#CC785C] animate-pulse' : 'bg-[#A09C94]'
                          }`}
                        />
                        <span>{isActive ? (isAr ? 'وثيقة مفتوحة' : 'Dossier Open') : (isAr ? 'انقر للتصفح ↘' : 'Click to Unfold ↘')}</span>
                      </span>
                    </div>

                    {/* Unfolded Document Content & Highlights Checklist */}
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-5 mt-4 border-t border-[#E6DFD8] space-y-4">
                            {/* Summary Paragraph */}
                            <p className="text-xs sm:text-sm text-[#3D3D3A] leading-relaxed font-normal bg-white/70 p-3.5 rounded-xl border border-[#E6DFD8]">
                              {paper.content}
                            </p>

                            {/* Checklist of Dossier Highlights */}
                            <div className="space-y-2 pt-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A09C94] block">
                                {isAr ? 'محتويات الوثيقة التنفيذية:' : 'Included In This Dossier:'}
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {paper.highlights?.map((highlight, hIdx) => (
                                  <div
                                    key={hIdx}
                                    className="p-2.5 rounded-xl bg-[#FAF0E8]/70 border border-[#E6DFD8] flex items-start gap-2 text-xs text-[#3D3D3A]"
                                  >
                                    <span
                                      className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0 text-[10px] font-bold mt-0.5"
                                      style={{ backgroundColor: paper.color }}
                                    >
                                      ✓
                                    </span>
                                    <span className="leading-snug">{highlight}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action CTA within the unfolded notebook */}
                            <div className="pt-2 flex items-center justify-between gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (user) setCurrentView('dashboard');
                                  else setCurrentView('auth');
                                }}
                                className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl text-white shadow-md hover:shadow-lg transition-all cursor-pointer btn-shimmer"
                                style={{ backgroundColor: paper.color }}
                              >
                                <span>{isAr ? 'بدء العمل بهذه المخرجات' : 'Execute with this document'}</span>
                                <ArrowIcon className="w-3.5 h-3.5" />
                              </button>

                              <span className="text-[10px] text-[#A09C94] font-mono">
                                REF: #{paper.id.toUpperCase()}-2026
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Bottom paper shadow line */}
                    <div className="absolute bottom-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#E6DFD8] to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Clean user helper text */}
        <p className="text-center text-xs font-semibold text-[#8C877E] pt-2">
          {isAr
            ? '💡 انقر على أي وثيقة لفتح تفاصيلها أو إعادة طيّها'
            : '💡 Click any document to inspect details or fold it back'}
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
