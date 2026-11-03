import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, FileText, RefreshCw, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms' | 'refund' | 'data-deletion';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'privacy' }) => {
  const { lang, t, currentView, setCurrentView } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'refund' | 'data-deletion'>(
    (currentView as any) === 'terms' ? 'terms' :
    (currentView as any) === 'refund' ? 'refund' :
    (currentView as any) === 'data-deletion' ? 'data-deletion' :
    initialTab
  );

  useEffect(() => {
    if (['privacy', 'terms', 'refund', 'data-deletion'].includes(currentView)) {
      setActivePolicy(currentView as any);
    }
  }, [currentView]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12 animate-fade-in text-[#141413]">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#CC785C] uppercase tracking-wider">
          {isAr ? 'الامتثال القانوني والشفافية' : 'Legal Compliance & Trust'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {activePolicy === 'privacy' && (isAr ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy & Data Protection Policy')}
          {activePolicy === 'terms' && (isAr ? 'الشروط والأحكام العامة' : 'Terms of Service')}
          {activePolicy === 'refund' && (isAr ? 'سياسة الاسترداد وإلغاء الرصيد' : 'Refund & Cancellation Policy')}
          {activePolicy === 'data-deletion' && (isAr ? 'تعليمات حذف بيانات Meta الرسمية' : 'Meta Data Deletion Instructions')}
        </h1>
        <p className="text-xs sm:text-sm text-[#6C6A64]">
          {isAr ? 'آخر تحديث: 1 مارس 2026 · متوافق تماماً مع سياسات مطوري Meta Platforms, Inc.' : 'Last updated: March 2026 · Compliant with Meta Developer Policies'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="p-3 bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl space-y-1">
          <button
            onClick={() => setActivePolicy('privacy')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left rtl:text-right ${
              activePolicy === 'privacy' ? 'bg-[#181715] text-white' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#5DB8A6]" />
            <span>{t.footer.privacyPolicy}</span>
          </button>

          <button
            onClick={() => setActivePolicy('terms')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left rtl:text-right ${
              activePolicy === 'terms' ? 'bg-[#181715] text-white' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#CC785C]" />
            <span>{t.footer.termsOfService}</span>
          </button>

          <button
            onClick={() => setActivePolicy('refund')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left rtl:text-right ${
              activePolicy === 'refund' ? 'bg-[#181715] text-white' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-[#E8A55A]" />
            <span>{t.footer.refundPolicy}</span>
          </button>

          <button
            onClick={() => setActivePolicy('data-deletion')}
            className={`w-full p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left rtl:text-right ${
              activePolicy === 'data-deletion' ? 'bg-[#181715] text-white' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <Trash2 className="w-4 h-4 text-[#C64545]" />
            <span>{t.footer.dataDeletion}</span>
          </button>
        </aside>

        {/* Policy Content */}
        <div className="md:col-span-3 bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl p-6 sm:p-10 space-y-6 text-xs sm:text-sm text-[#3D3D3A] leading-relaxed">
          {activePolicy === 'privacy' && (
            <>
              <div className="p-4 bg-[#EFE9DE] rounded-xl border border-[#E6DFD8]">
                <p className="font-bold text-[#141413]">
                  {isAr
                    ? 'نحن نلتزم بحماية خصوصيتك ومعلومات حساباتك بنسبة 100%. لا نجمع سوى المؤشرات الإحصائية العامة التي تفوضنا صراحةً بقراءتها.'
                    : 'We are 100% committed to your privacy. We strictly ingest verified statistical aggregates authorized via official Meta permissions.'}
                </p>
              </div>
              <h3 className="font-bold text-base text-[#141413]">1. البيانات التي نجمعها عبر Meta Graph API</h3>
              <p>
                {isAr
                  ? 'عند ربط حساب Instagram أو صفحة Facebook، نطلب رموز وصول مشفرة (Access Tokens) من خلال Meta Graph API لقراءة: عدد المتابعين، معدلات الوصول، المشاهدات، والتفاعلات على المنشورات. نحن لا نطلب أو نخزن كلمات المرور أبداً، كما لا نقرأ الرسائل الخاصة.'
                  : 'Upon connecting Instagram or Facebook Pages, encrypted access tokens are exchanged via Meta Graph API strictly to read: follower aggregates, reach, impressions, and post engagement. We never ask for or store your passwords, nor inspect direct messages.'}
              </p>
              <h3 className="font-bold text-base text-[#141413]">2. استخدام البيانات وحظر التدريب العام</h3>
              <p>
                {isAr
                  ? 'تُستخدم البيانات حصرياً لإنتاج التقرير التشخيصي وخطة المحتوى لـ 30 يوماً داخل حسابك. لا نبيع البيانات لأي طرف ثالث ولا نستخدم منشوراتك لتدريب نماذج ذكاء اصطناعي عامة دون موافقتك الصريحة.'
                  : 'Data is used solely to generate your private diagnostic report and 30-day content calendar. We never sell data to third parties nor use your posts to train public foundation models.'}
              </p>
              <h3 className="font-bold text-base text-[#141413]">3. الاحتفاظ بالبيانات وحذفها</h3>
              <p>
                {isAr
                  ? 'يمكنك فصل حسابك أو حذف كامل بياناته وتقاريره بضغطة زر واحدة من خلال لوحة التحكم أو عبر مسار Data Deletion Callback.'
                  : 'You can disconnect accounts and request comprehensive deletion of all associated historical reports at any time from your dashboard or via Meta callback.'}
              </p>
            </>
          )}

          {activePolicy === 'terms' && (
            <>
              <h3 className="font-bold text-base text-[#141413]">1. طبيعة الخدمة والحدود الإحصائية</h3>
              <p>
                {isAr
                  ? 'تقدم منصة ORVEX AI تقارير استشارية مبنية على البيانات المتوفرة والذكاء الاصطناعي. لا تضمن المنصة بأي شكل من الأشكال تحقيق عدد محدد من المشاهدات أو الزيارات أو المبيعات، حيث تخضع خوارزميات التوزيع لعوامل وسلوكيات خارج نطاق سيطرتنا.'
                  : 'ORVEX AI provides analytical and strategic content insights. The service makes no representations or guarantees regarding specific reach, impressions, viral spread, or monetary sales.'}
              </p>
              <h3 className="font-bold text-base text-[#141413]">2. باقات المحاولات والمحافظ</h3>
              <p>
                {isAr
                  ? 'رصيد المحاولات في كل من محفظة Instagram ومحفظة Facebook دائم ولا تنتهي صلاحيته مع مرور الوقت. تُخصم المحاولة فقط عند اكتمال إنتاج التقرير التشخيصي بنجاح، وتشمل المحاولة التقرير والخطة وسؤال المتابعة وجلسة الاستشارة.'
                  : 'Trial credits in Instagram and Facebook wallets never expire. Credits are atomically deducted only upon successful completion of the diagnostic audit, including calendar, follow-up, and chat.'}
              </p>
              <h3 className="font-bold text-base text-[#141413]">3. قيود الاستخدام وحظر Scraping</h3>
              <p>
                {isAr
                  ? 'يُحظر استخدام المنصة لتحليل حسابات لا تملك تفويضاً رسمياً لإدارتها، كما تلتزم المنصة بحظر أساليب الكشط الآلي (Scraping) احتراماً لسياسات المنصات الرسمية.'
                  : 'Users are strictly prohibited from connecting accounts they do not lawfully manage. Scraping and session hijacking are strictly banned.'}
              </p>
            </>
          )}

          {activePolicy === 'refund' && (
            <>
              <h3 className="font-bold text-base text-[#141413]">1. سياسة استرداد الرصيد المالي</h3>
              <p>
                {isAr
                  ? 'نظراً لأن الرصيد لا تنتهي صلاحيته، يمكن للمستخدم طلب استرداد مالي كامل للمحاولات غير المستهلكة خلال 14 يوماً من تاريخ الشراء عبر PayPal. المحاولات المستهلكة في تقارير مكتملة لا تخضع للاسترداد.'
                  : 'Because trial credits never expire, users may request a full refund for unconsumed trial credits within 14 days of PayPal purchase. Consumed credits that generated full reports are non-refundable.'}
              </p>
              <h3 className="font-bold text-base text-[#141413]">2. حماية الأعطال الفنية وانقطاع الواجهات</h3>
              <p>
                {isAr
                  ? 'في حال حدوث خطأ تقني في خوادم التحليل أو انقطاع في واجهات Meta أدى إلى عدم تسليم التقرير كاملاً، لا يُخصم الرصيد تلقائياً أو يُعاد فوراً إلى محفظتك دون الحاجة لتقديم طلب.'
                  : 'If a technical failure or upstream API disruption prevents full delivery of your diagnostic audit, credits are never deducted or are automatically restored to your wallet.'}
              </p>
            </>
          )}

          {activePolicy === 'data-deletion' && (
            <>
              <div className="p-4 bg-[#EFE9DE] rounded-xl border border-[#E6DFD8] space-y-1">
                <p className="font-bold text-[#141413]">
                  {isAr ? 'بروتوكول حذف بيانات Meta الرسمي (User Data Deletion Callback)' : 'Official Meta User Data Deletion Callback Protocol'}
                </p>
                <p className="text-xs text-[#6C6A64]">
                  {isAr
                    ? 'التزاماً بسياسات مطوري Meta Platforms, Inc. نوفر آلية موثقة لحذف بياناتك بالكامل.'
                    : 'In compliance with Meta Platforms Developer Data Policies, we provide an automated audit-tracked deletion mechanism.'}
                </p>
              </div>

              <h3 className="font-bold text-base text-[#141413]">خطوات حذف بيانات حسابك:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  {isAr
                    ? 'يمكنك التوجه إلى لوحة التحكم > الحسابات المرتبطة، ثم الضغط على زر "فصل الحساب" بجانب أي حساب.'
                    : 'Navigate to Dashboard > Connected Accounts, and click "Disconnect" next to any connected account.'}
                </li>
                <li>
                  {isAr
                    ? 'من خلال إعدادات حسابك في Facebook أو Instagram، ادخل إلى "التطبيقات ومواقع الويب" (Apps and Websites)، وابحث عن تطبيق ORVEX AI، ثم اضغط على "إزالة" (Remove).'
                    : 'Inside your Meta account settings, go to "Apps and Websites", find ORVEX AI, and click "Remove".'}
                </li>
                <li>
                  {isAr
                    ? 'سيقوم خادمنا فوراً بتنفيذ استدعاء Data Deletion Callback ومسح جميع رموز الوصول والبيانات المؤقتة وتزويدك برمز متابعة.'
                    : 'Our server executes the Data Deletion Callback immediately, invalidating tokens and deleting cached statistics.'}
                </li>
              </ol>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
