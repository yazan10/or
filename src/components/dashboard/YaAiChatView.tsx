import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { safeFetchJson } from '../../utils/safeFetch';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Zap,
  Flame,
  ArrowRight,
  ArrowLeft,
  Share2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface YaAiMessage {
  id: string;
  sender: 'user' | 'ya-ai';
  text: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export const YaAiChatView: React.FC = () => {
  const { user, lang, showToast } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [messages, setMessages] = useState<YaAiMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const starterPrompts = isAr
    ? [
        { icon: <Flame className="w-3.5 h-3.5 text-[#CC785C]" />, text: 'أعطني 5 افتتاحيات (Hooks) خاطفة لـ Reel في أول 3 ثوانٍ' },
        { icon: <Sparkles className="w-3.5 h-3.5 text-[#5DB8A6]" />, text: 'كيف أصمم Carousel تعليمي يحقق أعلى نسبة حفظ (Saves) ومشاركة؟' },
        { icon: <Zap className="w-3.5 h-3.5 text-[#E8A55A]" />, text: 'ما هو التوقيت الذهبي لنشر المحتوى هذا الأسبوع لزيادة الوصول العضوي؟' },
        { icon: <Lightbulb className="w-3.5 h-3.5 text-[#1877F2]" />, text: 'اكتب لي سيناريو فيديو مدته 25 ثانية يبيع منتجي دون أن يبدو كإعلان ممل' },
      ]
    : [
        { icon: <Flame className="w-3.5 h-3.5 text-[#CC785C]" />, text: 'Give me 5 scroll-stopping hooks for a Reel in the first 3 seconds' },
        { icon: <Sparkles className="w-3.5 h-3.5 text-[#5DB8A6]" />, text: 'How do I structure an educational Carousel for peak bookmark retention?' },
        { icon: <Zap className="w-3.5 h-3.5 text-[#E8A55A]" />, text: 'What is the peak posting window this week to maximize organic reach?' },
        { icon: <Lightbulb className="w-3.5 h-3.5 text-[#1877F2]" />, text: 'Write a 25-second video script that sells without feeling like a boring ad' },
      ];

  // Fetch initial message history
  useEffect(() => {
    fetchMessages();
  }, [user]);

  // Auto-scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchMessages = async () => {
    try {
      const { ok, data } = await safeFetchJson(`/api/ya-ai/messages?userId=${user?.id || 'user_1'}&lang=${lang}`);
      if (ok && data) {
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.warn('Error fetching YA ai messages:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isLoading) return;

    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    // Optimistically append user message
    const tempUserMsg: YaAiMessage = {
      id: `temp_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const { ok, data, error } = await safeFetchJson('/api/ya-ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'user_1',
          message: prompt,
          lang,
        }),
      });

      if (!ok || !data) {
        throw new Error(error || data?.error || 'YA ai response error');
      }

      setMessages(data.messages || []);
    } catch (err: any) {
      showToast(err.message || 'Error communicating with YA ai', 'error');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = async () => {
    try {
      await safeFetchJson('/api/ya-ai/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'user_1' }),
      });
      fetchMessages();
      showToast(isAr ? 'تم بدء جلسة محادثة جديدة مع YA ai' : 'Started fresh chat session with YA ai', 'info');
    } catch (e) {
      console.warn('Clear chat error:', e);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast(isAr ? 'تم نسخ نص الإجابة بنجاح!' : 'Response copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const renderFormattedText = (content: string) => {
    // Clean bullet formatting and bold tags
    return content.split('\n').map((paragraph, idx) => {
      if (!paragraph.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Check if numbered or bulleted list
      const isListItem = /^[•\-*]|\d+\./.test(paragraph.trim());

      return (
        <p
          key={idx}
          className={`leading-relaxed ${
            isListItem ? 'pl-2 rtl:pl-0 rtl:pr-2 text-[#3D3D3A] my-1 font-medium' : 'my-1.5'
          }`}
        >
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="bg-[#FAF9F5] border border-[#E6DFD8] rounded-3xl overflow-hidden shadow-sm flex flex-col h-[780px] max-h-[82vh] transition-all">
      {/* Top Header Bar for YA ai */}
      <div className="bg-gradient-to-r from-[#181715] via-[#252320] to-[#181715] text-[#FAF9F5] p-4 sm:p-5 border-b border-[#35322D] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* Holographic Glowing Avatar */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#CC785C] via-[#E8A55A] to-[#5DB8A6] p-[2px] shadow-lg">
            <div className="w-full h-full bg-[#181715] rounded-[14px] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-[#E8A55A] animate-pulse" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#5DB8A6] border-2 border-[#181715]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-[#FAF9F5]">
                YA <span className="text-[#CC785C]">ai</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#CC785C]/20 border border-[#CC785C]/40 text-[#CC785C]">
                Neural Model v3.8
              </span>
            </div>
            <p className="text-[11px] text-[#A09C94] leading-tight">
              {isAr
                ? 'مستشارك الاستراتيجي الذكي لنمو خوارزميات Instagram & Facebook'
                : 'Elite AI Marketing & Organic Growth Engine'}
            </p>
          </div>
        </div>

        {/* Status badges & Actions */}
        <div className="flex items-center gap-2 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#252320] border border-[#35322D] text-[11px] text-[#A09C94]">
            <Zap className="w-3 h-3 text-[#5DB8A6]" />
            <span>24ms Latency</span>
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl text-[#A09C94] hover:text-[#FAF9F5] hover:bg-[#35322D] transition-colors cursor-pointer"
            title={isAr ? 'بدء محادثة جديدة' : 'Clear conversation'}
          >
            <RotateCwIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 select-text bg-[#FAF9F5]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`flex gap-3 max-w-3xl ${
                  isUser ? 'ml-auto rtl:ml-0 rtl:mr-auto justify-end' : 'mr-auto rtl:mr-0 rtl:ml-auto justify-start'
                }`}
              >
                {/* Bot Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#CC785C] to-[#E8A55A] flex items-center justify-center text-white shrink-0 shadow-xs mt-1 animate-badge-sparkle">
                    <span className="text-[10px] font-black">YA</span>
                  </div>
                )}

                {/* Message Content Bubble */}
                <div
                  className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm shadow-sm transition-all relative group ${
                    isUser
                      ? 'bg-[#181715] text-[#FAF9F5] rounded-tr-none rtl:rounded-tr-2xl rtl:rounded-tl-none'
                      : 'bg-white border border-[#E6DFD8] text-[#141413] rounded-tl-none rtl:rounded-tl-2xl rtl:rounded-tr-none hover:shadow-md'
                  }`}
                >
                  {/* Header info */}
                  <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] text-[#A09C94]">
                    <span className="font-bold">
                      {isUser ? (user?.name || (isAr ? 'أنت' : 'You')) : 'YA ai Model'}
                    </span>
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Body Text */}
                  <div className="whitespace-pre-line leading-relaxed">
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* Assistant Footer Actions (Copy + Suggested follow ups) */}
                  {!isUser && (
                    <div className="pt-3 mt-3 border-t border-[#E6DFD8]/80 flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="text-[11px] font-medium text-[#6C6A64] hover:text-[#CC785C] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#5DB8A6]" />
                            <span className="text-[#5DB8A6]">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isAr ? 'نسخ الإجابة' : 'Copy answer'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Suggested follow-up prompt chips */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-3 mt-2 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((promptText, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.03, y: -1 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSendMessage(promptText)}
                          className="px-2.5 py-1 text-[11px] rounded-lg bg-[#EFE9DE]/80 hover:bg-[#E8E0D2] border border-[#E6DFD8] text-[#3D3D3A] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-[#CC785C]" />
                          <span>{promptText}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#EFE9DE] border border-[#E6DFD8] flex items-center justify-center overflow-hidden shrink-0 mt-1">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-[#6C6A64]" />
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center text-xs text-[#6C6A64] animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#CC785C] to-[#E8A55A] flex items-center justify-center text-white shrink-0">
              <span className="text-[10px] font-black">YA</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-[#E6DFD8] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#CC785C] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#E8A55A] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#5DB8A6] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium text-[#6C6A64] mr-2 rtl:mr-0 rtl:ml-2">
                {isAr ? 'YA ai يحلل استراتيجية حسابك ويصيغ الرد...' : 'YA ai is generating strategic roadmap...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar (when empty or at start) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t border-[#E6DFD8] bg-white/70 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold text-[#A09C94] uppercase whitespace-nowrap">
            {isAr ? 'اقتراحات سريعة:' : 'Quick Prompts:'}
          </span>
          {starterPrompts.map((p, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSendMessage(p.text)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#FAF9F5] hover:bg-[#EFE9DE] border border-[#E6DFD8] text-[#3D3D3A] flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              {p.icon}
              <span>{p.text}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Input Bar Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#E6DFD8] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-end gap-2 bg-[#FAF9F5] border border-[#E6DFD8] focus-within:border-[#CC785C] focus-within:ring-2 focus-within:ring-[#CC785C]/20 rounded-2xl p-2 transition-all shadow-xs"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isAr
                ? 'اسأل YA ai عن أفكار المحتوى، صياغة Hooks، أو تحسين التفاعل... (اضغط Enter للإرسال)'
                : 'Ask YA ai for content concepts, hook scripts, or algorithm growth tactics... (Enter to send)'
            }
            className="flex-1 p-2 text-xs sm:text-sm bg-transparent border-0 focus:outline-none resize-none max-h-28 text-[#141413] placeholder-[#A09C94]"
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#CC785C] to-[#A9583E] hover:from-[#A9583E] hover:to-[#924732] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 btn-shimmer"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>{isAr ? 'إرسال' : 'Send'}</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-[#A09C94] px-1 pt-1.5">
          <span>{isAr ? 'موديل YA ai مدعوم بـ Gemini 3.8 Flash مع تحسينات تسويقية حصرية' : 'Powered by Gemini 3.8 Flash with specialized social marketing weights'}</span>
          <span className="hidden sm:inline">Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

const RotateCwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);
