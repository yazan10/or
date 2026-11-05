import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SocialPlatform } from '../../types';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PayPalCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: SocialPlatform;
  onSuccess?: (details: any) => void;
}

export const PayPalCheckoutModal: React.FC<PayPalCheckoutModalProps> = ({
  isOpen,
  onClose,
  platform,
  onSuccess,
}) => {
  const { user, t, lang, refreshBalances, showToast } = useApp();
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<'card' | 'paypal'>('card');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Card Form State
  const [cardholderName, setCardholderName] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Fetch or create order on open
  useEffect(() => {
    if (!isOpen || !user) return;
    setIsLoadingOrder(true);
    setErrorMsg(null);
    setSuccessReceipt(null);

    fetch('/api/paypal/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, platform }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setOrderData(data);
        }
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Network error creating order');
      })
      .finally(() => {
        setIsLoadingOrder(false);
      });
  }, [isOpen, user, platform]);

  if (!isOpen) return null;

  // Detect card brand
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

  // Submit Direct Card Payment via PayPal
  const handlePayWithCard = async (e: React.FormEvent) => {
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
          platform,
          cardholderName,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiry,
          cvv,
          postalCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Card payment authorization failed');
      }

      await refreshBalances();
      setSuccessReceipt(data);
      if (onSuccess) onSuccess(data);

      showToast(
        isAr
          ? `تم تأكيد الدفع ببطاقة ${data.brand} وإضافة ${data.trialsAdded} محاولات بنجاح!`
          : `Payment approved via ${data.brand}! Added ${data.trialsAdded} trials.`,
        'success'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit PayPal Smart / Account Capture
  const handleCapturePayPal = async () => {
    if (!user || !orderData || isProcessing) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          platform,
          orderId: orderData.orderId,
          paymentSource: 'paypal',
          autoApproveSandbox: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'PayPal capture failed');
      }

      await refreshBalances();
      setSuccessReceipt({
        ...data,
        amountUSD: orderData.amountUSD,
        priceILS: orderData.priceILS,
        brand: 'PAYPAL',
        last4: 'ACC',
      });
      if (onSuccess) onSuccess(data);

      showToast(
        isAr
          ? `تم تأكيد الدفع عبر PayPal وإضافة ${orderData.trialsCount} محاولات بنجاح!`
          : `PayPal payment confirmed! Added ${orderData.trialsCount} trials.`,
        'success'
      );
    } catch (err: any) {
      setErrorMsg(err.message || 'PayPal capture error');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyTransactionId = (id: string) => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-2xl max-w-lg w-full shadow-2xl p-5 sm:p-7 text-[#141413] relative my-auto max-h-[95vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#E6DFD8] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070BA]/10 text-[#0070BA] flex items-center justify-center font-black">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#141413]">
                {t.paymentCheckout?.modalTitle || 'بوابة الدفع — باي بال وبطاقات Visa / MasterCard'}
              </h2>
              <p className="text-xs text-[#6C6A64]">
                {t.paymentCheckout?.subtitle || 'ادفع بسرعة وأمان باستخدام بطاقتك الائتمانية أو حساب PayPal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6C6A64] hover:text-[#141413] p-1.5 rounded-lg hover:bg-[#EFE9DE] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUCCESS VIEW */}
        {successReceipt ? (
          <div className="space-y-5 text-center py-2 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-[#5DB8A6]/15 text-[#5DB8A6] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-[#141413]">
                {t.paymentCheckout?.successHeading || 'تمت عملية الدفع بنجاح!'}
              </h3>
              <p className="text-xs text-[#6C6A64] mt-1">
                {t.paymentCheckout?.successSubheading || 'تم شحن رصيد المحفظة وإضافة المحاولات بنجاح.'}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#EFE9DE] border border-[#E6DFD8] rounded-xl p-4 text-xs space-y-2.5 text-right">
              <div className="flex justify-between items-center">
                <span className="text-[#6C6A64]">{t.paymentCheckout?.platformLabel || 'المنصة:'}</span>
                <span className="font-bold uppercase text-[#CC785C]">{platform}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6C6A64]">{t.paymentCheckout?.trialsCountLabel || 'المحاولات المضافة:'}</span>
                <span className="font-bold text-sm tabular-nums text-[#5DB8A6]">
                  +{successReceipt.trialsAdded} {t.dashboard.trialsUnit}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6C6A64]">{t.paymentCheckout?.priceLocalLabel || 'المبلغ بالشيقل:'}</span>
                <span className="font-bold tabular-nums">{successReceipt.priceILS} ILS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#6C6A64]">{t.paymentCheckout?.priceUsdLabel || 'المبلغ بالدولار:'}</span>
                <span className="font-extrabold text-[#141413] tabular-nums">${successReceipt.amountUSD} USD</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#E6DFD8] pt-2">
                <span className="text-[#6C6A64]">{t.paymentCheckout?.paymentMethodLabel || 'طريقة الدفع:'}</span>
                <span className="font-semibold flex items-center gap-1.5">
                  {successReceipt.brand === 'VISA' && (
                    <span className="px-1.5 py-0.5 rounded bg-[#1A1F71] text-white font-black text-[10px]">VISA</span>
                  )}
                  {successReceipt.brand === 'MASTERCARD' && (
                    <span className="px-1.5 py-0.5 rounded bg-[#EB001B] text-white font-black text-[10px]">Mastercard</span>
                  )}
                  {successReceipt.brand === 'PAYPAL' && (
                    <span className="px-1.5 py-0.5 rounded bg-[#0070BA] text-white font-black text-[10px]">PayPal</span>
                  )}
                  {successReceipt.last4 && successReceipt.last4 !== 'ACC' && `•••• ${successReceipt.last4}`}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-[#E6DFD8] pt-2">
                <span className="text-[#6C6A64]">{t.paymentCheckout?.transactionIdLabel || 'رقم العملية:'}</span>
                <div className="flex items-center gap-1 font-mono text-[10px] text-[#141413]">
                  <span>{successReceipt.transactionId || successReceipt.captureId}</span>
                  <button
                    onClick={() => copyTransactionId(successReceipt.transactionId || successReceipt.captureId)}
                    className="p-1 hover:text-[#CC785C]"
                    title="Copy ID"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#5DB8A6]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-[#CC785C] hover:bg-[#A9583E] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
              >
                {t.paymentCheckout?.closeBtn || 'إغلاق ومتابعة التحليلات'}
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-3 bg-[#EFE9DE] hover:bg-[#E8E0D2] border border-[#E6DFD8] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print Receipt"
              >
                <Printer className="w-4 h-4 text-[#6C6A64]" />
                <span className="hidden sm:inline">{t.paymentCheckout?.printReceipt || 'طباعة'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Package Summary Box */}
            {isLoadingOrder ? (
              <div className="p-4 bg-[#EFE9DE] rounded-xl border border-[#E6DFD8] animate-pulse text-center text-xs text-[#6C6A64]">
                جاري احتساب تفاصيل الباقة وأسعار الصرف...
              </div>
            ) : orderData ? (
              <div className="bg-[#F5F0E8] border border-[#E6DFD8] rounded-xl p-3.5 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[#6C6A64]">{t.paymentCheckout?.packageSummaryTitle || 'الباقة المطلوبة:'}</span>
                  <span className="font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#CC785C]/15 text-[#CC785C]">
                    {platform === 'instagram' ? 'Instagram' : 'Facebook'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6C6A64]">{t.paymentCheckout?.trialsCountLabel || 'عدد المحاولات:'}</span>
                  <strong className="text-sm text-[#141413] tabular-nums">
                    {orderData.trialsCount} {t.dashboard.trialsUnit}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6C6A64]">{t.paymentCheckout?.priceLocalLabel || 'السعر المحلي:'}</span>
                  <strong className="text-sm font-bold text-[#CC785C] tabular-nums">{orderData.priceILS} ILS</strong>
                </div>
                <div className="flex justify-between items-center border-t border-[#E6DFD8] pt-1.5">
                  <span className="text-[#6C6A64]">{t.paymentCheckout?.priceUsdLabel || 'المبلغ بالدولار (USD):'}</span>
                  <strong className="text-base font-black text-[#141413] tabular-nums">${orderData.amountUSD} USD</strong>
                </div>
              </div>
            ) : null}

            {/* Payment Method Selector Tabs */}
            <div className="flex rounded-xl bg-[#EFE9DE] p-1 border border-[#E6DFD8] gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-[#FAF9F5] text-[#141413] shadow-sm'
                    : 'text-[#6C6A64] hover:text-[#141413]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-[#CC785C]" />
                <span>{t.paymentCheckout?.tabDirectCard || 'بطاقة Visa / MasterCard'}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paypal')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'paypal'
                    ? 'bg-[#FAF9F5] text-[#0070BA] shadow-sm'
                    : 'text-[#6C6A64] hover:text-[#141413]'
                }`}
              >
                <span className="font-black text-xs text-[#0070BA]">P</span>
                <span>{t.paymentCheckout?.tabPayPalButtons || 'حساب باي بال (PayPal)'}</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 bg-[#C64545]/10 border border-[#C64545]/30 rounded-xl text-xs text-[#C64545] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: DIRECT VISA / MASTERCARD PAYMENT */}
            {activeTab === 'card' && (
              <form onSubmit={handlePayWithCard} className="space-y-3.5">
                {/* Test Card Quick Fill Bar */}
                <div className="flex items-center justify-between text-[11px] bg-[#EFE9DE]/70 px-2.5 py-1.5 rounded-lg border border-[#E6DFD8]">
                  <span className="text-[#6C6A64]">{t.paymentCheckout?.quickTestCards || 'بطاقات تجريبية:'}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickFill('visa')}
                      className="px-2 py-0.5 rounded bg-[#1A1F71] text-white text-[10px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Visa Test
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickFill('mastercard')}
                      className="px-2 py-0.5 rounded bg-[#EB001B] text-white text-[10px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Mastercard Test
                    </button>
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1">
                    {t.paymentCheckout?.cardHolderLabel || 'اسم حامل البطاقة'}
                  </label>
                  <input
                    type="text"
                    required
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    placeholder={t.paymentCheckout?.cardHolderPlaceholder || 'YAZAN SALAQ'}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Card Number with Live Brand Badge */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#141413]">
                      {t.paymentCheckout?.cardNumberLabel || 'رقم البطاقة الائتمانية'}
                    </label>
                    <div className="flex items-center gap-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all ${
                          detectedBrand === 'VISA'
                            ? 'bg-[#1A1F71] text-white scale-105 shadow-sm'
                            : 'bg-[#EFE9DE] text-[#6C6A64]'
                        }`}
                      >
                        VISA
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black transition-all ${
                          detectedBrand === 'MASTERCARD'
                            ? 'bg-[#EB001B] text-white scale-105 shadow-sm'
                            : 'bg-[#EFE9DE] text-[#6C6A64]'
                        }`}
                      >
                        MC
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
                      placeholder={t.paymentCheckout?.cardNumberPlaceholder || '4000 1234 5678 9010'}
                      maxLength={23}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors"
                    />
                    <Lock className="w-3.5 h-3.5 text-[#6C6A64] absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1">
                      {t.paymentCheckout?.expiryLabel || 'تاريخ الانتهاء'}
                    </label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={expiry}
                      onChange={handleExpiryChange}
                      placeholder={t.paymentCheckout?.expiryPlaceholder || 'MM/YY'}
                      maxLength={5}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#141413] mb-1">
                      {t.paymentCheckout?.cvvLabel || 'رمز الأمان (CVV)'}
                    </label>
                    <input
                      type="password"
                      required
                      dir="ltr"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder={t.paymentCheckout?.cvvPlaceholder || '123'}
                      maxLength={4}
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors text-center"
                    />
                  </div>
                </div>

                {/* Postal Code (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-[#141413] mb-1">
                    {t.paymentCheckout?.postalCodeLabel || 'الرمز البريدي (اختياري)'}
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder={t.paymentCheckout?.postalCodePlaceholder || '12345'}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-[#E6DFD8] focus:border-[#CC785C] focus:outline-none transition-colors"
                  />
                </div>

                {/* Security Seal */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#6C6A64]">
                  <ShieldCheck className="w-4 h-4 text-[#5DB8A6] shrink-0" />
                  <span>
                    {t.paymentCheckout?.securityNotice ||
                      'معالجة مشفرة 256-Bit SSL بالكامل عبر بوابة PayPal العالمية المعتمدة.'}
                  </span>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing || isLoadingOrder}
                  className="w-full py-3 bg-[#CC785C] hover:bg-[#A9583E] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{t.paymentCheckout?.processingPayment || 'جاري معالجة وتأكيد الدفع عبر PayPal...'}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {t.paymentCheckout?.payWithCardBtn || 'إتمام الدفع الآمن بالبطاقة'}{' '}
                        {orderData && `($${orderData.amountUSD} USD)`}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 2: PAYPAL SMART BUTTONS */}
            {activeTab === 'paypal' && (
              <div className="space-y-4 py-2">
                <p className="text-xs text-[#6C6A64] leading-relaxed">
                  {t.paymentCheckout?.payPalButtonNotice ||
                    'سيتم توجيهك للمصادقة السريعة عبر نافذة PayPal الرسمية والمشفرة.'}
                </p>

                {/* PayPal Official Brand Button */}
                <button
                  type="button"
                  onClick={handleCapturePayPal}
                  disabled={isProcessing || isLoadingOrder}
                  className="w-full py-3.5 bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#003087]/30 border-t-[#003087] rounded-full animate-spin" />
                      <span className="text-xs font-bold">
                        {t.paymentCheckout?.processingPayment || 'جاري تأكيد الدفع عبر PayPal...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="italic font-extrabold text-base">Pay</span>
                      <span className="italic font-extrabold text-base text-[#0070BA]">Pal</span>
                      <span className="text-xs font-bold text-[#141413]">
                        {orderData && `— $${orderData.amountUSD} USD`}
                      </span>
                    </>
                  )}
                </button>

                {/* Debit or Credit Card secondary PayPal button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className="w-full py-3 bg-[#2C2E2F] hover:bg-black text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>دفع بواسطة بطاقة ائتمانية / Debit or Credit Card</span>
                </button>

                <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-[#6C6A64]">
                  <Lock className="w-3 h-3 text-[#5DB8A6]" />
                  <span>بوابة دفع معتمدة رسمياً ومحمية بحماية PayPal المتقدمة</span>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
