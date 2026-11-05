import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  Users,
  BarChart3,
  DollarSign,
  Share2,
  Sliders,
  FileCode,
  History,
  Settings,
  Plus,
  Edit2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Lock,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user, lang, t, showToast, setCurrentView } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'pricing' | 'prompts' | 'audit' | 'payments' | 'settings'>('stats');
  const [stats, setStats] = useState<any>({
    totalUsers: 142,
    totalAnalyses: 388,
    totalRevenueILS: 4890,
    totalConnected: 76,
  });
  const [usersList, setUsersList] = useState<any[]>([]);
  const [pricingSettings, setPricingSettings] = useState<any>(null);
  const [promptsList, setPromptsList] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // PayPal & Payments Admin State
  const [paypalConfig, setPaypalConfig] = useState<{
    clientId: string;
    clientSecret: string;
    environment: 'sandbox' | 'live';
    configured: boolean;
    currency: string;
  }>({
    clientId: '',
    clientSecret: '',
    environment: 'sandbox',
    configured: false,
    currency: 'USD',
  });
  const [paypalTransactions, setPaypalTransactions] = useState<any[]>([]);
  const [savingPaypal, setSavingPaypal] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Adjust credit modal state
  const [adjustTargetUser, setAdjustTargetUser] = useState<any>(null);
  const [adjustPlatform, setAdjustPlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [adjustAmount, setAdjustAmount] = useState<number>(3);
  const [adjustReason, setAdjustReason] = useState<string>('');

  // Selected Prompt template for editing
  const [editingPrompt, setEditingPrompt] = useState<any>(null);
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [resStats, resUsers, resPricing, resPrompts, resAudit, resPaypal, resTx] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/pricing'),
        fetch('/api/admin/prompts'),
        fetch('/api/admin/audit-logs'),
        fetch('/api/admin/paypal-config'),
        fetch('/api/paypal/transactions'),
      ]);

      if (resStats.ok) setStats(await resStats.json());
      if (resUsers.ok) {
        const uData = await resUsers.json();
        setUsersList(uData.users || []);
      }
      if (resPricing.ok) {
        const pData = await resPricing.json();
        setPricingSettings(pData.pricingSettings);
      }
      if (resPrompts.ok) {
        const prData = await resPrompts.json();
        setPromptsList(prData.promptTemplates || []);
      }
      if (resAudit.ok) {
        const aData = await resAudit.json();
        setAuditLogs(aData.auditLogs || []);
      }
      if (resPaypal.ok) {
        const ppData = await resPaypal.json();
        if (ppData.paypalConfig) {
          setPaypalConfig({
            clientId: ppData.paypalConfig.clientId || '',
            clientSecret: ppData.paypalConfig.clientSecret || '',
            environment: ppData.paypalConfig.environment || 'sandbox',
            configured: !!ppData.paypalConfig.configured,
            currency: ppData.paypalConfig.currency || 'USD',
          });
        }
      }
      if (resTx.ok) {
        const txData = await resTx.json();
        setPaypalTransactions(txData.transactions || []);
      }
    } catch (e) {
      console.warn('Error fetching admin data:', e);
    }
  };

  const fetchTransactionsOnly = async () => {
    setLoadingTransactions(true);
    try {
      const res = await fetch('/api/paypal/transactions');
      if (res.ok) {
        const data = await res.json();
        setPaypalTransactions(data.transactions || []);
        showToast(isAr ? 'تم تحديث سجل المعاملات' : 'Transactions updated', 'success');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleSavePaypalConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPaypal(true);
    try {
      const res = await fetch('/api/admin/paypal-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paypalConfig),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isAr ? 'تم حفظ إعدادات PayPal بنجاح!' : 'PayPal settings saved successfully!', 'success');
        setPaypalConfig((prev) => ({
          ...prev,
          configured: !!data.paypalConfig?.configured,
        }));
      } else {
        showToast(data.error || 'Failed to save PayPal settings', 'error');
      }
    } catch (e) {
      showToast('Error saving PayPal configuration', 'error');
    } finally {
      setSavingPaypal(false);
    }
  };

  const handleAdjustCredits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustReason.trim()) {
      showToast(t.admin.auditReasonRequired, 'error');
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${adjustTargetUser.id}/adjust-credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: adjustPlatform,
          amount: adjustAmount,
          reason: adjustReason,
        }),
      });

      if (res.ok) {
        showToast(isAr ? 'تم تعديل الرصيد وتوثيق الإجراء في سجل التدقيق.' : 'Credits adjusted and logged in audit trail.', 'success');
        setAdjustTargetUser(null);
        setAdjustReason('');
        fetchAdminData();
      } else {
        const err = await res.json();
        showToast(err.error || 'Adjustment failed', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Network error', 'error');
    }
  };

  const handleSavePricing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/pricing', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricingSettings),
      });

      if (res.ok) {
        showToast(isAr ? 'تم حفظ هيكل الباقات والأسعار بنجاح!' : 'Pricing matrix saved successfully!', 'success');
        fetchAdminData();
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving pricing', 'error');
    }
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrompt) return;

    try {
      const res = await fetch(`/api/admin/prompts/${editingPrompt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: promptText }),
      });

      if (res.ok) {
        showToast(isAr ? 'تم تحديث قالب Prompt بنجاح!' : 'Prompt template updated!', 'success');
        setEditingPrompt(null);
        fetchAdminData();
      }
    } catch (e: any) {
      showToast(e.message || 'Error saving prompt', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-[#181715] text-[#FAF9F5] border border-[#35322D] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#CC785C] flex items-center justify-center text-white font-bold shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{t.admin.title}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8A55A]/20 border border-[#E8A55A]/40 text-[#E8A55A] text-[11px] font-bold">
                {user?.name || 'yadmin'}
              </span>
            </div>
            <p className="text-xs text-[#A09C94]">{t.admin.subtitle}</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#252320] hover:bg-[#35322D] text-[#FAF9F5] border border-[#35322D] transition-colors cursor-pointer shrink-0"
        >
          {isAr ? 'العودة إلى لوحة المستخدم' : 'Switch to Creator View'}
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] space-y-2">
          <span className="text-xs text-[#6C6A64]">{t.admin.statTotalUsers}</span>
          <p className="text-3xl font-black text-[#141413] tabular-nums">{stats.totalUsers}</p>
          <p className="text-[11px] text-[#5DB8A6]">{isAr ? '+12 هذا الأسبوع' : '+12 this week'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] space-y-2">
          <span className="text-xs text-[#6C6A64]">{t.admin.statTotalAnalyses}</span>
          <p className="text-3xl font-black text-[#141413] tabular-nums">{stats.totalAnalyses}</p>
          <p className="text-[11px] text-[#5DB8A6]">{isAr ? 'عبر محرك ORVEX AI' : 'via ORVEX AI Engine'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] space-y-2">
          <span className="text-xs text-[#6C6A64]">{t.admin.statTotalRevenue}</span>
          <p className="text-3xl font-black text-[#CC785C] tabular-nums">{stats.totalRevenueILS.toLocaleString()} ILS</p>
          <p className="text-[11px] text-[#6C6A64]">{isAr ? 'تحصيل PayPal موثق' : 'Verified PayPal volume'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] space-y-2">
          <span className="text-xs text-[#6C6A64]">{t.admin.statConnectedAccounts}</span>
          <p className="text-3xl font-black text-[#141413] tabular-nums">{stats.totalConnected}</p>
          <p className="text-[11px] text-[#6C6A64]">{isAr ? 'حسابات Meta نشطة' : 'Active Meta tokens'}</p>
        </div>
      </div>

      {/* Admin Tab Switcher - Responsive horizontal scroll on mobile */}
      <div className="flex items-center gap-2 border-b border-[#E6DFD8] pb-3 overflow-x-auto no-scrollbar whitespace-nowrap shrink-0">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'stats' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          {t.admin.tabOverview}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'users' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          {t.admin.tabUsers}
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'pricing' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          {t.admin.tabPricing}
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'prompts' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          {t.admin.tabPrompts}
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
            activeTab === 'audit' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          {t.admin.tabAudit}
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'payments' ? 'bg-[#003087] text-white shadow-xs' : 'text-[#6C6A64] hover:text-[#141413]'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>{isAr ? 'بوابة الدفع PayPal والبطاقات' : 'PayPal & Card Gateway'}</span>
          {paypalTransactions.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'payments' ? 'bg-white/20 text-white' : 'bg-[#EFE9DE] text-[#141413]'
            }`}>
              {paypalTransactions.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB CONTENT: USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#141413]">{t.admin.tabUsers}</h3>
            <span className="text-xs text-[#6C6A64]">{usersList.length} registered accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-[#E6DFD8] text-[#6C6A64]">
                  <th className="py-2.5 font-semibold">User</th>
                  <th className="py-2.5 font-semibold">Email</th>
                  <th className="py-2.5 font-semibold">Role</th>
                  <th className="py-2.5 font-semibold">Instagram Credits</th>
                  <th className="py-2.5 font-semibold">Facebook Credits</th>
                  <th className="py-2.5 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD8]">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-white/60 transition-colors">
                    <td className="py-3 font-bold text-[#141413]">{u.name}</td>
                    <td className="py-3 text-[#6C6A64]">{u.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-[#CC785C]/10 text-[#CC785C]' : 'bg-[#EFE9DE] text-[#6C6A64]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-[#141413] tabular-nums">{u.instagramCredits}</td>
                    <td className="py-3 font-bold text-[#141413] tabular-nums">{u.facebookCredits}</td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => {
                          setAdjustTargetUser(u);
                          setAdjustPlatform('instagram');
                          setAdjustAmount(3);
                          setAdjustReason('');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded bg-[#EFE9DE] hover:bg-[#E8E0D2] text-[#141413] transition-colors cursor-pointer"
                      >
                        {t.admin.adjustCreditsBtn}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRICING MATRIX */}
      {activeTab === 'pricing' && pricingSettings && (
        <form onSubmit={handleSavePricing} className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-4">
            <div>
              <h3 className="text-base font-bold text-[#141413]">{t.admin.tabPricing}</h3>
              <p className="text-xs text-[#6C6A64]">{isAr ? 'تعديل أسعار باقات الشيقل وسعر تحويل PayPal' : 'Configure ILS pricing tiers and dynamic PayPal conversion rates'}</p>
            </div>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer"
            >
              {t.admin.saveChanges}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Instagram Settings */}
            <div className="p-5 bg-white rounded-xl border border-[#E6DFD8] space-y-4">
              <h4 className="text-xs font-bold text-[#CC785C] uppercase tracking-wider flex items-center gap-2">
                <span>Instagram Packages</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#6C6A64] mb-1">1st Purchase Trials</label>
                  <input
                    type="number"
                    value={pricingSettings.instagram.firstPurchaseTrials}
                    onChange={(e) => setPricingSettings({
                      ...pricingSettings,
                      instagram: { ...pricingSettings.instagram, firstPurchaseTrials: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E6DFD8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6C6A64] mb-1">1st Purchase Price (ILS)</label>
                  <input
                    type="number"
                    value={pricingSettings.instagram.firstPurchasePriceILS}
                    onChange={(e) => setPricingSettings({
                      ...pricingSettings,
                      instagram: { ...pricingSettings.instagram, firstPurchasePriceILS: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E6DFD8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6C6A64] mb-1">Recurring Trials</label>
                  <input
                    type="number"
                    value={pricingSettings.instagram.subsequentTrials}
                    onChange={(e) => setPricingSettings({
                      ...pricingSettings,
                      instagram: { ...pricingSettings.instagram, subsequentTrials: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E6DFD8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6C6A64] mb-1">Recurring Price (ILS)</label>
                  <input
                    type="number"
                    value={pricingSettings.instagram.subsequentPriceILS}
                    onChange={(e) => setPricingSettings({
                      ...pricingSettings,
                      instagram: { ...pricingSettings.instagram, subsequentPriceILS: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E6DFD8] rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Facebook Settings */}
            <div className="p-5 bg-white rounded-xl border border-[#E6DFD8] space-y-4">
              <h4 className="text-xs font-bold text-[#1877F2] uppercase tracking-wider flex items-center gap-2">
                <span>Facebook Packages</span>
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#6C6A64] mb-1">1st Purchase Trials</label>
                  <input
                    type="number"
                    value={pricingSettings.facebook.firstPurchaseTrials}
                    onChange={(e) => setPricingSettings({
                      ...pricingSettings,
                      facebook: { ...pricingSettings.facebook, firstPurchaseTrials: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E6DFD8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6C6A64] mb-1">1st Purchase Price (ILS)</label>
                  <input
                    type="number"
                    value={pricingSettings.facebook.firstPurchasePriceILS}
                    onChange={(e) => setPricingSettings({
                      ...pricingSettings,
                      facebook: { ...pricingSettings.facebook, firstPurchasePriceILS: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E6DFD8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6C6A64] mb-1">Recurring Trials</label>
                  <input
                    type="number"
                    value={pricingSettings.facebook.subsequentTrials}
                    onChange={(e) => setPricingSettings({
                      ...pricingSettings,
                      facebook: { ...pricingSettings.facebook, subsequentTrials: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E6DFD8] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#6C6A64] mb-1">Recurring Price (ILS)</label>
                  <input
                    type="number"
                    value={pricingSettings.facebook.subsequentPriceILS}
                    onChange={(e) => setPricingSettings({
                      ...pricingSettings,
                      facebook: { ...pricingSettings.facebook, subsequentPriceILS: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 text-xs border border-[#E6DFD8] rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic PayPal USD conversion rate */}
          <div className="p-4 bg-[#EFE9DE] rounded-xl border border-[#E6DFD8] max-w-sm space-y-1">
            <label className="block text-xs font-bold text-[#141413]">
              {isAr ? 'سعر صرف الشيقل إلى الدولار (ILS to USD Multiplier)' : 'ILS to USD Exchange Rate Multiplier'}
            </label>
            <input
              type="number"
              step="0.01"
              value={pricingSettings.ilsToUsdRate}
              onChange={(e) => setPricingSettings({ ...pricingSettings, ilsToUsdRate: parseFloat(e.target.value) || 0.27 })}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#E6DFD8] rounded-lg tabular-nums"
            />
          </div>
        </form>
      )}

      {/* TAB CONTENT: PROMPT TEMPLATES */}
      {activeTab === 'prompts' && (
        <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#141413]">{t.admin.tabPrompts}</h3>
            <span className="text-xs text-[#5DB8A6] font-semibold">{isAr ? 'تعمل مع محرك ORVEX AI' : 'Optimized for ORVEX AI Engine'}</span>
          </div>

          <div className="space-y-4">
            {promptsList.map((p) => (
              <div key={p.id} className="p-5 bg-white border border-[#E6DFD8] rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#141413]">{p.name}</h4>
                    <p className="text-[10px] text-[#6C6A64]">Type: {p.type} · Platform: {p.platform}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPrompt(p);
                      setPromptText(p.systemInstruction);
                    }}
                    className="text-xs text-[#CC785C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تعديل القالب' : 'Edit Prompt'}</span>
                  </button>
                </div>
                <pre className="text-[11px] text-[#3D3D3A] bg-[#FAF9F5] p-3 rounded-lg border border-[#E6DFD8] whitespace-pre-wrap font-mono max-h-36 overflow-y-auto">
                  {p.systemInstruction}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#141413]">{t.admin.tabAudit}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-[#E6DFD8] text-[#6C6A64]">
                  <th className="py-2.5 font-semibold">Timestamp</th>
                  <th className="py-2.5 font-semibold">Admin / Caller</th>
                  <th className="py-2.5 font-semibold">Action</th>
                  <th className="py-2.5 font-semibold">Details & Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD8]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/60 transition-colors">
                    <td className="py-3 text-[#6C6A64] tabular-nums">
                      {new Date(log.timestamp).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                    </td>
                    <td className="py-3 font-semibold">{log.adminEmail}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#181715] text-[#FAF9F5]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 text-[#3D3D3A]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PAYPAL & CARD PAYMENTS GATEWAY */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-1">
              <span className="text-[11px] text-[#6C6A64]">
                {isAr ? 'حالة بوابة PayPal' : 'PayPal Gateway Status'}
              </span>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${paypalConfig.configured ? 'bg-[#5DB8A6]' : 'bg-[#E8A55A]'}`} />
                <p className="text-base font-bold text-[#141413] uppercase tracking-wide">
                  {paypalConfig.environment} {paypalConfig.configured ? (isAr ? '(مربوط)' : '(Connected)') : (isAr ? '(محاكي Sandbox)' : '(Sandbox Mode)')}
                </p>
              </div>
              <p className="text-[11px] text-[#6C6A64]">
                {isAr ? 'يدعم Visa, Mastercard, AMEX, وباي بال' : 'Supports Visa, Mastercard, AMEX, PayPal'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-1">
              <span className="text-[11px] text-[#6C6A64]">
                {isAr ? 'إجمالي التحصيلات عبر البوابة' : 'Total Processed Volume'}
              </span>
              <p className="text-xl font-black text-[#003087] tabular-nums">
                ${paypalTransactions.reduce((acc, t) => acc + (t.amountUSD || 0), 0).toFixed(2)} USD
              </p>
              <p className="text-[11px] text-[#6C6A64] tabular-nums">
                ≈ {paypalTransactions.reduce((acc, t) => acc + (t.amountILS || 0), 0).toLocaleString()} ILS
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-1">
              <span className="text-[11px] text-[#6C6A64]">
                {isAr ? 'عدد العمليات الناجحة' : 'Successful Transactions'}
              </span>
              <div className="flex items-center justify-between">
                <p className="text-xl font-black text-[#141413] tabular-nums">
                  {paypalTransactions.length}
                </p>
                <button
                  onClick={fetchTransactionsOnly}
                  disabled={loadingTransactions}
                  className="p-1.5 rounded-lg border border-[#E6DFD8] hover:bg-[#FAF9F5] text-[#6C6A64] hover:text-[#141413] transition-colors cursor-pointer"
                  title={isAr ? 'تحديث السجل' : 'Refresh ledger'}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingTransactions ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-[11px] text-[#5DB8A6]">
                {isAr ? '100% تم التحقق منها وشحن المحفظة' : '100% verified & credited'}
              </p>
            </div>
          </div>

          {/* PayPal API Credentials Settings Form */}
          <form onSubmit={handleSavePaypalConfig} className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DFD8] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#141413] flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#003087]" />
                  <span>{isAr ? 'إعدادات مفاتيح PayPal REST API' : 'PayPal REST API Credentials'}</span>
                </h3>
                <p className="text-xs text-[#6C6A64]">
                  {isAr 
                    ? 'يمكنك تبديل البيئة بين Sandbox للاختبار و Live للإنتاج، وتحديث الـ Client ID والـ Secret'
                    : 'Switch between Sandbox and Live, and update your PayPal Client ID and Secret at runtime'}
                </p>
              </div>
              <button
                type="submit"
                disabled={savingPaypal}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-[#003087] hover:bg-[#002266] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {savingPaypal ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ إعدادات باي بال' : 'Save PayPal Config')}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                  {isAr ? 'بيئة التشغيل (Environment)' : 'Environment'}
                </label>
                <select
                  value={paypalConfig.environment}
                  onChange={(e) => setPaypalConfig({ ...paypalConfig, environment: e.target.value as 'sandbox' | 'live' })}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#003087]"
                >
                  <option value="sandbox">Sandbox (اختبار وتطوير)</option>
                  <option value="live">Live (إنتاج حقيقي)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                  PayPal Client ID
                </label>
                <input
                  type="text"
                  value={paypalConfig.clientId}
                  onChange={(e) => setPaypalConfig({ ...paypalConfig, clientId: e.target.value })}
                  placeholder="e.g. AeA1... (PayPal App Client ID)"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#003087]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                  PayPal Secret Key
                </label>
                <input
                  type="password"
                  value={paypalConfig.clientSecret}
                  onChange={(e) => setPaypalConfig({ ...paypalConfig, clientSecret: e.target.value })}
                  placeholder="••••••••••••••••••••••••"
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#003087]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#EFE9DE]/50 border border-[#E6DFD8] rounded-xl flex items-center justify-between text-[11px] text-[#6C6A64]">
              <div>
                <span className="font-semibold text-[#141413]">{isAr ? 'رابط الويب هوك الخاص بك: ' : 'Your PayPal Webhook URL: '}</span>
                <code className="font-mono bg-white px-2 py-0.5 rounded border border-[#E6DFD8] text-[#141413]">
                  {window.location.origin}/api/paypal/webhook
                </code>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/api/paypal/webhook`);
                  showToast(isAr ? 'تم نسخ رابط Webhook' : 'Webhook URL copied', 'success');
                }}
                className="text-[#CC785C] hover:underline font-bold cursor-pointer"
              >
                {isAr ? 'نسخ' : 'Copy'}
              </button>
            </div>
          </form>

          {/* Transactions Ledger Table */}
          <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#141413] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#CC785C]" />
                  <span>{isAr ? 'سجل العمليات والتحقق المالي المباشر' : 'Live Verified Transactions Ledger'}</span>
                </h3>
                <p className="text-xs text-[#6C6A64]">
                  {isAr ? 'بيانات دقيقة لكل عملية دفع بـ Visa/Mastercard أو PayPal مع رقم الفاتورة وحالة الرصيد' : 'Exact audit records including invoice ID, charged amounts, and balance updates'}
                </p>
              </div>
              <button
                onClick={fetchTransactionsOnly}
                disabled={loadingTransactions}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E6DFD8] hover:bg-[#EFE9DE] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingTransactions ? 'animate-spin' : ''}`} />
                <span>{isAr ? 'تحديث' : 'Refresh'}</span>
              </button>
            </div>

            {paypalTransactions.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6C6A64] bg-white rounded-xl border border-[#E6DFD8]">
                {isAr ? 'لا توجد عمليات دفع مسجلة حتى الآن' : 'No transactions recorded yet'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left rtl:text-right border-collapse">
                  <thead>
                    <tr className="border-b border-[#E6DFD8] text-[#6C6A64]">
                      <th className="py-2.5 font-semibold">{isAr ? 'رقم الفاتورة' : 'Invoice'}</th>
                      <th className="py-2.5 font-semibold">{isAr ? 'العميل' : 'Customer'}</th>
                      <th className="py-2.5 font-semibold">{isAr ? 'طريقة الدفع' : 'Method'}</th>
                      <th className="py-2.5 font-semibold">{isAr ? 'المبلغ المستلم' : 'Charged'}</th>
                      <th className="py-2.5 font-semibold">{isAr ? 'المحفظة / الرصيد' : 'Wallet / Credits'}</th>
                      <th className="py-2.5 font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="py-2.5 font-semibold">{isAr ? 'الوقت' : 'Date'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6DFD8]">
                    {paypalTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-white/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-[#141413]">
                          {tx.invoiceNumber || tx.id}
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-[#141413]">{tx.payerName || 'User'}</p>
                          <p className="text-[11px] text-[#6C6A64]">{tx.payerEmail}</p>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#FAF9F5] border border-[#E6DFD8] text-[#141413]">
                            {tx.paymentMethod === 'card' ? (
                              <>
                                <CreditCard className="w-3 h-3 text-[#CC785C]" />
                                <span>{tx.cardBrand ? tx.cardBrand.toUpperCase() : 'Card'} {tx.cardLast4 ? `••${tx.cardLast4}` : ''}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-[#003087] font-bold">PP</span>
                                <span>PayPal Wallet</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-3 tabular-nums font-bold text-[#141413]">
                          <span className="text-[#003087]">${tx.amountUSD?.toFixed(2)} USD</span>
                          <span className="text-[10px] text-[#6C6A64] block">({tx.amountILS} ILS)</span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tx.platform === 'instagram' ? 'bg-[#CC785C]/10 text-[#CC785C]' : 'bg-[#1877F2]/10 text-[#1877F2]'
                          }`}>
                            +{tx.creditsAdded} {tx.platform}
                          </span>
                          <span className="text-[10px] text-[#6C6A64] block tabular-nums">
                            {isAr ? `الرصيد الجديد: ${tx.newBalance}` : `New bal: ${tx.newBalance}`}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#5DB8A6]/10 text-[#5DB8A6]">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{tx.status}</span>
                          </span>
                        </td>
                        <td className="py-3 text-[11px] text-[#6C6A64] tabular-nums whitespace-nowrap">
                          {new Date(tx.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Adjust Credits Modal with Mandatory Reason */}
      {adjustTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-5 text-[#141413]">
            <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-3">
              <h3 className="text-sm font-bold">
                {isAr ? `تعديل رصيد: ${adjustTargetUser.name}` : `Adjust Balance: ${adjustTargetUser.name}`}
              </h3>
              <button onClick={() => setAdjustTargetUser(null)} className="text-[#6C6A64] hover:text-[#141413]">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustCredits} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">Platform Wallet</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustPlatform('instagram')}
                    className={`py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                      adjustPlatform === 'instagram' ? 'bg-[#CC785C] text-white border-[#CC785C]' : 'bg-white text-[#141413] border-[#E6DFD8]'
                    }`}
                  >
                    Instagram
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustPlatform('facebook')}
                    className={`py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                      adjustPlatform === 'facebook' ? 'bg-[#1877F2] text-white border-[#1877F2]' : 'bg-white text-[#141413] border-[#E6DFD8]'
                    }`}
                  >
                    Facebook
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                  {isAr ? 'عدد المحاولات (+ أو -)' : 'Trials to add/deduct (+/-)'}
                </label>
                <input
                  type="number"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                  {t.admin.auditReasonRequired}
                </label>
                <textarea
                  rows={2}
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder={isAr ? 'مثال: تعويض فني عن انقطاع سابق أو شحن يدوي معتمد' : 'e.g. Compensation for upstream Meta disruption'}
                  className="w-full p-2.5 text-xs bg-white border border-[#E6DFD8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustTargetUser(null)}
                  className="px-4 py-2 text-xs font-medium text-[#6C6A64]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Prompt Template Modal */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl max-w-2xl w-full shadow-2xl p-6 sm:p-8 space-y-5 text-[#141413]">
            <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-3">
              <h3 className="text-base font-bold">Edit System Prompt: {editingPrompt.name}</h3>
              <button onClick={() => setEditingPrompt(null)} className="text-[#6C6A64] hover:text-[#141413]">
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePrompt} className="space-y-4">
              <textarea
                rows={12}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full p-4 text-xs font-mono bg-white border border-[#E6DFD8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPrompt(null)}
                  className="px-4 py-2 text-xs font-medium text-[#6C6A64]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer"
                >
                  Save Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
