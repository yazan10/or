import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, WalletBalances, Language, SocialPlatform, SocialAccount, AnalysisReport, ContentPlan } from '../types';
import { translations } from '../i18n/translations';
import { safeFetchJson } from '../utils/safeFetch';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  user: User | null;
  wallet: WalletBalances;
  lang: Language;
  t: typeof translations.ar;
  currentView: string;
  dashboardTab: string;
  selectedReportId: string | null;
  accounts: SocialAccount[];
  reports: AnalysisReport[];
  activeReport: AnalysisReport | null;
  activePlan: ContentPlan | null;
  isAuthModalOpen: boolean;
  isConnectModalOpen: boolean;
  connectPlatform: SocialPlatform;
  notifications: ToastNotification[];
  setUser: (user: User | null) => void;
  setLang: (lang: Language) => void;
  setCurrentView: (view: string) => void;
  setDashboardTab: (tab: string) => void;
  setSelectedReportId: (id: string | null) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openConnectModal: (platform?: SocialPlatform) => void;
  closeConnectModal: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  loginAs: (role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchReports: () => Promise<void>;
  loadReportDetails: (id: string) => Promise<void>;
  connectAccount: (platform: SocialPlatform, accountName: string, username: string) => Promise<boolean>;
  disconnectAccount: (id: string) => Promise<boolean>;
  refreshBalances: () => Promise<void>;
  isAdminAuthModalOpen: boolean;
  openAdminAuthModal: () => void;
  closeAdminAuthModal: () => void;
  setWallet: (wallet: WalletBalances) => void;
  deviceMode: 'mobile' | 'desktop';
  setDeviceMode: (mode: 'mobile' | 'desktop') => void;
  toggleDeviceMode: () => void;
  analyticsQualityDismissed: boolean;
  setAnalyticsQualityDismissed: (val: boolean) => void;
  activateDesktopForAnalytics: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'user_1',
    name: 'سارة المنصور | Sarah Al-Mansoor',
    email: 'demo@orvex.ai',
    role: 'user',
    preferredLang: 'ar',
    timezone: 'Asia/Riyadh',
    createdAt: '2026-01-15T10:00:00Z',
    instagramPurchasesCount: 1,
    facebookPurchasesCount: 1,
  });

  const [wallet, setWallet] = useState<WalletBalances>({
    instagramCredits: 3,
    facebookCredits: 3,
    instagramPurchasesCount: 1,
    facebookPurchasesCount: 1,
  });

  const [lang, setLangState] = useState<Language>('ar');
  const [currentView, setCurrentView] = useState<string>('home');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [activeReport, setActiveReport] = useState<AnalysisReport | null>(null);
  const [activePlan, setActivePlan] = useState<ContentPlan | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectPlatform, setConnectPlatform] = useState<SocialPlatform>('instagram');
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [deviceMode, setDeviceModeState] = useState<'mobile' | 'desktop'>('desktop');
  const [analyticsQualityDismissed, setAnalyticsQualityDismissed] = useState<boolean>(true);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const openAdminAuthModal = () => setIsAdminAuthModalOpen(true);
  const closeAdminAuthModal = () => setIsAdminAuthModalOpen(false);

  const setDeviceMode = (mode: 'mobile' | 'desktop') => {
    setDeviceModeState(mode);
  };

  const toggleDeviceMode = () => {
    const next = deviceMode === 'mobile' ? 'desktop' : 'mobile';
    setDeviceModeState(next);
    showToast(
      next === 'desktop'
        ? (lang === 'ar' ? 'تم تفعيل وضع الديسكتوب' : 'Switched to Desktop Mode')
        : (lang === 'ar' ? 'تم تفعيل وضع تطبيق الجوال' : 'Switched to Mobile App Mode'),
      'info'
    );
  };

  const activateDesktopForAnalytics = () => {
    setDeviceModeState('desktop');
    setAnalyticsQualityDismissed(true);
    showToast(
      lang === 'ar'
        ? 'تم تفعيل وضع الديسكتوب لعرض التحليلات بكامل الدقة والتفاصيل'
        : 'Desktop Mode activated for high-fidelity analytics presentation',
      'success'
    );
  };

  const t = translations[lang];

  // Update HTML dir and lang attributes
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    fetchAccounts();
    fetchReports();
    fetchProfile();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}`;
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { ok, data } = await safeFetchJson(`/api/user/profile?userId=${user.id}`);
      if (ok && data) {
        setUser(data.user);
        if (data.wallet) setWallet(data.wallet);
      }
    } catch (e) {
      console.warn('fetchProfile offline fallback:', e);
    }
  };

  const fetchAccounts = async () => {
    if (!user) return;
    try {
      const { ok, data } = await safeFetchJson(`/api/social/accounts?userId=${user.id}`);
      if (ok && data) {
        setAccounts(data.accounts || []);
      }
    } catch (e) {
      console.warn('fetchAccounts fallback:', e);
    }
  };

  const fetchReports = async () => {
    if (!user) return;
    try {
      const { ok, data } = await safeFetchJson(`/api/analysis/reports?userId=${user.id}&lang=${lang}`);
      if (ok && data) {
        setReports(data.reports || []);
        if (data.reports?.length > 0 && !activeReport) {
          loadReportDetails(data.reports[0].id);
        }
      }
    } catch (e) {
      console.warn('fetchReports fallback:', e);
    }
  };

  const loadReportDetails = async (id: string) => {
    try {
      const { ok, data } = await safeFetchJson(`/api/analysis/reports/${id}?lang=${lang}`);
      if (ok && data) {
        setActiveReport(data.report);
        setActivePlan(data.plan);
        setSelectedReportId(id);
      }
    } catch (e) {
      console.warn('loadReportDetails fallback:', e);
    }
  };

  const refreshBalances = async () => {
    if (!user) return;
    try {
      const { ok, data } = await safeFetchJson(`/api/wallet/balances?userId=${user.id}`);
      if (ok && data && data.wallet) {
        setWallet(data.wallet);
      }
    } catch (e) {
      console.warn('refreshBalances fallback:', e);
    }
  };

  const connectAccount = async (platform: SocialPlatform, accountName: string, username: string): Promise<boolean> => {
    if (!user) return false;
    try {
      const { ok, data, error } = await safeFetchJson('/api/social/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, platform, accountName, username }),
      });
      if (!ok || !data) {
        showToast(error || data?.error || 'Failed to connect account', 'error');
        return false;
      }
      setAccounts((prev) => [...prev, data.account]);
      showToast(lang === 'ar' ? 'تم ربط الحساب بنجاح عبر Meta!' : 'Account connected via Meta successfully!', 'success');
      return true;
    } catch (e: any) {
      showToast(e.message || 'Error connecting account', 'error');
      return false;
    }
  };

  const disconnectAccount = async (id: string): Promise<boolean> => {
    try {
      const { ok } = await safeFetchJson(`/api/social/disconnect/${id}`, { method: 'DELETE' });
      if (ok) {
        setAccounts((prev) => prev.filter((a) => a.id !== id));
        showToast(lang === 'ar' ? 'تم فصل الحساب بنجاح.' : 'Account disconnected.', 'info');
        return true;
      }
    } catch (e) {
      console.warn('disconnect error:', e);
    }
    return false;
  };

  const loginAs = async (role: 'user' | 'admin') => {
    const email = role === 'admin' ? 'admin@orvex.ai' : 'demo@orvex.ai';
    try {
      const { ok, data, error } = await safeFetchJson('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!ok || !data) {
        showToast(error || 'Login failed', 'error');
        return;
      }
      setUser(data.user);
      setWallet(data.wallet);
      setIsAuthModalOpen(false);
      showToast(
        lang === 'ar'
          ? `تم تسجيل الدخول بنجاح بصفتك: ${data.user.role === 'admin' ? 'مدير المنصة' : 'مستخدم تجريبي'}`
          : `Signed in as: ${data.user.role === 'admin' ? 'Super Admin' : 'Demo Creator'}`,
        'success'
      );
    } catch (e: any) {
      showToast(e.message || 'Login error', 'error');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentView('logout');
    showToast(lang === 'ar' ? 'تم تسجيل الخروج بنجاح.' : 'Signed out successfully.', 'info');
  };

  const openAuthModal = () => setCurrentView('auth');
  const closeAuthModal = () => setCurrentView('home');

  const openConnectModal = (platform: SocialPlatform = 'instagram') => {
    setConnectPlatform(platform);
    setIsConnectModalOpen(true);
  };
  const closeConnectModal = () => setIsConnectModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        user,
        wallet,
        lang,
        t,
        currentView,
        dashboardTab,
        selectedReportId,
        accounts,
        reports,
        activeReport,
        activePlan,
        isAuthModalOpen,
        isConnectModalOpen,
        connectPlatform,
        notifications,
        setUser,
        setLang,
        setCurrentView,
        setDashboardTab,
        setSelectedReportId,
        openAuthModal,
        closeAuthModal,
        openConnectModal,
        closeConnectModal,
        showToast,
        loginAs,
        logout,
        fetchProfile,
        fetchAccounts,
        fetchReports,
        loadReportDetails,
        connectAccount,
        disconnectAccount,
        refreshBalances,
        isAdminAuthModalOpen,
        openAdminAuthModal,
        closeAdminAuthModal,
        setWallet,
        deviceMode,
        setDeviceMode,
        toggleDeviceMode,
        analyticsQualityDismissed,
        setAnalyticsQualityDismissed,
        activateDesktopForAnalytics,
      }}
    >
      {children}

      {/* Global Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all transform duration-300 flex items-center justify-between ${
              n.type === 'success'
                ? 'bg-[#181715] text-[#5DB8A6] border-[#5DB8A6]/30'
                : n.type === 'error'
                ? 'bg-[#181715] text-[#C64545] border-[#C64545]/30'
                : 'bg-[#181715] text-[#FAF9F5] border-[#35322D]'
            }`}
          >
            <span>{n.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
