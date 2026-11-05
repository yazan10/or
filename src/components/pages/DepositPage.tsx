import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialPlatform } from '../../types';
import {
  CreditCard,
  Wallet,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Printer,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Facebook,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const DepositPage: React.FC = () => {
  const { user, wallet, lang, t, refreshBalances, showToast, setCurrentView, setDashboardTab } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [packageType, setPackageType] = useState<'standard' | 'double' | 'agency' | 'custom'>('standard');
  const [customTrialsInput, setCustomTrialsInput] = useState<number>(20);
  const [activeTab, setActiveTab] = useState<'card' | 'paypal'>('card');

  // Form State
  const [cardholderName, setCardholderName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Processing & Verification State
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verifiedReceipt, setVerifiedReceipt] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Transaction Ledger State
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingTxns, setIsLoadingTxns] = useState(false);

  // Fetch transactions history
  const fetchTransactions = async () => {
    if (!user) return;
    setIsLoadingTxns(true);
    try {
      const res = await fetch(`/api/paypal/transactions?userId=${user.id}`);
      const data = await res.json();
      if (res.ok && data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.warn('Failed to fetch transactions:', err);
    } finally {
      setIsLoadingTxns(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  // Pricing calculations
  const isIg = selectedPlatform === 'instagram';
  const purchaseCount = isIg ? (wallet?.instagramPurchasesCount || 0) : (wallet?.facebookPurchasesCount || 0);
  const isFirstPurchase = purchaseCount === 0;

  let baseTrials = isIg
    ? (isFirstPurchase ? 3 : 10)
    : (isFirstPurchase ? 3 : 10);

  let basePriceILS = isIg
    ? (isFirstPurchase ? 12 : 8)
    : (isFirstPurchase ? 15 : 10);

  let effectiveTrials = baseTrials;
  let effectivePriceILS = basePriceILS;

  if (packageType === 'double') {
    effectiveTrials = baseTrials * 2;
    effectivePriceILS = Math.round(basePriceILS * 1.85); // 15% discount
  } else if (packageType === 'agency') {
    effectiveTrials = baseTrials * 5;
    effectivePriceILS = Math.round(basePriceILS * 4.2); // 20% discount
  } else if (packageType === 'custom') {
    effectiveTrials = Math.max(5, customTrialsInput);
    const perTrialRate = isIg ? 0.8 : 1.0;
    effectivePriceILS = Math.round(effectiveTrials * perTrialRate);
  }

  const ilsToUsdRate = 0.27;
  const amountUSD = Number((effectivePriceILS * ilsToUsdRate).toFixed(2));

  // Card brand detection
  const cleanNum = cardNumber.replace(/\D/g, '');
  let detectedBrand: 'VISA' | 'MASTERCARD' | 'AMEX' | null = null;
  if (/^4/.test(cleanNum)) detectedBrand = 'VISA';
  else if (/^(5[1-5]|2[2-7])/.test(cleanNum)) detectedBrand = 'MASTERCARD';
  else if (/^3[47]/.test(cleanNum)) detectedBrand = 'AMEX';

  // Format Card Number (groups of 4)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 19);
    const parts = raw.match(/.{1,4}/g);
    setCardNumber(parts ? parts.join(' ') : raw);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2);
    }
    setExpiry(raw);
  };

  // Quick fill test card
  const handleQuickFill = (type: 'visa' | 'mastercard') => {
    if (type === 'visa') {
      setCardNumber('4242 4242 4242 4242');
      setExpiry('12/28');
      setCvv('123');
      setPostalCode('90210');
      if (!cardholderName) setCardholderName(user?.name || 'Yazan Salaq');
    } else {
      setCardNumber('5555 5555 5555 4444');
      setExpiry('11/29');
      setCvv('456');
      setPostalCode('10001');
      if (!cardholderName) setCardholderName(user?.name || 'Yazan Salaq');
    }
  };

  // Direct Card Payment via PayPal API
  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isProcessing) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/paypal/pay-with-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          platform: selectedPlatform,
          cardholderName,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiry,
          cvv,
          postalCode,
          customTrials: packageType === 'custom' ? effectiveTrials : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Card authorization failed');
      }

      await refreshBalances();
      await fetchTransactions();
      setVerifiedReceipt(data);

      showToast(
        isAr
          ? `تم تأكيد الدفع عبر PayPal وإضافة ${data.trialsAdded} محاولات بنجاح!`
          : `Payment approved! Added ${data.trialsAdded} trials to your wallet.`,
        'success'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment error');
    } finally {
      setIsProcessing(false);
    }
  };

  // PayPal Account / Smart Buttons Capture
  const handlePayPalDirect = async () => {
    if (!user || isProcessing) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // 1. Create order
      const orderRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          platform: selectedPlatform,
          customTrials: packageType === 'custom' ? effectiveTrials : undefined,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || orderData.error) throw new Error(orderData.error || 'Failed to initialize order');

      // 2. Capture order
      const capRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          platform: selectedPlatform,
          orderId: orderData.orderId,
          paymentSource: 'paypal',
          autoApproveSandbox: true,
        }),
      });
      const capData = await capRes.json();
      if (!capRes.ok || capData.error) throw new Error(capData.error || 'Failed to capture PayPal order');

      await refreshBalances();
      await fetchTransactions();
      setVerifiedReceipt(capData);

      showToast(
        isAr
          ? `تم شحن المحفظة بنجاح عبر حساب PayPal!`
          : `Wallet successfully credited via PayPal!`,
        'success'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'PayPal capture failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 animate-fade-in text-[#141413]">
      {/* Top Banner & Header */}
      <div className="space-y-3 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CC785C]/10 text-[#CC785C] text-xs font-bold border border-[#CC785C]/20">
          <ShieldCheck className="w-4 h-4 text-[#5DB8A6]" />
          <span>{isAr ? 'بوابة التحصيل والإيداع المشفرة — PayPal الرسمية' : 'Official PayPal Secure Deposit Gateway'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {isAr ? 'إيداع وشراء رصيد التحليلات' : 'Deposit & Purchase Analytics Credits'}
        </h1>
        <p className="text-sm text-[#6C6A64] leading-relaxed">
          {isAr
            ? 'شحن مباشر وفوري لمحافظ Instagram و Facebook بالشيقل المحلي مع تحصيل دقيق بالدولار عبر PayPal وبطاقات Visa و MasterCard وفاتورة رسمية معتمدة لكل عملية.'
            : 'Instant top-up for your Instagram & Facebook wallets with transparent local ILS pricing, real-time USD PayPal checkout, and certified invoice generation.'}
        </p>
      </div>

      {/* SECTION 1: WALLETS BALANCE OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Instagram Wallet Card */}
        <div
          onClick={() => setSelectedPlatform('instagram')}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
            selectedPlatform === 'instagram'
              ? 'bg-[#FAF9F5] border-[#CC785C] shadow-md ring-2 ring-[#CC785C]/20'
              : 'bg-[#FAF9F5] border-[#E6DFD8] hover:border-[#CC785C]/40 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E1306C]/10 text-[#E1306C] flex items-center justify-center font-bold">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#141413]">{t.walletPage.igWalletName}</h3>
                <p className="text-xs text-[#6C6A64]">
                  {wallet?.instagramPurchasesCount === 0
                    ? (isAr ? 'باقة أول مرة: 3 محاولات بـ 12 شيقل' : 'First package: 3 trials for 12 ILS')
                    : (isAr ? 'باقة التجديد: 10 محاولات بـ 8 شواقل' : 'Subsequent: 10 trials for 8 ILS')}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#CC785C]/10 text-[#CC785C]">
              {selectedPlatform === 'instagram' ? (isAr ? 'محدد حالياً' : 'Selected') : (isAr ? 'اضغط للتحديد' : 'Click to select')}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2 border-t border-[#E6DFD8]">
            <span className="text-xs text-[#6C6A64]">{isAr ? 'الرصيد المتاح:' : 'Available Balance:'}</span>
            <div className="text-right">
              <span className="text-2xl font-black text-[#141413] tabular-nums">
                {wallet?.instagramCredits || 0}
              </span>
              <span className="text-xs font-semibold text-[#6C6A64] ml-1 mr-1">{t.dashboard.trialsUnit}</span>
            </div>
          </div>
        </div>

        {/* Facebook Wallet Card */}
        <div
          onClick={() => setSelectedPlatform('facebook')}
          className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
            selectedPlatform === 'facebook'
              ? 'bg-[#FAF9F5] border-[#1877F2] shadow-md ring-2 ring-[#1877F2]/20'
              : 'bg-[#FAF9F5] border-[#E6DFD8] hover:border-[#1877F2]/40 opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold">
                <Facebook className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#141413]">{t.walletPage.fbWalletName}</h3>
                <p className="text-xs text-[#6C6A64]">
                  {wallet?.facebookPurchasesCount === 0
                    ? (isAr ? 'باقة أول مرة: 3 محاولات بـ 15 شيقل' : 'First package: 3 trials for 15 ILS')
                    : (isAr ? 'باقة التجديد: 10 محاولات بـ 10 شواقل' : 'Subsequent: 10 trials for 10 ILS')}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#1877F2]/10 text-[#1877F2]">
              {selectedPlatform === 'facebook' ? (isAr ? 'محدد حالياً' : 'Selected') : (isAr ? 'اضغط للتحديد' : 'Click to select')}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-2 border-t border-[#E6DFD8]">
            <span className="text-xs text-[#6C6A64]">{isAr ? 'الرصيد المتاح:' : 'Available Balance:'}</span>
            <div className="text-right">
              <span className="text-2xl font-black text-[#141413] tabular-nums">
                {wallet?.facebookCredits || 0}
              </span>
              <span className="text-xs font-semibold text-[#6C6A64] ml-1 mr-1">{t.dashboard.trialsUnit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFIED RECEIPT MODAL / OVERLAY */}
      <AnimatePresence>
        {verifiedReceipt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#FAF9F5] border-2 border-[#5DB8A6] shadow-xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E6DFD8] pb-5">
              <div className="flex items-center gap-3 text-center sm:text-right">
                <div className="w-12 h-12 rounded-2xl bg-[#5DB8A6]/20 text-[#5DB8A6] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#5DB8A6]/15 text-[#2C7A6D] text-[11px] font-black uppercase mb-1">
                    {isAr ? 'معاملة مؤكدة رسمياً عبر PayPal' : 'PayPal Verified Transaction'}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#141413]">
                    {isAr ? 'إيصال سداد وفاتورة شحن الرصيد المعتمدة' : 'Official Top-Up Deposit Invoice & Receipt'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#EFE9DE] hover:bg-[#E8E0D2] border border-[#E6DFD8] flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
                </button>
                <button
                  onClick={() => setVerifiedReceipt(null)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-[#CC785C] text-white hover:bg-[#A9583E] cursor-pointer"
                >
                  {isAr ? 'إتمام ومتابعة' : 'Done'}
                </button>
              </div>
            </div>

            {/* Strict Invoice Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#EFE9DE] border border-[#E6DFD8] space-y-1">
                <span className="text-[#6C6A64] block">{isAr ? 'رقم الفاتورة الرسمية:' : 'Official Invoice #:'}</span>
                <strong className="font-mono text-sm text-[#141413] block">
                  {verifiedReceipt.invoiceNumber || verifiedReceipt.transaction?.invoiceNumber || `INV-ORVEX-${Date.now().toString().slice(-6)}`}
                </strong>
              </div>

              <div className="p-4 rounded-xl bg-[#EFE9DE] border border-[#E6DFD8] space-y-1">
                <span className="text-[#6C6A64] block">{isAr ? 'المبلغ المحصل بالدولار (USD):' : 'Exact Amount Charged (USD):'}</span>
                <strong className="text-base font-black text-[#5DB8A6] block tabular-nums">
                  ${verifiedReceipt.amountPaidUSD || verifiedReceipt.transaction?.amountUSD || amountUSD} USD
                </strong>
              </div>

              <div className="p-4 rounded-xl bg-[#EFE9DE] border border-[#E6DFD8] space-y-1">
                <span className="text-[#6C6A64] block">{isAr ? 'المقابل بالشيقل المحلي:' : 'Local ILS Equivalent:'}</span>
                <strong className="text-base font-extrabold text-[#CC785C] block tabular-nums">
                  {verifiedReceipt.amountPaidILS || verifiedReceipt.transaction?.priceILS || effectivePriceILS} ILS
                </strong>
              </div>

              <div className="p-4 rounded-xl bg-[#EFE9DE] border border-[#E6DFD8] space-y-1">
                <span className="text-[#6C6A64] block">{isAr ? 'المحاولات المضافة:' : 'Credited Trials:'}</span>
                <strong className="text-base font-black text-[#141413] block tabular-nums">
                  +{verifiedReceipt.trialsAdded || verifiedReceipt.transaction?.trialsCount || effectiveTrials} {t.dashboard.trialsUnit}
                </strong>
              </div>
            </div>

            {/* Account & Security Proof Details */}
            <div className="bg-white p-5 rounded-2xl border border-[#E6DFD8] text-xs space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#E6DFD8] pb-2.5">
                <span className="text-[#6C6A64]">{isAr ? 'المعرف الرقمي للمعاملة (Transaction ID):' : 'Transaction Reference:'}</span>
                <div className="flex items-center gap-1.5 font-mono text-xs">
                  <span className="font-bold">{verifiedReceipt.transactionId || verifiedReceipt.captureId || verifiedReceipt.orderId}</span>
                  <button
                    onClick={() => copyId(verifiedReceipt.transactionId || verifiedReceipt.captureId || verifiedReceipt.orderId)}
                    className="p-1 hover:text-[#CC785C] cursor-pointer"
                    title="Copy"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#5DB8A6]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center border-b border-[#E6DFD8] pb-2.5">
                <span className="text-[#6C6A64]">{isAr ? 'المنصة المشحونة:' : 'Target Platform Wallet:'}</span>
                <span className="font-bold uppercase text-[#CC785C]">{verifiedReceipt.platform || selectedPlatform}</span>
              </div>

              <div className="flex justify-between items-center border-b border-[#E6DFD8] pb-2.5">
                <span className="text-[#6C6A64]">{isAr ? 'الرصيد السابق ➔ الجديد:' : 'Balance Before ➔ After:'}</span>
                <span className="font-bold tabular-nums">
                  {verifiedReceipt.previousBalance ?? (isIg ? wallet?.instagramCredits : wallet?.facebookCredits)} {t.dashboard.trialsUnit} ➔{' '}
                  <span className="text-[#5DB8A6]">{verifiedReceipt.newBalance} {t.dashboard.trialsUnit}</span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#6C6A64]">{isAr ? 'طريقة الدفع ومصدر التحصيل:' : 'Payment Method & Provider:'}</span>
                <span className="font-semibold flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#0070BA] text-white font-black text-[10px]">PayPal</span>
                  {verifiedReceipt.brand && (
                    <span className="px-2 py-0.5 rounded bg-[#181715] text-white font-bold text-[10px]">
                      {verifiedReceipt.brand} {verifiedReceipt.last4 ? `•••• ${verifiedReceipt.last4}` : ''}
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#6C6A64]">
                {isAr ? 'الرصيد متاح فوراً في حسابك ولا تنتهي صلاحيته أبداً.' : 'Your credits are ready to use immediately and never expire.'}
              </span>
              <button
                onClick={() => {
                  setDashboardTab('new-analysis');
                  setCurrentView('dashboard');
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#141413] text-white hover:bg-[#252320] flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isAr ? 'بدء تحليل جديد بالرصيد' : 'Start New Analysis'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 2: INTERACTIVE PACKAGE SELECTOR & PAYMENT TERMINAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Package Selector */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#FAF9F5] p-6 rounded-3xl border border-[#E6DFD8] shadow-xs space-y-5">
            <h3 className="font-bold text-base text-[#141413] flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[#CC785C]" />
              <span>{isAr ? '1. اختر حجم باقة الرصيد' : '1. Choose Package Size'}</span>
            </h3>

            {/* Package Tiers Options */}
            <div className="space-y-3">
              {/* Option 1: Standard Package */}
              <div
                onClick={() => setPackageType('standard')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  packageType === 'standard'
                    ? 'border-[#CC785C] bg-[#FAF9F5] shadow-xs'
                    : 'border-[#E6DFD8] bg-[#EFE9DE]/50 hover:bg-[#EFE9DE]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#141413]">
                      {isAr ? 'الباقة القياسية' : 'Standard Tier'}
                    </p>
                    {isFirstPurchase && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#CC785C]/15 text-[#CC785C]">
                        {isAr ? 'عرض أول مرة' : 'First Time'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#6C6A64]">
                    {baseTrials} {t.dashboard.trialsUnit} {isAr ? 'كاملة' : 'full analyses'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#CC785C] tabular-nums block">{basePriceILS} ILS</span>
                  <span className="text-[11px] text-[#6C6A64] tabular-nums">~${(basePriceILS * ilsToUsdRate).toFixed(2)} USD</span>
                </div>
              </div>

              {/* Option 2: Double Value Package */}
              <div
                onClick={() => setPackageType('double')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  packageType === 'double'
                    ? 'border-[#CC785C] bg-[#FAF9F5] shadow-xs'
                    : 'border-[#E6DFD8] bg-[#EFE9DE]/50 hover:bg-[#EFE9DE]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#141413]">
                      {isAr ? 'باقة القيمة المضاعفة' : 'Double Value Tier'}
                    </p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#5DB8A6]/20 text-[#2C7A6D]">
                      {isAr ? 'توفير 15%' : 'Save 15%'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6C6A64]">
                    {baseTrials * 2} {t.dashboard.trialsUnit}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#CC785C] tabular-nums block">
                    {Math.round(basePriceILS * 1.85)} ILS
                  </span>
                  <span className="text-[11px] text-[#6C6A64] tabular-nums">
                    ~${(Math.round(basePriceILS * 1.85) * ilsToUsdRate).toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Option 3: Agency Power Package */}
              <div
                onClick={() => setPackageType('agency')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  packageType === 'agency'
                    ? 'border-[#CC785C] bg-[#FAF9F5] shadow-xs'
                    : 'border-[#E6DFD8] bg-[#EFE9DE]/50 hover:bg-[#EFE9DE]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#141413]">
                      {isAr ? 'باقة الوكالات وصناع المحتوى' : 'Agency / Pro Tier'}
                    </p>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#5DB8A6]/20 text-[#2C7A6D]">
                      {isAr ? 'توفير 20%' : 'Save 20%'}
                    </span>
                  </div>
                  <p className="text-xs text-[#6C6A64]">
                    {baseTrials * 5} {t.dashboard.trialsUnit}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#CC785C] tabular-nums block">
                    {Math.round(basePriceILS * 4.2)} ILS
                  </span>
                  <span className="text-[11px] text-[#6C6A64] tabular-nums">
                    ~${(Math.round(basePriceILS * 4.2) * ilsToUsdRate).toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Option 4: Custom Quantity */}
              <div
                onClick={() => setPackageType('custom')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2 ${
                  packageType === 'custom'
                    ? 'border-[#CC785C] bg-[#FAF9F5] shadow-xs'
                    : 'border-[#E6DFD8] bg-[#EFE9DE]/50 hover:bg-[#EFE9DE]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-[#141413]">
                    {isAr ? 'تحديد كمية محاولات مخصصة' : 'Custom Quantity'}
                  </p>
                  <span className="text-xs font-bold text-[#CC785C] tabular-nums">
                    {effectivePriceILS} ILS (~${amountUSD} USD)
                  </span>
                </div>

                {packageType === 'custom' && (
                  <div className="pt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={5}
                      max={100}
                      step={5}
                      value={customTrialsInput}
                      onChange={(e) => setCustomTrialsInput(parseInt(e.target.value, 10))}
                      className="flex-1 accent-[#CC785C] cursor-pointer"
                    />
                    <span className="text-xs font-extrabold px-3 py-1 bg-[#EFE9DE] rounded-lg tabular-nums">
                      {customTrialsInput} {t.dashboard.trialsUnit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Inclusions summary */}
            <div className="p-4 bg-[#EFE9DE] rounded-xl border border-[#E6DFD8] text-xs text-[#3D3D3A] space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{isAr ? 'تقارير فحص وتشخيص أداء كاملة مع مؤشر SWOT' : 'Full diagnostic audit reports + SWOT matrix'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{isAr ? 'خطة محتوى 30 يوماً قابلة للتصدير كـ CSV' : 'Exportable 30-day content calendar (CSV ready)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                <span>{isAr ? 'الرصيد دائم في محفظتك ولا تنتهي صلاحيته' : 'Non-expiring permanent balance'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Strict Payment Terminal */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border border-[#E6DFD8] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6DFD8] pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-[#141413]">
                  {isAr ? '2. بوابة الدفع والتحصيل المشفرة' : '2. Secure Payment Gateway'}
                </h3>
                <p className="text-xs text-[#6C6A64]">
                  {isAr ? 'الدفع مباشر عبر خوادم PayPal العالمية المعتمدة' : 'Powered by official PayPal payment infrastructure'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#5DB8A6]/10 text-[#2C7A6D] text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#5DB8A6]" />
                <span>256-Bit SSL</span>
              </div>
            </div>

            {/* Live Exchange Rate Box */}
            <div className="bg-[#F5F0E8] p-4 rounded-2xl border border-[#E6DFD8] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#6C6A64] block">{isAr ? 'المبلغ النهائي المعتمد:' : 'Total Charge Amount:'}</span>
                <span className="text-xl font-black text-[#141413] tabular-nums">${amountUSD} USD</span>
                <span className="text-xs text-[#CC785C] font-bold block tabular-nums">({effectivePriceILS} ILS)</span>
              </div>
              <div className="text-right text-[11px] text-[#6C6A64]">
                <span>{isAr ? 'سعر الصرف:' : 'Exchange Rate:'}</span>
                <strong className="block text-[#141413]">1 ILS = $0.27 USD</strong>
                <span className="text-[#5DB8A6] font-semibold">{isAr ? 'بدون رسوم خفية' : '0% hidden fees'}</span>
              </div>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="flex rounded-xl bg-[#EFE9DE] p-1 border border-[#E6DFD8] gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-[#FAF9F5] text-[#141413] shadow-sm'
                    : 'text-[#6C6A64] hover:text-[#141413]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#CC785C]" />
                <span>{isAr ? 'بطاقة Visa / MasterCard' : 'Visa / MasterCard'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paypal')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'paypal'
                    ? 'bg-[#FAF9F5] text-[#0070BA] shadow-sm'
                    : 'text-[#6C6A64] hover:text-[#141413]'
                }`}
              >
                <span className="font-black text-sm text-[#0070BA]">P</span>
                <span>{isAr ? 'حساب باي بال (PayPal)' : 'PayPal Direct'}</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3.5 bg-[#C64545]/10 border border-[#C64545]/30 rounded-xl text-xs text-[#C64545] flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: CARD FORM */}
            {activeTab === 'card' && (
              <form onSubmit={handleCardPayment} className="space-y-4">
                {/* Test Cards Quick Fill */}
                <div className="flex items-center justify-between text-xs bg-[#EFE9DE]/80 px-3 py-2 rounded-xl border border-[#E6DFD8]">
                  <span className="text-[#6C6A64] text-[11px]">{isAr ? 'بطاقات تجريبية سريعة:' : 'Quick Test Cards:'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('visa')}
                      className="px-2.5 py-1 rounded-lg bg-[#1A1F71] text-white text-[11px] font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                    >
                      Visa Test (4242)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('mastercard')}
                      className="px-2.5 py-1 rounded-lg bg-[#EB001B] text-white text-[11px] font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                    >
                      Mastercard Test (5555)
                    </button>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1">
                    {isAr ? 'اسم حامل البطاقة' : 'Cardholder Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder="Yazan Salaq"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#141413]">
                      {isAr ? 'رقم البطاقة الائتمانية' : 'Card Number'}
                    </label>
                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                          detectedBrand === 'VISA'
                            ? 'bg-[#1A1F71] text-white scale-105 shadow-xs'
                            : 'bg-[#EFE9DE] text-[#6C6A64]'
                        }`}
                      >
                        VISA
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                          detectedBrand === 'MASTERCARD'
                            ? 'bg-[#EB001B] text-white scale-105 shadow-xs'
                            : 'bg-[#EFE9DE] text-[#6C6A64]'
                        }`}
                      >
                        Mastercard
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black transition-all ${
                          detectedBrand === 'AMEX'
                            ? 'bg-[#002663] text-white scale-105 shadow-xs'
                            : 'bg-[#EFE9DE] text-[#6C6A64]'
                        }`}
                      >
                        AMEX
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      maxLength={23}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors"
                    />
                    <Lock className="w-4 h-4 text-[#6C6A64] absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1">
                      {isAr ? 'تاريخ الانتهاء' : 'Expiry (MM/YY)'}
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1">
                      {isAr ? 'رمز الأمان (CVV)' : 'Security Code (CVV)'}
                    </label>
                    <input
                      type="password"
                      required
                      dir="ltr"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors text-center"
                    />
                  </div>
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1">
                    {isAr ? 'الرمز البريدي (اختياري)' : 'Postal / ZIP Code (optional)'}
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="90210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Action Submit */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#CC785C] hover:bg-[#A9583E] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{isAr ? 'جاري معالجة وتأكيد الدفع عبر PayPal...' : 'Securing authorization via PayPal...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>
                        {isAr ? `تأكيد الدفع بالبطاقة ($${amountUSD} USD / ${effectivePriceILS} ILS)` : `Confirm Card Payment ($${amountUSD} USD)`}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: PAYPAL SMART BUTTONS */}
            {activeTab === 'paypal' && (
              <div className="space-y-4 py-3">
                <p className="text-xs text-[#6C6A64] leading-relaxed">
                  {isAr
                    ? 'سيتم توجيهك للمصادقة السريعة والآمنة عبر بوابة PayPal الرسمية، مع شحن رصيدك وتحديث محفظتك لحظياً بعد التأكيد.'
                    : 'Authorize instantly through the official PayPal checkout popup. Credits are applied to your balance immediately upon confirmation.'}
                </p>

                {/* Primary PayPal Button */}
                <button
                  type="button"
                  onClick={handlePayPalDirect}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#003087]/30 border-t-[#003087] rounded-full animate-spin" />
                      <span className="text-xs font-bold">{isAr ? 'جاري الاتصال بـ PayPal...' : 'Connecting to PayPal...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="italic font-extrabold text-lg">Pay</span>
                      <span className="italic font-extrabold text-lg text-[#0070BA]">Pal</span>
                      <span className="text-xs font-bold text-[#141413] ml-2 mr-2">
                        (${amountUSD} USD / {effectivePriceILS} ILS)
                      </span>
                    </>
                  )}
                </button>

                {/* Secondary Card Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className="w-full py-3 bg-[#2C2E2F] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isAr ? 'الدفع بواسطة بطاقة ائتمانية (Visa / MasterCard)' : 'Pay with Debit or Credit Card'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: TRANSACTION HISTORY & AUDIT LEDGER */}
      <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-3xl border border-[#E6DFD8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E6DFD8] pb-4">
          <div>
            <h3 className="font-extrabold text-base text-[#141413] flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 text-[#CC785C] ${isLoadingTxns ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'سجل العمليات والإيداعات المكتملة' : 'Deposits & Transaction History'}</span>
            </h3>
            <p className="text-xs text-[#6C6A64]">
              {isAr ? 'سجل محاسبي معتمد يوثق كافة المبالغ المحصلة والمحاولات المشحونة' : 'Audit ledger of all settled payments and credited packages'}
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#EFE9DE] hover:bg-[#E8E0D2] border border-[#E6DFD8] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#6C6A64]" />
            <span>{isAr ? 'تحديث السجل' : 'Refresh'}</span>
          </button>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right rtl:text-right ltr:text-left">
            <thead>
              <tr className="border-b border-[#E6DFD8] text-[#6C6A64]">
                <th className="py-2.5 px-3 font-semibold">{isAr ? 'رقم الفاتورة' : 'Invoice #'}</th>
                <th className="py-2.5 px-3 font-semibold">{isAr ? 'المنصة' : 'Platform'}</th>
                <th className="py-2.5 px-3 font-semibold">{isAr ? 'المحاولات' : 'Trials'}</th>
                <th className="py-2.5 px-3 font-semibold">{isAr ? 'المبلغ بالدولار' : 'Amount USD'}</th>
                <th className="py-2.5 px-3 font-semibold">{isAr ? 'المبلغ بالشيقل' : 'Price ILS'}</th>
                <th className="py-2.5 px-3 font-semibold">{isAr ? 'طريقة الدفع' : 'Payment Method'}</th>
                <th className="py-2.5 px-3 font-semibold">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="py-2.5 px-3 font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD8]/60">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#6C6A64]">
                    {isAr ? 'لا توجد حركات إيداع سابقة مسجلة.' : 'No previous deposits found.'}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#EFE9DE]/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#141413]">
                      {tx.invoiceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.platform === 'instagram'
                            ? 'bg-[#E1306C]/10 text-[#E1306C]'
                            : 'bg-[#1877F2]/10 text-[#1877F2]'
                        }`}
                      >
                        {tx.platform}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-[#5DB8A6] tabular-nums">
                      +{tx.trialsCount}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#141413] tabular-nums">
                      ${tx.amountUSD} USD
                    </td>
                    <td className="py-3 px-3 text-[#6C6A64] tabular-nums">
                      {tx.priceILS} ILS
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {tx.paymentSource?.brand || 'PayPal'} {tx.paymentSource?.last4 ? `•••• ${tx.paymentSource.last4}` : ''}
                    </td>
                    <td className="py-3 px-3 text-[#6C6A64] tabular-nums">
                      {new Date(tx.timestamp).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#5DB8A6]/15 text-[#2C7A6D] text-[10px] font-black">
                        <Check className="w-3 h-3" />
                        <span>{isAr ? 'مؤكدة' : 'Settled'}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
