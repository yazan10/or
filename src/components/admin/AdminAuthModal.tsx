import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, User, Eye, EyeOff, X, AlertTriangle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ isOpen, onClose }) => {
  const { lang, t, setUser, setWallet, setCurrentView, showToast, refreshBalances } = useApp();
  const isAr = lang === 'ar';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isAr ? 'بيانات الاعتماد غير صحيحة' : 'Invalid credentials'));
      }

      setUser(data.user);
      if (data.wallet) {
        setWallet(data.wallet);
      }
      await refreshBalances();

      showToast(
        isAr
          ? 'تم تسجيل الدخول بنجاح إلى لوحة الإدارة'
          : 'Successfully authenticated to administration portal',
        'success'
      );

      onClose();
      setCurrentView('admin');
    } catch (err: any) {
      setErrorMessage(err.message || (isAr ? 'فشل التحقق من بيانات الدخول' : 'Authentication failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#181715] text-[#FAF9F5] border border-[#35322D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-[#A09C94] hover:text-[#FAF9F5] p-1.5 rounded-xl hover:bg-[#252320] transition-colors cursor-pointer"
          title={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Badge & Header */}
        <div className="text-center space-y-3">
          <div className="w-13 h-13 rounded-2xl bg-[#CC785C]/20 border border-[#CC785C]/40 text-[#CC785C] flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#35322D] border border-[#444039] text-[#A09C94] text-[11px] font-semibold">
            <Lock className="w-3 h-3 text-[#5DB8A6]" />
            <span>{isAr ? 'مصادقة الإدارة المعتمدة' : 'Authorized Gateway'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#FAF9F5]">
            {t.adminAuth.title}
          </h2>
          <p className="text-xs text-[#A09C94] leading-relaxed max-w-xs mx-auto">
            {t.adminAuth.subtitle}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-[#C64545]/15 border border-[#C64545]/40 text-[#C64545] text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A09C94]">
              {t.adminAuth.usernameLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-[#A09C94]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.adminAuth.usernamePlaceholder}
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-3 py-2.5 text-xs bg-[#252320] border border-[#35322D] rounded-xl text-[#FAF9F5] placeholder-[#6C6A64] focus:outline-none focus:border-[#CC785C] focus:ring-1 focus:ring-[#CC785C]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A09C94]">
              {t.adminAuth.passwordLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 pl-3 rtl:pl-0 rtl:pr-3 flex items-center pointer-events-none text-[#A09C94]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.adminAuth.passwordPlaceholder}
                className="w-full pl-9 rtl:pl-3 rtl:pr-9 pr-10 rtl:pr-9 rtl:pl-10 py-2.5 text-xs bg-[#252320] border border-[#35322D] rounded-xl text-[#FAF9F5] placeholder-[#6C6A64] focus:outline-none focus:border-[#CC785C] focus:ring-1 focus:ring-[#CC785C]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 pr-3 rtl:pr-0 rtl:pl-3 flex items-center text-[#A09C94] hover:text-[#FAF9F5] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full py-3 text-xs font-bold rounded-xl bg-gradient-to-r from-[#CC785C] to-[#A9583E] hover:from-[#A9583E] hover:to-[#924732] text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 btn-shimmer"
          >
            {isLoading ? (
              <span>{isAr ? 'جاري التحقق...' : 'Authenticating...'}</span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>{t.adminAuth.loginBtn}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
