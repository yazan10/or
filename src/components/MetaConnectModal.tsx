import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SocialPlatform } from '../types';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Instagram, Facebook } from 'lucide-react';

export const MetaConnectModal: React.FC = () => {
  const { isConnectModalOpen, closeConnectModal, connectPlatform, connectAccount, lang, t } = useApp();
  const [platform, setPlatform] = useState<SocialPlatform>(connectPlatform || 'instagram');
  const [accountName, setAccountName] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if opened with prop
  React.useEffect(() => {
    if (connectPlatform) setPlatform(connectPlatform);
  }, [connectPlatform]);

  if (!isConnectModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await connectAccount(
      platform,
      accountName || (platform === 'instagram' ? 'حساب تجريبي جديد' : 'صفحة تجريبية جديدة'),
      username || `${platform}_creator_${Math.floor(Math.random() * 1000)}`
    );
    setIsSubmitting(false);
    if (success) {
      closeConnectModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-[#141413]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#181715] flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4 text-[#5DB8A6]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#141413]">
                {t.metaConnectModal.title}
              </h3>
              <p className="text-xs text-[#6C6A64]">
                {lang === 'ar' ? 'تفويض آمن ومباشر عبر Meta Graph API' : 'Direct secure authorization via Meta Graph API'}
              </p>
            </div>
          </div>
          <button
            onClick={closeConnectModal}
            className="text-[#6C6A64] hover:text-[#141413] transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Buttons */}
        <div>
          <label className="block text-xs font-semibold text-[#3D3D3A] mb-2">
            {t.metaConnectModal.stepSelectPlatform}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlatform('instagram')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                platform === 'instagram'
                  ? 'bg-gradient-to-r from-[#FAF0EA] to-[#F5F0E8] border-[#CC785C] shadow-sm'
                  : 'bg-white border-[#E6DFD8] hover:bg-[#EFE9DE]'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <div className="text-left rtl:text-right">
                <p className="text-xs font-bold text-[#141413]">Instagram</p>
                <p className="text-[11px] text-[#6C6A64]">{lang === 'ar' ? 'Business أو Creator' : 'Business or Creator'}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPlatform('facebook')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                platform === 'facebook'
                  ? 'bg-gradient-to-r from-[#FAF0EA] to-[#F5F0E8] border-[#CC785C] shadow-sm'
                  : 'bg-white border-[#E6DFD8] hover:bg-[#EFE9DE]'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center shrink-0">
                <Facebook className="w-4 h-4" />
              </div>
              <div className="text-left rtl:text-right">
                <p className="text-xs font-bold text-[#141413]">Facebook</p>
                <p className="text-[11px] text-[#6C6A64]">{lang === 'ar' ? 'الصفحات العامة والأصول' : 'Pages & Managed Assets'}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Input Details */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                {lang === 'ar' ? 'اسم الحساب / الصفحة' : 'Account or Page Name'}
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder={platform === 'instagram' ? 'Culinary Studio' : 'Modern Tech Labs'}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                {lang === 'ar' ? 'معرّف الحساب (Username)' : 'Handle / Username'}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={platform === 'instagram' ? '@culinary_studio' : 'moderntechlabs'}
                className="w-full px-3 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
              />
            </div>
          </div>

          {/* Transparent Permissions Explanation */}
          <div className="bg-[#EFE9DE] p-4 rounded-xl border border-[#E6DFD8] space-y-2">
            <h4 className="text-xs font-bold text-[#141413] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#5DB8A6]" />
              <span>{t.metaConnectModal.permissionsHeading}</span>
            </h4>
            <ul className="text-[11px] text-[#6C6A64] space-y-1.5 leading-relaxed">
              {platform === 'instagram' ? (
                <>
                  <li>• {t.metaConnectModal.perm1}</li>
                  <li>• {t.metaConnectModal.perm2}</li>
                </>
              ) : (
                <>
                  <li>• {t.metaConnectModal.perm3}</li>
                  <li>• {t.metaConnectModal.perm4}</li>
                </>
              )}
            </ul>
          </div>

          {/* Security Guarantee Box */}
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FAF9F5] border border-[#5DB8A6]/40 text-xs text-[#3D3D3A]">
            <ShieldCheck className="w-4 h-4 text-[#5DB8A6] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#6C6A64] leading-relaxed">
              {t.metaConnectModal.securityGuarantee}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeConnectModal}
              className="px-4 py-2 text-xs font-medium text-[#6C6A64] hover:text-[#141413] transition-colors"
            >
              {t.metaConnectModal.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (lang === 'ar' ? 'جاري التفويض...' : 'Authorizing...') : t.metaConnectModal.connectAction}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
