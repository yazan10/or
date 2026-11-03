import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronDown, HelpCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { lang, t, setCurrentView } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      category: isAr ? 'الأمان والصلاحيات' : 'Security & Permissions',
      q: isAr ? 'هل تطلب المنصة كلمة مرور حسابي على Instagram أو Facebook؟' : 'Does ORVEX AI ever ask for my Instagram or Facebook password?',
      a: isAr
        ? 'قطعاً لا. يتم الربط حصرياً عبر تدفق OAuth الرسمي والآمن من شركة Meta. تمنحنا صلاحيات قراءة مؤشرات الأداء فقط دون الوصول لكلمة المرور أو الرسائل الخاصة.'
        : 'Never. Authorization happens strictly through Meta’s official OAuth dialog. We only receive encrypted, read-only analytics permissions without ever seeing your password.',
    },
    {
      category: isAr ? 'الأمان والصلاحيات' : 'Security & Permissions',
      q: isAr ? 'كيف أقوم بفصل الحساب وحذف بياناتي؟' : 'How can I disconnect an account and delete my data?',
      a: isAr
        ? 'بكل بساطة! يمكنك الضغط على زر "فصل الحساب" في لوحة التحكم، كما نوفر مسار Data Deletion Callback الرسمي التزاماً بسياسات Meta لمسح جميع السجلات ورموز الوصول فوراً.'
        : 'You can click "Disconnect" in your connected accounts dashboard anytime, or trigger the official Meta Data Deletion Callback protocol to wipe all cached data.',
    },
    {
      category: isAr ? 'الرصيد والمحافظ' : 'Credits & Wallets',
      q: isAr ? 'هل تنتهي صلاحية رصيد المحاولات إذا لم أستخدمها فوراً؟' : 'Do my trial credits expire if I do not use them immediately?',
      a: isAr
        ? 'الرصيد لا تنتهي صلاحيته أبداً! يظل محفوظاً في محفظتك بشكل دائم حتى تقرر استخدامه لإجراء تحليل.'
        : 'Your trial credits never expire! They remain permanently stored in your account wallet until you choose to conduct an audit.',
    },
    {
      category: isAr ? 'الرصيد والمحافظ' : 'Credits & Wallets',
      q: isAr ? 'ما الذي تشمله المحاولة الواحدة بالضبط؟' : 'What is included in a single trial credit?',
      a: isAr
        ? 'المحاولة الواحدة تشمل: التقرير التشخيصي الكامل، درجة الأداء مع شرح الحساب، تحليل أفضل وأسوأ المنشورات، خطة محتوى مخصصة لـ 30 يوماً، سؤال متابعة إضافي (حتى 500 حرف)، وجلسة استشارة ذكية (حتى 3000 حرف).'
        : 'A single credit includes: full diagnostic audit, weighted 0–100 performance score, top/bottom content postmortem, 30-day content calendar, follow-up Q&A (500 chars), and advisory chat (3,000 chars).',
    },
    {
      category: isAr ? 'التحليلات والمحتوى' : 'Analytics & AI Strategy',
      q: isAr ? 'هل يضمن التحليل وصول المنشورات إلى أعداد محددة من المشاهدات؟' : 'Does the audit guarantee a specific number of views or viral reach?',
      a: isAr
        ? 'لا نعد بأي أرقام وهمية أو وصول مضمون. خوارزميات التوصية تعتمد على سلوك الجمهور المتغير. دورنا هو تزويدك بتشخيص حقيقي بالأرقام وخطة محتوى مبنية على ما أثبت كفاءته لتزيد احتمالات نموك بأمان.'
        : 'We do not make false viral guarantees. Social recommendation engines depend on real-time audience behavior. We provide objective mathematical audits and proven frameworks to maximize organic consistency.',
    },
    {
      category: isAr ? 'المدفوعات وPayPal' : 'Payments & PayPal',
      q: isAr ? 'لماذا تختلف أسعار باقات Facebook عن باقات Instagram؟' : 'Why does Facebook pricing differ from Instagram pricing?',
      a: isAr
        ? 'لأن طبيعة الصلاحيات والبيانات تختلف؛ فإحصائيات صفحات فيسبوك العامة تتطلب استدعاءات أعمق لواجهات Meta وتكاليف معالجة مختلفة، لذلك حافظنا على محفظة وتسعير مستقل لكل منصة.'
        : 'Because Meta API capabilities, scope requirements, and processing pipelines differ between Instagram accounts and Facebook Pages, we operate independent wallets with platform-specific pricing.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12 animate-fade-in text-[#141413]">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-[#CC785C] uppercase tracking-wider">
          {isAr ? 'مركز الإجابات الشامل' : 'Knowledge Base & Answers'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {t.nav.faq}
        </h1>
        <p className="text-sm sm:text-base text-[#6C6A64]">
          {isAr ? 'كل ما تحتاج معرفته عن الأمان والرصيد وتكامل Meta والدفع عبر PayPal' : 'Clear answers on security, permanent credits, Meta integration, and billing'}
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl overflow-hidden shadow-sm transition-all"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-6 text-left rtl:text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#141413] hover:bg-[#EFE9DE]/50 transition-colors cursor-pointer"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#CC785C] uppercase block tracking-wider">
                  {faq.category}
                </span>
                <span>{faq.q}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#6C6A64] transition-transform duration-200 shrink-0 ${
                  openIdx === idx ? 'rotate-180 text-[#CC785C]' : ''
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-6 pb-6 text-xs sm:text-sm text-[#6C6A64] leading-relaxed border-t border-[#E6DFD8]/60 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help Desk Link */}
      <div className="bg-[#FAF0EA] border border-[#CC785C]/30 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-[#141413]">
          {isAr ? 'لم تجد إجابة لسؤالك؟' : 'Still have questions?'}
        </h3>
        <p className="text-xs text-[#6C6A64]">
          {isAr ? 'فريق الدعم الفني جاهز لمساعدتك في أي استفسار حول ربط الحسابات أو المدفوعات.' : 'Our support team is available to assist you with Meta integrations or account queries.'}
        </p>
        <button
          onClick={() => setCurrentView('contact')}
          className="px-5 py-2 text-xs font-bold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>{isAr ? 'تواصل مع الدعم الفني' : 'Contact Support'}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
