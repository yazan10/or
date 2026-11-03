import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, MessageSquare, Send, ShieldCheck, CheckCircle2, Clock, HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { lang, t, showToast } = useApp();
  const isAr = lang === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      showToast(isAr ? 'يرجى ملء الحقول المطلوبة' : 'Please fill all required fields', 'error');
      return;
    }
    setIsSent(true);
    showToast(isAr ? 'تم إرسال تذكرتك بنجاح! سنرد عليك خلال ساعات.' : 'Support ticket received! We will respond shortly.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12 animate-fade-in text-[#141413]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-[#CC785C] uppercase tracking-wider">
          {isAr ? 'مركز المساعدة وخدمة العملاء' : 'Support Desk & Assistance'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          {isAr ? 'تواصل مع فريق ORVEX AI' : 'Contact ORVEX AI Team'}
        </h1>
        <p className="text-sm sm:text-base text-[#6C6A64] leading-relaxed">
          {isAr
            ? 'نحن هنا لمساعدتك في استفسارات الربط، مشتريات PayPal، أو تفاصيل التقارير التشخيصية.'
            : 'Get assistance with Meta account integrations, PayPal billing reconciliation, or strategic reports.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <div className="p-6 bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9DE] flex items-center justify-center text-[#CC785C]">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold">{isAr ? 'البريد الإلكتروني للدعم' : 'Direct Support Email'}</h3>
            <p className="text-xs text-[#6C6A64]">support@orvex.ai</p>
            <p className="text-[11px] text-[#A09C94]">{isAr ? 'نرد خلال 4-8 ساعات كحد أقصى' : 'Response time: under 8 hours'}</p>
          </div>

          <div className="p-6 bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9DE] flex items-center justify-center text-[#5DB8A6]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold">{isAr ? 'أوقات العمل المباشر' : 'Operating Hours'}</h3>
            <p className="text-xs text-[#6C6A64]">الأحد — الخميس: 9:00 ص — 6:00 م (توقيت مكة)</p>
            <p className="text-[11px] text-[#A09C94]">Sun — Thu: 9:00 AM — 6:00 PM (GMT+3)</p>
          </div>

          <div className="p-4 bg-[#EFE9DE] border border-[#E6DFD8] rounded-xl text-xs space-y-1">
            <p className="font-bold text-[#141413]">{isAr ? 'الأمان والامتثال' : 'Security Assurance'}</p>
            <p className="text-[#6C6A64] text-[11px]">
              {isAr ? 'لا نطلب أبداً كلمات المرور أو أرقام البطاقات المصرفية.' : 'We never request passwords or credit card credentials.'}
            </p>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="md:col-span-2 bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-[#141413]">
            {isAr ? 'إرسال تذكرة دعم فني جديدة' : 'Submit a Support Ticket'}
          </h2>

          {isSent ? (
            <div className="p-8 text-center space-y-3 bg-[#FAF0EA] border border-[#CC785C]/30 rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-[#5DB8A6] mx-auto" />
              <h3 className="text-base font-bold text-[#141413]">{isAr ? 'تم استلام رسالتك بنجاح!' : 'Ticket Received!'}</h3>
              <p className="text-xs text-[#6C6A64] max-w-sm mx-auto">
                {isAr
                  ? 'شكراً لتواصلك. سيقوم أحد مهندسي الدعم بمراجعة طلبك والرد عليك عبر بريدك الإلكتروني.'
                  : 'Thank you for reaching out. Our support engineering team will follow up via email shortly.'}
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="mt-2 text-xs font-bold text-[#CC785C] hover:underline cursor-pointer"
              >
                {isAr ? 'إرسال استفسار آخر' : 'Submit another query'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#3D3D3A] mb-1">
                    {isAr ? 'الاسم الكامل' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'سارة المنصور' : 'Sarah Miller'}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6DFD8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#3D3D3A] mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E6DFD8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#3D3D3A] mb-1">
                  {isAr ? 'موضوع الاستفسار' : 'Subject'}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6DFD8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                >
                  <option value="">{isAr ? 'اختر تصنيف الاستفسار...' : 'Select topic category...'}</option>
                  <option value="meta_oauth">{isAr ? 'استفسار حول ربط Meta OAuth' : 'Meta OAuth Connection Assistance'}</option>
                  <option value="billing">{isAr ? 'المدفوعات ورصيد المحفظة PayPal' : 'PayPal Billing & Credits'}</option>
                  <option value="report_ai">{isAr ? 'استفسار حول التقرير أو خطة المحتوى' : 'Report & Strategy Consultation'}</option>
                  <option value="other">{isAr ? 'أمر آخر' : 'General Inquiry'}</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#3D3D3A] mb-1">
                  {isAr ? 'نص الرسالة أو تفاصيل المشكلة' : 'Message Details'}
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isAr ? 'اكتب تفاصيل استفسارك هنا...' : 'Provide specific details regarding your inquiry...'}
                  className="w-full p-3.5 bg-white border border-[#E6DFD8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAr ? 'إرسال التذكرة' : 'Submit Ticket'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
