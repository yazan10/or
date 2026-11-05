import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialPlatform, AnalysisReport, ContentPlan, ContentPlanItem } from '../../types';
import {
  LayoutDashboard,
  Share2,
  Sparkles,
  FileText,
  Calendar,
  Wallet,
  Receipt,
  User as UserIcon,
  Instagram,
  Facebook,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Trash2,
  Copy,
  Download,
  Send,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Sliders,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AnalyticsDesktopPrompt } from './AnalyticsDesktopPrompt';
import { YaAiChatView } from './YaAiChatView';
import { PayPalCheckoutModal } from '../payment/PayPalCheckoutModal';

export const UserDashboard: React.FC = () => {
  const {
    user,
    wallet,
    lang,
    t,
    dashboardTab,
    setDashboardTab,
    accounts,
    reports,
    activeReport,
    activePlan,
    loadReportDetails,
    openConnectModal,
    disconnectAccount,
    showToast,
    refreshBalances,
    setCurrentView,
    logout,
  } = useApp();

  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // New Analysis State
  const [analysisPlatform, setAnalysisPlatform] = useState<SocialPlatform>('instagram');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState(1);

  // Planner filters
  const [plannerFormatFilter, setPlannerFormatFilter] = useState<'all' | 'reel' | 'carousel' | 'post' | 'story'>('all');
  const [plannerViewMode, setPlannerViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDayItem, setSelectedDayItem] = useState<ContentPlanItem | null>(null);

  // Follow-up & Chat state
  const [followUpInput, setFollowUpInput] = useState('');
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: 'user' | 'assistant'; text: string; timestamp: string }[]>([]);
  const [totalChatChars, setTotalChatChars] = useState(0);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // PayPal Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlatform, setCheckoutPlatform] = useState<SocialPlatform>('instagram');

  // Ledger state
  const [ledgerItems, setLedgerItems] = useState<any[]>([]);

  // Profile fields
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileTz, setProfileTz] = useState(user?.timezone || 'Asia/Riyadh');

  // Filter accounts by platform
  const igAccounts = accounts.filter((a) => a.platform === 'instagram');
  const fbAccounts = accounts.filter((a) => a.platform === 'facebook');

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      const match = accounts.find((a) => a.platform === analysisPlatform) || accounts[0];
      setSelectedAccountId(match.id);
    }
  }, [accounts, analysisPlatform]);

  useEffect(() => {
    fetchLedger();
  }, [dashboardTab]);

  const fetchLedger = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/wallet/ledger?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setLedgerItems(data.ledger || []);
      }
    } catch (e) {
      console.warn('Error fetching ledger:', e);
    }
  };

  // Launch Analysis
  const handleStartAnalysis = async () => {
    if (!user) return;
    const isIg = analysisPlatform === 'instagram';
    const credits = isIg ? wallet.instagramCredits : wallet.facebookCredits;

    if (credits < 1) {
      showToast(t.analysisFlow.insufficientCredits, 'error');
      setCheckoutPlatform(analysisPlatform);
      handleInitiateCheckout(analysisPlatform);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisPhase(1);

    // Simulate realistic phases
    setTimeout(() => setAnalysisPhase(2), 1200);
    setTimeout(() => setAnalysisPhase(3), 2600);
    setTimeout(() => setAnalysisPhase(4), 4200);

    try {
      const res = await fetch('/api/analysis/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          accountId: selectedAccountId,
          platform: analysisPlatform,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      await refreshBalances();
      await loadReportDetails(data.report.id);
      setIsAnalyzing(false);
      showToast(t.analysisFlow.successTitle, 'success');
      setDashboardTab('report-details');
    } catch (err: any) {
      setIsAnalyzing(false);
      showToast(err.message || 'Analysis error', 'error');
    }
  };

  // Submit Follow-Up
  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim() || !activeReport) return;
    if (followUpInput.length > 500) {
      showToast(isAr ? 'تجاوزت الحد الأقصى (500 حرف)' : 'Exceeded 500 character limit', 'error');
      return;
    }

    setIsSubmittingFollowUp(true);
    try {
      const res = await fetch('/api/analysis/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: activeReport.id,
          question: followUpInput,
          lang,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFollowUpAnswer(data.answer);
      } else {
        showToast(data.error || 'Failed to submit question', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Network error', 'error');
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  // Submit Consultation Chat
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeReport) return;
    if (totalChatChars + chatInput.length > 3000) {
      showToast(isAr ? 'تجاوزت سقف الجلسة التراكمي (3000 حرف)' : 'Session limit of 3,000 characters reached', 'error');
      return;
    }

    setIsSendingChat(true);
    const msg = chatInput;
    setChatInput('');

    try {
      const res = await fetch('/api/analysis/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: activeReport.id,
          message: msg,
          lang,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setChatMessages(data.chatMessages || []);
        setTotalChatChars(data.totalChatCharsUsed || 0);
      } else {
        showToast(data.error || 'Error sending chat', 'error');
      }
    } catch (e: any) {
      showToast(e.message || 'Chat error', 'error');
    } finally {
      setIsSendingChat(false);
    }
  };

  // PayPal & Visa/Mastercard Checkout Modal
  const handleInitiateCheckout = (targetPlatform: SocialPlatform) => {
    setCheckoutPlatform(targetPlatform);
    setIsCheckoutOpen(true);
  };

  // CSV Export for 30-Day Plan
  const handleExportCsv = () => {
    if (!activePlan || activePlan.items.length === 0) return;
    const headers = ['Day', 'Date', 'Type', 'Marketing Goal', 'Hook', 'CTA', 'Caption', 'Rationale'];
    const rows = activePlan.items.map((i) => [
      i.day,
      i.dateStr,
      i.contentType,
      i.marketingGoal,
      `"${i.hook.replace(/"/g, '""')}"`,
      `"${i.callToAction.replace(/"/g, '""')}"`,
      `"${i.captionProposal.replace(/"/g, '""')}"`,
      `"${i.rationaleFromAudit.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ORVEX_AI_30_Day_Content_Plan_${activePlan.platform}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isAr ? 'تم تنزيل ملف CSV بنجاح!' : 'CSV file downloaded!', 'success');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(t.planner.copiedToast, 'success');
  };

  // Filtered Planner items
  const filteredPlanItems = (activePlan?.items || []).filter((item) => {
    if (plannerFormatFilter === 'all') return true;
    return item.contentType === plannerFormatFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Banner with Balances & Navigation Chips */}
      <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#141413]">
            {isAr ? `مرحباً، ${user?.name || 'صانع المحتوى'}` : `Welcome, ${user?.name || 'Creator'}`}
          </h1>
          <p className="text-xs text-[#6C6A64]">
            {isAr ? 'لوحة تحكم التحليلات والمحافظ وخطط المحتوى لـ Instagram و Facebook' : 'Social marketing audits, wallets, and 30-day editorial roadmaps'}
          </p>
        </div>

        {/* Dual Wallet Display & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Instagram Balance Chip */}
          <div className="px-3.5 py-2 rounded-xl bg-[#EFE9DE] border border-[#E6DFD8] flex items-center gap-2.5 text-xs">
            <Instagram className="w-4 h-4 text-[#CC785C]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6C6A64]">{t.dashboard.balanceIg}</span>
              <span className="font-bold text-[#141413] tabular-nums">
                {wallet.instagramCredits} {t.dashboard.trialsUnit}
              </span>
            </div>
            <button
              onClick={() => handleInitiateCheckout('instagram')}
              className="p-1 hover:bg-white rounded text-[#CC785C] transition-colors"
              title={isAr ? 'شحن رصيد Instagram' : 'Top up Instagram'}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Facebook Balance Chip */}
          <div className="px-3.5 py-2 rounded-xl bg-[#EFE9DE] border border-[#E6DFD8] flex items-center gap-2.5 text-xs">
            <Facebook className="w-4 h-4 text-[#1877F2]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#6C6A64]">{t.dashboard.balanceFb}</span>
              <span className="font-bold text-[#141413] tabular-nums">
                {wallet.facebookCredits} {t.dashboard.trialsUnit}
              </span>
            </div>
            <button
              onClick={() => handleInitiateCheckout('facebook')}
              className="p-1 hover:bg-white rounded text-[#1877F2] transition-colors"
              title={isAr ? 'شحن رصيد Facebook' : 'Top up Facebook'}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Launch Button */}
          <button
            onClick={() => setDashboardTab('new-analysis')}
            className="px-4 py-2.5 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.dashboard.quickActionAnalyze}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout with Sidebar Navigation Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Navigation Sidebar: Horizontal scroll on mobile/tablet, vertical sidebar on desktop */}
        <aside className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-2 sm:p-2.5 flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 lg:gap-1 shrink-0 w-full">
          <button
            onClick={() => setDashboardTab('overview')}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-left rtl:text-right whitespace-nowrap shrink-0 ${
              dashboardTab === 'overview' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#CC785C]" />
            <span>{t.dashboard.overview}</span>
          </button>

          <button
            onClick={() => setDashboardTab('accounts')}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-left rtl:text-right whitespace-nowrap shrink-0 ${
              dashboardTab === 'accounts' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <Share2 className="w-4 h-4 text-[#5DB8A6]" />
            <div className="flex items-center gap-1.5">
              <span>{t.dashboard.connectedAccounts}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFE9DE] text-[#141413]">
                {accounts.length}/10
              </span>
            </div>
          </button>

          <button
            onClick={() => setDashboardTab('new-analysis')}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-left rtl:text-right whitespace-nowrap shrink-0 ${
              dashboardTab === 'new-analysis' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E8A55A]" />
            <span>{t.dashboard.newAnalysis}</span>
          </button>

          <button
            onClick={() => setDashboardTab('report-details')}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-left rtl:text-right whitespace-nowrap shrink-0 ${
              dashboardTab === 'report-details' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#CC785C]" />
            <span>{t.dashboard.reports}</span>
          </button>

          <button
            onClick={() => setDashboardTab('calendar')}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-left rtl:text-right whitespace-nowrap shrink-0 ${
              dashboardTab === 'calendar' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#5DB8A6]" />
            <span>{t.dashboard.contentCalendar}</span>
          </button>

          {/* YA ai Strategic Chat Tab */}
          <button
            onClick={() => setDashboardTab('ya-ai')}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer text-left rtl:text-right whitespace-nowrap shrink-0 ${
              dashboardTab === 'ya-ai'
                ? 'bg-[#181715] text-white shadow-xs'
                : 'text-[#3D3D3A] hover:bg-[#EFE9DE] bg-[#FAF0EA]/60 border border-[#CC785C]/25'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#CC785C] animate-pulse" />
              <span>{isAr ? 'شات الذكاء الاصطناعي' : 'AI Strategic Chat'}</span>
            </div>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#CC785C] text-white">
              YA ai
            </span>
          </button>

          <button
            onClick={() => setDashboardTab('wallets')}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-left rtl:text-right whitespace-nowrap shrink-0 ${
              dashboardTab === 'wallets' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <Wallet className="w-4 h-4 text-[#1877F2]" />
            <span>{t.dashboard.wallets}</span>
          </button>

          <button
            onClick={() => setDashboardTab('profile')}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer text-left rtl:text-right whitespace-nowrap shrink-0 ${
              dashboardTab === 'profile' ? 'bg-[#181715] text-white shadow-xs' : 'text-[#3D3D3A] hover:bg-[#EFE9DE]'
            }`}
          >
            <UserIcon className="w-4 h-4 text-[#6C6A64]" />
            <span>{t.dashboard.profile}</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={dashboardTab}
              initial={{ opacity: 0, y: 12, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(2px)' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
          {/* TAB 1: OVERVIEW */}
          {dashboardTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] space-y-2">
                  <span className="text-xs text-[#6C6A64]">{t.dashboard.balanceIg}</span>
                  <p className="text-2xl font-black text-[#141413] tabular-nums">
                    {wallet.instagramCredits} <span className="text-xs font-normal text-[#6C6A64]">{t.dashboard.trialsUnit}</span>
                  </p>
                  <p className="text-[11px] text-[#5DB8A6]">{t.hero.badgeCreditsNeverExpire}</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] space-y-2">
                  <span className="text-xs text-[#6C6A64]">{t.dashboard.balanceFb}</span>
                  <p className="text-2xl font-black text-[#141413] tabular-nums">
                    {wallet.facebookCredits} <span className="text-xs font-normal text-[#6C6A64]">{t.dashboard.trialsUnit}</span>
                  </p>
                  <p className="text-[11px] text-[#5DB8A6]">{t.hero.badgeCreditsNeverExpire}</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-[#E6DFD8] space-y-2">
                  <span className="text-xs text-[#6C6A64]">{t.dashboard.connectedCount}</span>
                  <p className="text-2xl font-black text-[#141413] tabular-nums">
                    {accounts.length} <span className="text-xs font-normal text-[#6C6A64]">/ 10</span>
                  </p>
                  <p className="text-[11px] text-[#6C6A64]">{t.dashboard.maxAccountsNote}</p>
                </div>
              </div>

              {/* Recent Reports List */}
              <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#141413]">{t.dashboard.recentAnalyses}</h3>
                  <button
                    onClick={() => setDashboardTab('new-analysis')}
                    className="text-xs font-semibold text-[#CC785C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.dashboard.quickActionAnalyze}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>

                {reports.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#6C6A64] border border-dashed border-[#E6DFD8] rounded-xl">
                    {t.dashboard.noReportsYet}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((rep) => (
                      <div
                        key={rep.id}
                        onClick={() => {
                          loadReportDetails(rep.id);
                          setDashboardTab('report-details');
                        }}
                        className="p-4 rounded-xl bg-white border border-[#E6DFD8] hover:border-[#CC785C] transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white ${
                            rep.platform === 'instagram' ? 'bg-[#E1306C]' : 'bg-[#1877F2]'
                          }`}>
                            {rep.platform === 'instagram' ? <Instagram className="w-4 h-4" /> : <Facebook className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#141413] group-hover:text-[#CC785C] transition-colors">
                              {rep.accountName}
                            </p>
                            <p className="text-[11px] text-[#6C6A64]">
                              {new Date(rep.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right rtl:text-left">
                            <span className="text-xs font-bold text-[#5DB8A6] tabular-nums">
                              {rep.performanceScore} / 100
                            </span>
                            <p className="text-[10px] text-[#6C6A64]">{isAr ? 'كفاءة الأداء' : 'Score'}</p>
                          </div>
                          <ArrowIcon className="w-4 h-4 text-[#6C6A64] group-hover:text-[#CC785C] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONNECTED ACCOUNTS (UP TO 5 IG & 5 FB) */}
          {dashboardTab === 'accounts' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#141413]">{t.dashboard.connectedAccounts}</h2>
                  <p className="text-xs text-[#6C6A64]">{t.dashboard.maxAccountsNote}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openConnectModal('instagram')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAF9F5] border border-[#E6DFD8] text-[#141413] hover:bg-[#EFE9DE] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Instagram className="w-3.5 h-3.5 text-[#E1306C]" />
                    <span>+ Instagram</span>
                  </button>
                  <button
                    onClick={() => openConnectModal('facebook')}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#FAF9F5] border border-[#E6DFD8] text-[#141413] hover:bg-[#EFE9DE] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Facebook className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>+ Facebook</span>
                  </button>
                </div>
              </div>

              {/* Instagram Accounts Section */}
              <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-3">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-[#CC785C]" />
                    <h3 className="text-sm font-bold text-[#141413]">Instagram Accounts ({igAccounts.length}/5)</h3>
                  </div>
                </div>

                {igAccounts.length === 0 ? (
                  <p className="text-xs text-[#6C6A64] py-3">{isAr ? 'لا توجد حسابات إنستغرام مرتبطة.' : 'No Instagram accounts connected yet.'}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {igAccounts.map((acc) => (
                      <div key={acc.id} className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img src={acc.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-[#E6DFD8]" />
                            <div>
                              <p className="text-xs font-bold text-[#141413]">{acc.accountName}</p>
                              <p className="text-[11px] text-[#6C6A64]">@{acc.username}</p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#5DB8A6]/10 text-[#5DB8A6] font-semibold">
                            {t.dashboard.statusConnected}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6C6A64] border-t border-[#E6DFD8] pt-2">
                          <div>
                            <span>{isAr ? 'المتابعون:' : 'Followers:'} </span>
                            <strong className="text-[#141413] tabular-nums">{acc.followersCount.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span>{isAr ? 'معدل التفاعل:' : 'Avg ER:'} </span>
                            <strong className="text-[#5DB8A6] tabular-nums">{acc.recentMetrics?.avgEngagementRate}%</strong>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => showToast(isAr ? 'تمت مزامنة المؤشرات بنجاح!' : 'Metrics synced successfully!', 'info')}
                            className="text-[11px] font-medium text-[#6C6A64] hover:text-[#141413] flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{t.dashboard.syncNow}</span>
                          </button>
                          <button
                            onClick={() => disconnectAccount(acc.id)}
                            className="text-[11px] font-medium text-[#C64545] hover:underline cursor-pointer"
                          >
                            {t.dashboard.disconnect}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Facebook Pages Section */}
              <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-3">
                  <div className="flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                    <h3 className="text-sm font-bold text-[#141413]">Facebook Pages ({fbAccounts.length}/5)</h3>
                  </div>
                </div>

                {fbAccounts.length === 0 ? (
                  <p className="text-xs text-[#6C6A64] py-3">{isAr ? 'لا توجد صفحات فيسبوك مرتبطة.' : 'No Facebook pages connected yet.'}</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fbAccounts.map((acc) => (
                      <div key={acc.id} className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img src={acc.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-[#E6DFD8]" />
                            <div>
                              <p className="text-xs font-bold text-[#141413]">{acc.accountName}</p>
                              <p className="text-[11px] text-[#6C6A64]">@{acc.username}</p>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#5DB8A6]/10 text-[#5DB8A6] font-semibold">
                            {t.dashboard.statusConnected}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6C6A64] border-t border-[#E6DFD8] pt-2">
                          <div>
                            <span>{isAr ? 'المعجبون:' : 'Followers:'} </span>
                            <strong className="text-[#141413] tabular-nums">{acc.followersCount.toLocaleString()}</strong>
                          </div>
                          <div>
                            <span>{isAr ? 'متوسط الوصول:' : 'Avg Reach:'} </span>
                            <strong className="text-[#141413] tabular-nums">{acc.recentMetrics?.avgReach.toLocaleString()}</strong>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => showToast(isAr ? 'تمت مزامنة مؤشرات الصفحة بنجاح!' : 'Page metrics synced successfully!', 'info')}
                            className="text-[11px] font-medium text-[#6C6A64] hover:text-[#141413] flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{t.dashboard.syncNow}</span>
                          </button>
                          <button
                            onClick={() => disconnectAccount(acc.id)}
                            className="text-[11px] font-medium text-[#C64545] hover:underline cursor-pointer"
                          >
                            {t.dashboard.disconnect}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: START NEW ANALYSIS */}
          {dashboardTab === 'new-analysis' && (
            <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 sm:p-8 space-y-6">
              <AnalyticsDesktopPrompt currentTabName="new-analysis" />
              <div>
                <h2 className="text-lg font-bold text-[#141413]">{t.dashboard.newAnalysis}</h2>
                <p className="text-xs text-[#6C6A64]">{t.analysisFlow.costNotice}</p>
              </div>

              {!isAnalyzing ? (
                <div className="space-y-6 max-w-xl">
                  {/* Select Platform */}
                  <div>
                    <label className="block text-xs font-semibold text-[#3D3D3A] mb-2">
                      {t.analysisFlow.selectPlatform}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setAnalysisPlatform('instagram')}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                          analysisPlatform === 'instagram'
                            ? 'bg-gradient-to-r from-[#FAF0EA] to-[#F5F0E8] border-[#CC785C] shadow-sm'
                            : 'bg-white border-[#E6DFD8] hover:bg-[#EFE9DE]'
                        }`}
                      >
                        <Instagram className="w-5 h-5 text-[#CC785C]" />
                        <div className="text-left rtl:text-right">
                          <p className="text-xs font-bold text-[#141413]">Instagram</p>
                          <p className="text-[11px] text-[#6C6A64] tabular-nums">
                            {wallet.instagramCredits} {t.dashboard.trialsUnit}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setAnalysisPlatform('facebook')}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                          analysisPlatform === 'facebook'
                            ? 'bg-gradient-to-r from-[#FAF0EA] to-[#F5F0E8] border-[#CC785C] shadow-sm'
                            : 'bg-white border-[#E6DFD8] hover:bg-[#EFE9DE]'
                        }`}
                      >
                        <Facebook className="w-5 h-5 text-[#1877F2]" />
                        <div className="text-left rtl:text-right">
                          <p className="text-xs font-bold text-[#141413]">Facebook</p>
                          <p className="text-[11px] text-[#6C6A64] tabular-nums">
                            {wallet.facebookCredits} {t.dashboard.trialsUnit}
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Select Account */}
                  <div>
                    <label className="block text-xs font-semibold text-[#3D3D3A] mb-2">
                      {t.analysisFlow.selectAccount}
                    </label>
                    <select
                      value={selectedAccountId}
                      onChange={(e) => setSelectedAccountId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E6DFD8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                    >
                      {accounts
                        .filter((a) => a.platform === analysisPlatform)
                        .map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.accountName} (@{acc.username})
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Balance Verification */}
                  <div className="p-4 rounded-xl bg-[#EFE9DE] border border-[#E6DFD8] flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#6C6A64]">{t.analysisFlow.balanceAvailable} </span>
                      <strong className="text-[#141413] tabular-nums">
                        {analysisPlatform === 'instagram' ? wallet.instagramCredits : wallet.facebookCredits} {t.dashboard.trialsUnit}
                      </strong>
                    </div>
                    {(analysisPlatform === 'instagram' ? wallet.instagramCredits : wallet.facebookCredits) < 1 && (
                      <button
                        onClick={() => handleInitiateCheckout(analysisPlatform)}
                        className="px-3 py-1 text-xs font-bold rounded-lg bg-[#CC785C] text-white hover:bg-[#A9583E]"
                      >
                        {isAr ? 'شحن الرصيد الآن' : 'Top up Now'}
                      </button>
                    )}
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={handleStartAnalysis}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t.analysisFlow.startBtn}</span>
                  </button>
                </div>
              ) : (
                /* Live Stepped Execution Progress */
                <div className="p-8 rounded-2xl bg-[#181715] text-[#FAF9F5] space-y-6 max-w-xl mx-auto shadow-xl">
                  <div className="text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#CC785C]/20 text-[#CC785C] flex items-center justify-center mx-auto animate-spin">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold">
                      {isAr ? 'جاري فحص الحساب بالذكاء الاصطناعي...' : 'Conducting AI Marketing Diagnosis...'}
                    </h3>
                  </div>

                  {/* Stepped Phases */}
                  <div className="space-y-3 text-xs">
                    <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      analysisPhase >= 1 ? 'border-[#5DB8A6] bg-[#5DB8A6]/10 text-[#5DB8A6]' : 'border-[#35322D] text-[#A09C94]'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t.analysisFlow.phase1}</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      analysisPhase >= 2 ? 'border-[#5DB8A6] bg-[#5DB8A6]/10 text-[#5DB8A6]' : 'border-[#35322D] text-[#A09C94]'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t.analysisFlow.phase2}</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      analysisPhase >= 3 ? 'border-[#5DB8A6] bg-[#5DB8A6]/10 text-[#5DB8A6]' : 'border-[#35322D] text-[#A09C94]'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t.analysisFlow.phase3}</span>
                    </div>

                    <div className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                      analysisPhase >= 4 ? 'border-[#5DB8A6] bg-[#5DB8A6]/10 text-[#5DB8A6]' : 'border-[#35322D] text-[#A09C94]'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{t.analysisFlow.phase4}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REPORT DETAILS & DIAGNOSTICS */}
          {dashboardTab === 'report-details' && (
            <div className="space-y-6">
              <AnalyticsDesktopPrompt currentTabName="report-details" />
              {activeReport ? (
                <div className="space-y-6">
                  {/* Top Bar of Report */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FAF9F5] border border-[#E6DFD8] p-5 rounded-2xl">
                    <div>
                      <div className="flex items-center gap-2">
                        {activeReport.platform === 'instagram' ? (
                          <Instagram className="w-4 h-4 text-[#CC785C]" />
                        ) : (
                          <Facebook className="w-4 h-4 text-[#1877F2]" />
                        )}
                        <h2 className="text-base font-bold text-[#141413]">{activeReport.accountName}</h2>
                      </div>
                      <p className="text-[11px] text-[#6C6A64] mt-0.5">
                        {new Date(activeReport.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDashboardTab('calendar')}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{t.reportView.viewPlanner}</span>
                      </button>
                    </div>
                  </div>

                  {/* Score & Executive Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-[#181715] text-[#FAF9F5] p-6 rounded-2xl border border-[#35322D] flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-xs font-semibold text-[#A09C94] uppercase tracking-wider">
                          {t.reportView.scoreHeader}
                        </span>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-5xl font-black text-[#5DB8A6] tabular-nums">
                            {activeReport.performanceScore}
                          </span>
                          <span className="text-sm text-[#A09C94]">{t.reportView.outOf100}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#A09C94] leading-relaxed border-t border-[#35322D] pt-3">
                        {activeReport.scoreBreakdown?.explanation}
                      </p>
                    </div>

                    <div className="lg:col-span-2 bg-[#FAF9F5] border border-[#E6DFD8] p-6 rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-xs font-bold text-[#CC785C] uppercase tracking-wider">
                          {isAr ? 'الملخص التنفيذي' : 'Executive Summary'}
                        </span>
                        <p className="text-sm text-[#3D3D3A] leading-relaxed mt-2">
                          {activeReport.executiveSummary}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#6C6A64] border-t border-[#E6DFD8] pt-3">
                        <span className="font-semibold text-[#141413]">{t.reportView.confidenceBadge}</span>
                        <span className="text-[#5DB8A6] font-bold">
                          {activeReport.confidenceLevel === 'high' ? t.reportView.highConfidence : t.reportView.mediumConfidence}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* SWOT Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-2">
                      <h4 className="text-xs font-bold text-[#5DB8A6]">{t.reportView.strengths}</h4>
                      <ul className="text-xs text-[#3D3D3A] space-y-1.5">
                        {activeReport.swot?.strengths.map((s, i) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-2">
                      <h4 className="text-xs font-bold text-[#E8A55A]">{t.reportView.weaknesses}</h4>
                      <ul className="text-xs text-[#3D3D3A] space-y-1.5">
                        {activeReport.swot?.weaknesses.map((w, i) => (
                          <li key={i}>• {w}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-2">
                      <h4 className="text-xs font-bold text-[#5DB8A6]">{t.reportView.opportunities}</h4>
                      <ul className="text-xs text-[#3D3D3A] space-y-1.5">
                        {activeReport.swot?.opportunities.map((o, i) => (
                          <li key={i}>• {o}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-[#E6DFD8] space-y-2">
                      <h4 className="text-xs font-bold text-[#C64545]">{t.reportView.risks}</h4>
                      <ul className="text-xs text-[#3D3D3A] space-y-1.5">
                        {activeReport.swot?.risks.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Top & Bottom Content Diagnosis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Content */}
                    <div className="bg-[#FAF9F5] border border-[#E6DFD8] p-5 rounded-2xl space-y-3">
                      <h3 className="text-xs font-bold text-[#141413] flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-[#5DB8A6]" />
                        <span>{t.reportView.topPostsTitle}</span>
                      </h3>
                      {activeReport.topPosts?.map((post) => (
                        <div key={post.id} className="p-3.5 bg-white border border-[#E6DFD8] rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#141413]">{post.title}</span>
                            <span className="text-[#5DB8A6] font-bold tabular-nums">{post.engagementRate}% ER</span>
                          </div>
                          <p className="text-xs text-[#6C6A64]">{post.whyItWorked}</p>
                          <p className="text-[11px] text-[#A09C94]">{post.retentionNote}</p>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Content */}
                    <div className="bg-[#FAF9F5] border border-[#E6DFD8] p-5 rounded-2xl space-y-3">
                      <h3 className="text-xs font-bold text-[#141413] flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-[#E8A55A]" />
                        <span>{t.reportView.bottomPostsTitle}</span>
                      </h3>
                      {activeReport.bottomPosts?.map((post) => (
                        <div key={post.id} className="p-3.5 bg-white border border-[#E6DFD8] rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#141413]">{post.title}</span>
                            <span className="text-[#C64545] font-bold tabular-nums">{post.engagementRate}% ER</span>
                          </div>
                          <p className="text-xs text-[#6C6A64]">{post.whyItWorked}</p>
                          <p className="text-[11px] text-[#A09C94]">{post.retentionNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prioritized Recommendations */}
                  <div className="bg-[#FAF9F5] border border-[#E6DFD8] p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold text-[#141413]">{t.reportView.recommendationsTitle}</h3>
                    <div className="space-y-3">
                      {activeReport.actionableRecommendations?.map((rec, i) => (
                        <div key={i} className="p-4 bg-white border border-[#E6DFD8] rounded-xl flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-[#141413]">{rec.recommendation}</p>
                            <p className="text-[11px] text-[#5DB8A6]">{rec.expectedImpact}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                            rec.priority === 'high' ? 'bg-[#CC785C]/10 text-[#CC785C]' : 'bg-[#EFE9DE] text-[#6C6A64]'
                          }`}>
                            {rec.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Realistic Growth Scenarios */}
                  <div className="bg-[#FAF9F5] border border-[#E6DFD8] p-6 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#141413]">{t.reportView.scenariosTitle}</h3>
                      <span className="text-[11px] text-[#6C6A64]">{isAr ? 'بدون وعود وهمية' : 'Algorithmic-Agnostic'}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {activeReport.growthScenarios?.map((sc, i) => (
                        <div key={i} className="p-4 bg-white border border-[#E6DFD8] rounded-xl space-y-2">
                          <span className="text-xs font-bold uppercase text-[#CC785C]">{sc.scenario}</span>
                          <p className="text-sm font-black text-[#141413] tabular-nums">{sc.estimatedReachRange}</p>
                          <p className="text-xs text-[#5DB8A6] font-semibold tabular-nums">{sc.estimatedFollowerGrowthRange}</p>
                          <p className="text-[11px] text-[#6C6A64] pt-1">{sc.uncertaintyNotes}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Follow-up Question & Consultation Chat Panel */}
                  <div className="bg-[#FAF9F5] border border-[#CC785C]/30 rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-3">
                      <div>
                        <h3 className="text-base font-bold text-[#141413]">{t.followUpChat.followUpTitle}</h3>
                        <p className="text-xs text-[#5DB8A6] font-semibold">{t.followUpChat.includedFree}</p>
                      </div>
                    </div>

                    {/* Follow-up question form */}
                    <form onSubmit={handleFollowUpSubmit} className="space-y-3">
                      <div className="relative">
                        <textarea
                          rows={2}
                          maxLength={500}
                          value={followUpInput}
                          onChange={(e) => setFollowUpInput(e.target.value)}
                          placeholder={t.followUpChat.followUpPlaceholder}
                          className="w-full p-3 text-xs bg-white border border-[#E6DFD8] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                        />
                        <span className="absolute bottom-2 left-3 rtl:left-auto rtl:right-3 text-[10px] text-[#6C6A64] tabular-nums">
                          {followUpInput.length} / 500
                        </span>
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmittingFollowUp || !followUpInput.trim()}
                        className="px-4 py-2 text-xs font-bold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingFollowUp ? (isAr ? 'جاري التحليل...' : 'Generating...') : t.followUpChat.sendQuestion}
                      </button>
                    </form>

                    {followUpAnswer && (
                      <div className="p-4 bg-white rounded-xl border border-[#5DB8A6]/40 space-y-1">
                        <p className="text-xs font-bold text-[#5DB8A6]">{isAr ? 'إجابة المستشار الذكي:' : 'Advisor Response:'}</p>
                        <p className="text-xs text-[#3D3D3A] leading-relaxed">{followUpAnswer}</p>
                      </div>
                    )}

                    {/* Extended Consultation Chat */}
                    <div className="border-t border-[#E6DFD8] pt-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-[#141413]">{t.followUpChat.chatTitle}</h4>
                          <p className="text-[11px] text-[#6C6A64]">{t.followUpChat.chatDesc}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#CC785C] tabular-nums">
                          {totalChatChars} / 3000
                        </span>
                      </div>

                      {/* Chat messages list */}
                      <div className="max-h-60 overflow-y-auto space-y-2.5 p-3 bg-white border border-[#E6DFD8] rounded-xl">
                        {chatMessages.length === 0 ? (
                          <p className="text-center text-xs text-[#6C6A64] py-4">
                            {isAr ? 'ابدأ حوارك الاستشاري هنا حول خطة المحتوى.' : 'Start your consultation dialogue regarding this content strategy.'}
                          </p>
                        ) : (
                          chatMessages.map((m) => (
                            <div
                              key={m.id}
                              className={`p-2.5 rounded-lg text-xs max-w-[85%] leading-relaxed ${
                                m.sender === 'user'
                                  ? 'ml-auto rtl:ml-0 rtl:mr-auto bg-[#EFE9DE] text-[#141413]'
                                  : 'mr-auto rtl:mr-0 rtl:ml-auto bg-[#FAF0EA] border border-[#CC785C]/20 text-[#141413]'
                              }`}
                            >
                              {m.text}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Chat input */}
                      <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder={t.followUpChat.chatPlaceholder}
                          className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CC785C]"
                        />
                        <button
                          type="submit"
                          disabled={isSendingChat || !chatInput.trim()}
                          className="px-4 py-2 text-xs font-bold rounded-lg bg-[#181715] hover:bg-[#252320] text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSendingChat ? '...' : (isAr ? 'إرسال' : 'Send')}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#6C6A64]">
                  {isAr ? 'اختر تقريراً من القائمة أو أطلق تحليلاً جديداً.' : 'Select a report or launch a new audit.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: 30-DAY CONTENT PLANNER */}
          {dashboardTab === 'calendar' && (
            <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 sm:p-8 space-y-6">
              <AnalyticsDesktopPrompt currentTabName="calendar" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E6DFD8] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#141413]">{t.planner.title}</h2>
                  <p className="text-xs text-[#6C6A64]">{t.planner.subtitle}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#E6DFD8] text-[#141413] hover:bg-[#EFE9DE] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#5DB8A6]" />
                    <span>{t.planner.downloadCsv}</span>
                  </button>
                </div>
              </div>

              {/* Format Filter Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setPlannerFormatFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    plannerFormatFilter === 'all'
                      ? 'bg-[#181715] text-white shadow-sm'
                      : 'bg-white border border-[#E6DFD8] text-[#3D3D3A] hover:bg-[#EFE9DE]'
                  }`}
                >
                  {t.planner.filterAll}
                </button>
                <button
                  onClick={() => setPlannerFormatFilter('reel')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    plannerFormatFilter === 'reel'
                      ? 'bg-[#CC785C] text-white shadow-sm'
                      : 'bg-white border border-[#E6DFD8] text-[#3D3D3A] hover:bg-[#EFE9DE]'
                  }`}
                >
                  {t.planner.filterReels}
                </button>
                <button
                  onClick={() => setPlannerFormatFilter('carousel')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    plannerFormatFilter === 'carousel'
                      ? 'bg-[#5DB8A6] text-white shadow-sm'
                      : 'bg-white border border-[#E6DFD8] text-[#3D3D3A] hover:bg-[#EFE9DE]'
                  }`}
                >
                  {t.planner.filterCarousels}
                </button>
                <button
                  onClick={() => setPlannerFormatFilter('post')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    plannerFormatFilter === 'post'
                      ? 'bg-[#1877F2] text-white shadow-sm'
                      : 'bg-white border border-[#E6DFD8] text-[#3D3D3A] hover:bg-[#EFE9DE]'
                  }`}
                >
                  {t.planner.filterPosts}
                </button>
                <button
                  onClick={() => setPlannerFormatFilter('story')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    plannerFormatFilter === 'story'
                      ? 'bg-[#E8A55A] text-white shadow-sm'
                      : 'bg-white border border-[#E6DFD8] text-[#3D3D3A] hover:bg-[#EFE9DE]'
                  }`}
                >
                  {t.planner.filterStories}
                </button>
              </div>

              {/* 30-Day Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlanItems.map((item) => (
                  <div
                    key={item.day}
                    onClick={() => setSelectedDayItem(item)}
                    className="p-4 rounded-xl bg-white border border-[#E6DFD8] hover:border-[#CC785C] transition-all space-y-3 cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#141413]">
                          {t.planner.dayLabel} {item.day} · {item.dateStr}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                          item.contentType === 'reel' ? 'bg-[#CC785C]/10 text-[#CC785C]' :
                          item.contentType === 'carousel' ? 'bg-[#5DB8A6]/10 text-[#5DB8A6]' :
                          'bg-[#EFE9DE] text-[#6C6A64]'
                        }`}>
                          {item.contentType}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#141413] group-hover:text-[#CC785C] transition-colors">
                        {item.hook}
                      </p>
                      <p className="text-[11px] text-[#6C6A64] line-clamp-2">
                        {item.captionProposal}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#E6DFD8] flex items-center justify-between text-[11px] text-[#6C6A64]">
                      <span>{item.suggestedTime}</span>
                      <span className="text-[#CC785C] font-semibold">{isAr ? 'عرض التفاصيل' : 'Details'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Day Item Inspection Modal */}
              {selectedDayItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                  <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-3">
                      <div>
                        <span className="text-xs font-bold text-[#CC785C] uppercase">
                          {selectedDayItem.contentType} · {selectedDayItem.dateStr}
                        </span>
                        <h3 className="text-base font-bold text-[#141413]">
                          {t.planner.dayLabel} {selectedDayItem.day}: {selectedDayItem.topic}
                        </h3>
                      </div>
                      <button onClick={() => setSelectedDayItem(null)} className="text-[#6C6A64] hover:text-[#141413]">
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4 text-xs text-[#3D3D3A]">
                      {/* Hook */}
                      <div className="p-3 bg-[#EFE9DE] rounded-xl border border-[#E6DFD8] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#141413]">{t.planner.hookLabel}</span>
                          <button
                            onClick={() => copyToClipboard(selectedDayItem.hook)}
                            className="text-[#CC785C] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{t.planner.copyHook}</span>
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#141413]">{selectedDayItem.hook}</p>
                      </div>

                      {/* Script Outline */}
                      <div className="space-y-1">
                        <span className="font-bold text-[#141413]">{t.planner.outlineLabel}</span>
                        <ul className="list-disc list-inside space-y-1 text-[#6C6A64]">
                          {selectedDayItem.scriptOrSlideOutline.map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Caption */}
                      <div className="p-3 bg-white rounded-xl border border-[#E6DFD8] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#141413]">{t.planner.captionLabel}</span>
                          <button
                            onClick={() => copyToClipboard(selectedDayItem.captionProposal)}
                            className="text-[#CC785C] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{t.planner.copyCaption}</span>
                          </button>
                        </div>
                        <p className="whitespace-pre-line text-[#3D3D3A] leading-relaxed">
                          {selectedDayItem.captionProposal}
                        </p>
                      </div>

                      {/* Production Notes & Rationale */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        <div className="p-2.5 bg-[#FAF0EA] rounded-lg border border-[#CC785C]/20">
                          <span className="font-bold text-[#CC785C] block mb-1">{t.planner.rationaleLabel}</span>
                          <p>{selectedDayItem.rationaleFromAudit}</p>
                        </div>
                        <div className="p-2.5 bg-[#FAF0EA] rounded-lg border border-[#CC785C]/20">
                          <span className="font-bold text-[#CC785C] block mb-1">{t.planner.productionNotesLabel}</span>
                          <p>{selectedDayItem.productionNotes}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: WALLETS & PAYPAL PURCHASES */}
          {dashboardTab === 'wallets' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#141413]">{t.walletPage.title}</h2>
                  <p className="text-xs text-[#6C6A64]">{t.walletPage.subtitle}</p>
                </div>
              </div>

              {/* Dual Wallets Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Instagram Wallet */}
                <div className="bg-[#FAF9F5] border-2 border-[#CC785C]/30 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-[#CC785C]" />
                      <h3 className="text-base font-bold text-[#141413]">{t.walletPage.igWalletName}</h3>
                    </div>
                    <span className="text-xs font-extrabold text-[#5DB8A6] bg-[#5DB8A6]/10 px-2.5 py-1 rounded-md">
                      {t.hero.badgeCreditsNeverExpire}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#6C6A64]">{t.walletPage.currentBalance}</span>
                    <p className="text-3xl font-black text-[#141413] tabular-nums">
                      {wallet.instagramCredits} <span className="text-sm font-normal text-[#6C6A64]">{t.dashboard.trialsUnit}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-[#EFE9DE] rounded-xl text-xs space-y-1">
                    <p className="font-semibold text-[#141413]">
                      {wallet.instagramPurchasesCount === 0 ? t.pricing.firstPurchaseBadge : t.pricing.recurringPurchaseBadge}
                    </p>
                    <p className="text-[#6C6A64]">
                      {wallet.instagramPurchasesCount === 0
                        ? `${t.pricing.igFirstTrials} مقابل ${t.pricing.igFirstPrice}`
                        : `${t.pricing.igSubsequentTrials} مقابل ${t.pricing.igSubsequentPrice}`}
                    </p>
                  </div>

                  <button
                    onClick={() => handleInitiateCheckout('instagram')}
                    className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer"
                  >
                    {t.pricing.buyNow}
                  </button>
                </div>

                {/* Facebook Wallet */}
                <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-[#1877F2]" />
                      <h3 className="text-base font-bold text-[#141413]">{t.walletPage.fbWalletName}</h3>
                    </div>
                    <span className="text-xs font-extrabold text-[#5DB8A6] bg-[#5DB8A6]/10 px-2.5 py-1 rounded-md">
                      {t.hero.badgeCreditsNeverExpire}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-[#6C6A64]">{t.walletPage.currentBalance}</span>
                    <p className="text-3xl font-black text-[#141413] tabular-nums">
                      {wallet.facebookCredits} <span className="text-sm font-normal text-[#6C6A64]">{t.dashboard.trialsUnit}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-[#EFE9DE] rounded-xl text-xs space-y-1">
                    <p className="font-semibold text-[#141413]">
                      {wallet.facebookPurchasesCount === 0 ? t.pricing.firstPurchaseBadge : t.pricing.recurringPurchaseBadge}
                    </p>
                    <p className="text-[#6C6A64]">
                      {wallet.facebookPurchasesCount === 0
                        ? `${t.pricing.fbFirstTrials} مقابل ${t.pricing.fbFirstPrice}`
                        : `${t.pricing.fbSubsequentTrials} مقابل ${t.pricing.fbSubsequentPrice}`}
                    </p>
                  </div>

                  <button
                    onClick={() => handleInitiateCheckout('facebook')}
                    className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-[#181715] hover:bg-[#252320] text-white shadow-sm transition-colors cursor-pointer"
                  >
                    {t.pricing.buyNow}
                  </button>
                </div>
              </div>

              {/* Immutable Ledger Table */}
              <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-[#141413]">{t.walletPage.purchaseHistory}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left rtl:text-right border-collapse">
                    <thead>
                      <tr className="border-b border-[#E6DFD8] text-[#6C6A64]">
                        <th className="py-2.5 font-semibold">{t.walletPage.colDate}</th>
                        <th className="py-2.5 font-semibold">{t.walletPage.colPlatform}</th>
                        <th className="py-2.5 font-semibold">{t.walletPage.colType}</th>
                        <th className="py-2.5 font-semibold">{t.walletPage.colAmount}</th>
                        <th className="py-2.5 font-semibold">{t.walletPage.colReason}</th>
                        <th className="py-2.5 font-semibold">{t.walletPage.colBalanceAfter}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DFD8]">
                      {ledgerItems.map((item) => (
                        <tr key={item.id} className="hover:bg-white/60 transition-colors">
                          <td className="py-3 text-[#6C6A64]">
                            {new Date(item.timestamp).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                          </td>
                          <td className="py-3 font-semibold uppercase">{item.platform}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.type === 'purchase' ? 'bg-[#5DB8A6]/10 text-[#5DB8A6]' :
                              item.type === 'analysis_consumption' ? 'bg-[#CC785C]/10 text-[#CC785C]' :
                              'bg-[#EFE9DE] text-[#6C6A64]'
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className={`py-3 font-bold tabular-nums ${item.amount > 0 ? 'text-[#5DB8A6]' : 'text-[#CC785C]'}`}>
                            {item.amount > 0 ? `+${item.amount}` : item.amount}
                          </td>
                          <td className="py-3 text-[#3D3D3A]">{item.reason}</td>
                          <td className="py-3 font-bold text-[#141413] tabular-nums">{item.balanceAfter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE & PRIVACY */}
          {dashboardTab === 'profile' && (
            <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#141413]">{t.dashboard.profile}</h2>
                <p className="text-xs text-[#6C6A64]">{isAr ? 'إدارة بيانات حسابك وتفضيلات اللغة والمنطقة الزمنية' : 'Manage account identity, timezone, and data rights'}</p>
              </div>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                    {isAr ? 'الاسم أو اسم المؤسسة' : 'Display Name'}
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2 text-xs bg-[#EFE9DE] border border-[#E6DFD8] rounded-lg text-[#6C6A64]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D3D3A] mb-1">
                    {isAr ? 'المنطقة الزمنية' : 'Timezone'}
                  </label>
                  <input
                    type="text"
                    value={profileTz}
                    onChange={(e) => setProfileTz(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#E6DFD8] rounded-lg"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={() => showToast(isAr ? 'تم حفظ التعديلات بنجاح!' : 'Profile saved successfully!', 'success')}
                    className="px-5 py-2 text-xs font-bold rounded-lg bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-sm transition-colors cursor-pointer"
                  >
                    {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                  </button>

                  <button
                    onClick={logout}
                    className="px-4 py-2 text-xs font-bold rounded-lg text-[#C64545] hover:bg-[#C64545]/10 border border-[#C64545]/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              </div>

              {/* Data Rights & Meta Deletion Callout */}
              <div className="border-t border-[#E6DFD8] pt-6 space-y-3">
                <h3 className="text-sm font-bold text-[#141413]">{isAr ? 'حقوق حذف البيانات والخصوصية' : 'Data Privacy & Deletion'}</h3>
                <p className="text-xs text-[#6C6A64] leading-relaxed">
                  {isAr
                    ? 'يمكنك طلب حذف كامل سجلاتك وحساباتك الاجتماعية في أي وقت التزاماً ببروتوكول Meta Data Deletion Callback.'
                    : 'Request deletion of all historical records and tokens per Meta Data Deletion policies.'}
                </p>
                <button
                  onClick={() => setCurrentView('data-deletion')}
                  className="text-xs font-semibold text-[#CC785C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{t.footer.dataDeletion}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: YA AI STRATEGIC CHAT */}
          {dashboardTab === 'ya-ai' && <YaAiChatView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Interactive PayPal & Visa / MasterCard Checkout Modal */}
      <PayPalCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        platform={checkoutPlatform}
        onSuccess={() => fetchLedger()}
      />
    </div>
  );
};
