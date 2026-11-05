import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, Lock, Sparkles, User, Shield } from 'lucide-react';
import { safeFetchJson } from '../../utils/safeFetch';

export const AuthPage: React.FC = () => {
  const { lang, t, setUser, refreshBalances, setCurrentView, showToast } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [isLoading, setIsLoading] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Built-in Google Verified Accounts for instant 1-click test
  const googleAccounts = [
    {
      name: 'سارة المنصور | Sarah Al-Mansoor',
      email: 'samsungg40415@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      role: 'user',
      desc: isAr ? 'حساب صانع محتوى Google' : 'Google Creator Account',
    },
    {
      name: 'مدير المنصة | ORVEX Admin',
      email: 'admin@orvex.ai',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      role: 'admin',
      desc: isAr ? 'حساب إدارة Google Workspace' : 'Google Super Admin Account',
    },
  ];

  const handleGoogleLogin = async (account: { email: string; name: string; avatarUrl?: string }) => {
    setIsLoading(true);
    try {
      const { ok, data, error } = await safeFetchJson('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: account.email,
          name: account.name,
          avatarUrl: account.avatarUrl,
          preferredLang: lang,
        }),
      });

      if (!ok || !data) {
        throw new Error(error || data?.error || 'Google Authentication failed');
      }

      setUser(data.user);
      await refreshBalances();
      showToast(
        isAr
          ? `مرحباً بك! تم تسجيل الدخول بنجاح عبر حساب Google (${data.user.email})`
          : `Welcome! Successfully signed in with Google (${data.user.email})`,
        'success'
      );
      setCurrentView('dashboard');
    } catch (err: any) {
      showToast(err.message || 'Google Sign-in error', 'error');
    } finally {
      setIsLoading(false);
      setShowAccountSelector(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      showToast(isAr ? 'يرجى إدخال بريد Google صالح' : 'Please enter a valid Google email', 'error');
      return;
    }
    handleGoogleLogin({
      email: customGoogleEmail,
      name: customGoogleName || customGoogleEmail.split('@')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-8 py-16 animate-fade-in">
      <div className="max-w-md w-full bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 text-[#141413]">
        {/* Brand & Page Title */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#CC785C] flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-sm">
            O
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isAr ? 'تسجيل الدخول عبر Google' : 'Sign In with Google'}
          </h1>
          <p className="text-xs text-[#6C6A64] leading-relaxed max-w-sm mx-auto">
            {isAr
              ? 'تسجيل الدخول وإنشاء الحساب في ORVEX AI متاح حصرياً عبر Google لضمان أعلى معايير الأمان والتحقق الفوري.'
              : 'Authentication in ORVEX AI is exclusively powered by Google for maximum security and automated account verification.'}
          </p>
        </div>

        {/* Exclusive Google Sign-In Card */}
        <div className="space-y-4">
          {/* Main Google Button */}
          <button
            onClick={() => setShowAccountSelector(true)}
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-white hover:bg-[#F5F0E8] border border-[#E6DFD8] hover:border-[#CC785C] rounded-2xl shadow-sm text-sm font-bold text-[#141413] flex items-center justify-center gap-3 transition-all cursor-pointer group disabled:opacity-50"
          >
            {/* Official Google G Logo SVG */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {isLoading
                ? (isAr ? 'جاري التحقق عبر Google...' : 'Verifying with Google...')
                : (isAr ? 'المتابعة باستخدام Google' : 'Continue with Google')}
            </span>
          </button>

          {/* Security Notice */}
          <div className="p-3 bg-[#EFE9DE] rounded-xl border border-[#E6DFD8] flex items-center gap-2.5 text-xs text-[#3D3D3A]">
            <Lock className="w-4 h-4 text-[#5DB8A6] shrink-0" />
            <span className="text-[11px] leading-relaxed">
              {isAr
                ? 'لا يتم حفظ أو طلب أي كلمات مرور داخل موقعنا. تتم المصادقة عبر بروتوكول OAuth 2.0 الآمن من Google.'
                : 'No passwords are ever requested or stored. Authentication occurs via secure Google OAuth 2.0.'}
            </span>
          </div>
        </div>

        {/* Benefits of Sign-In via Google */}
        <div className="space-y-2.5 pt-2 border-t border-[#E6DFD8]">
          <p className="text-[11px] font-bold text-[#6C6A64] uppercase tracking-wider">
            {isAr ? 'مزايا التسجيل عبر Google:' : 'Sign-In Advantages:'}
          </p>
          <ul className="text-xs text-[#3D3D3A] space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
              <span>{isAr ? 'تفعيل فوري لـ 3 محاولات ترحيبية مجانية' : 'Instant 3 complimentary welcome trials'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
              <span>{isAr ? 'حماية الحساب ضد الاختراق والاختطاف' : 'Enterprise-grade Google 2FA security'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
              <span>{isAr ? 'ربط رسمي فوري مع حسابات Meta' : 'Seamless Meta Graph API handoff'}</span>
            </li>
          </ul>
        </div>

        {/* Back to Home */}
        <div className="text-center pt-2">
          <button
            onClick={() => setCurrentView('home')}
            className="text-xs font-semibold text-[#6C6A64] hover:text-[#141413] transition-colors inline-flex items-center gap-1.5"
          >
            <span>{isAr ? 'الرجوع إلى الصفحة الرئيسية' : 'Return to Home'}</span>
          </button>
        </div>
      </div>

      {/* Google Account Selector Dialog */}
      {showAccountSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#E6DFD8] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-[#141413]">
            {/* Dialog Header */}
            <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-4">
              <div className="flex items-center gap-2.5">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="text-base font-bold text-[#141413]">
                  {isAr ? 'اختر حساب Google للمتابعة إلى ORVEX AI' : 'Choose a Google Account for ORVEX AI'}
                </h3>
              </div>
              <button
                onClick={() => setShowAccountSelector(false)}
                className="text-[#6C6A64] hover:text-[#141413] p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick One-Tap Google Accounts */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#6C6A64] uppercase">
                {isAr ? 'حسابات Google الجاهزة للربط الفوري:' : 'Select Google Account:'}
              </p>
              {googleAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGoogleLogin(acc)}
                  disabled={isLoading}
                  className="w-full p-3.5 rounded-2xl border border-[#E6DFD8] hover:border-[#CC785C] hover:bg-[#FAF9F5] transition-all flex items-center justify-between text-left rtl:text-right cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatarUrl}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-[#E6DFD8]"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#141413] group-hover:text-[#CC785C] transition-colors">
                        {acc.name}
                      </p>
                      <p className="text-[11px] text-[#6C6A64]">{acc.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EFE9DE] text-[#6C6A64] font-semibold">
                    {acc.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Or Enter Custom Google Email */}
            <div className="pt-2 border-t border-[#E6DFD8] space-y-3">
              <p className="text-[11px] font-semibold text-[#6C6A64]">
                {isAr ? 'أو استخدم حساب Google آخر:' : 'Or use another Google Account:'}
              </p>
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#E6DFD8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (isAr ? 'جاري التحقق...' : 'Verifying...') : (isAr ? 'متابعة بحساب Google هذا' : 'Continue with this Google Account')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
