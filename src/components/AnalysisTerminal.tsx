import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Terminal as TerminalIcon,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  Copy,
  Check,
  Maximize2,
} from 'lucide-react';

interface TerminalLine {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'api' | 'ai' | 'code';
  prefix: string;
  text: string;
  highlight?: string;
}

export const AnalysisTerminal: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [activePlatform, setActivePlatform] = useState<'instagram' | 'facebook'>('instagram');
  const [isRunning, setIsRunning] = useState(true);
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typedChars, setTypedChars] = useState('');
  const [copied, setCopied] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);

  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Script sequences for Instagram and Facebook
  const getScriptSequence = (platform: 'instagram' | 'facebook'): TerminalLine[] => {
    const isIg = platform === 'instagram';
    const now = () => new Date().toISOString().substring(11, 23);

    return isIg
      ? [
          {
            id: 'ig_1',
            timestamp: now(),
            type: 'api',
            prefix: '[META GRAPH API]',
            text: 'CONNECT https://graph.facebook.com/v19.0/me/accounts?fields=instagram_business_account',
            highlight: '200 OK',
          },
          {
            id: 'ig_2',
            timestamp: now(),
            type: 'info',
            prefix: '[AUTH VERIFY]',
            text: 'Token type: Page Access Token · Permissions: [instagram_basic, instagram_manage_insights]',
          },
          {
            id: 'ig_3',
            timestamp: now(),
            type: 'api',
            prefix: '[FETCH MEDIA]',
            text: 'GET /v19.0/17841405322987123/media?fields=id,media_type,like_count,comments_count,shares,saved,reach',
          },
          {
            id: 'ig_4',
            timestamp: now(),
            type: 'info',
            prefix: '[INGESTION]',
            text: 'Ingesting 30-day timeline nodes: 18 Reels, 12 Carousels, 6 Static Posts (Total: 36 objects)',
          },
          {
            id: 'ig_5',
            timestamp: now(),
            type: 'code',
            prefix: '[MATH ENGINE]',
            text: 'const NetER = ((Total_Likes + Total_Comments + Total_Saves + Total_Shares) / Total_Reach) * 100;',
          },
          {
            id: 'ig_6',
            timestamp: now(),
            type: 'success',
            prefix: '[METRICS COMPUTED]',
            text: 'Net Engagement Rate: 4.82% (Industry benchmark: 3.10% · Performance Index: +55.4%)',
          },
          {
            id: 'ig_7',
            timestamp: now(),
            type: 'warn',
            prefix: '[ANOMALY DETECTED]',
            text: 'Reel drop-off spike at 00:03.2s · Slide completion on 5-step Carousels: 88.4% (Highest retention)',
          },
          {
            id: 'ig_8',
            timestamp: now(),
            type: 'ai',
            prefix: '[GEMINI 3.8 FLASH]',
            text: 'POST /v1beta/models/gemini-3.8-flash:generateContent (payload: SWOT matrix & 30-day editorial planner)',
          },
          {
            id: 'ig_9',
            timestamp: now(),
            type: 'ai',
            prefix: '[REASONING]',
            text: 'Generating structured SWOT: [3 Strengths, 3 Weaknesses, 3 Opportunities, 3 Algorithmic Risks]',
          },
          {
            id: 'ig_10',
            timestamp: now(),
            type: 'code',
            prefix: '[JSON PARSER]',
            text: '{ "performanceScore": 78, "optimalCadence": "4-5x weekly", "highUtilityRetention": true }',
          },
          {
            id: 'ig_11',
            timestamp: now(),
            type: 'ai',
            prefix: '[CONTENT PLANNER]',
            text: 'Synthesizing 30 daily actionable items: Hooks, slide scripts, captions, and CTA variations...',
          },
          {
            id: 'ig_12',
            timestamp: now(),
            type: 'success',
            prefix: '[PIPELINE COMPLETE]',
            text: '✓ Diagnostic Report & 30-Day Content Roadmap generated successfully in 1,280ms',
          },
        ]
      : [
          {
            id: 'fb_1',
            timestamp: now(),
            type: 'api',
            prefix: '[META GRAPH API]',
            text: 'CONNECT https://graph.facebook.com/v19.0/109845728493012/insights?metric=page_impressions_unique',
            highlight: '200 OK',
          },
          {
            id: 'fb_2',
            timestamp: now(),
            type: 'info',
            prefix: '[AUTH VERIFY]',
            text: 'Facebook Page Verified: "Modern Tech Labs" · Scope: [pages_read_engagement, pages_show_list]',
          },
          {
            id: 'fb_3',
            timestamp: now(),
            type: 'api',
            prefix: '[FETCH POSTS]',
            text: 'GET /v19.0/109845728493012/feed?fields=message,created_time,shares,comments.summary(true),reactions',
          },
          {
            id: 'fb_4',
            timestamp: now(),
            type: 'info',
            prefix: '[INGESTION]',
            text: 'Parsed 22 Facebook Page posts in last 30 days: 42,100 net impressions ingested',
          },
          {
            id: 'fb_5',
            timestamp: now(),
            type: 'code',
            prefix: '[ENGAGEMENT INDEX]',
            text: 'calculateEngagementIndex({ totalReach: 28900, commentsRatio: 0.18, clickThroughRate: 2.45 });',
          },
          {
            id: 'fb_6',
            timestamp: now(),
            type: 'success',
            prefix: '[METRICS COMPUTED]',
            text: 'Composite Page Score: 72/100 · High discussion density on long-form tech editorial breakdowns',
          },
          {
            id: 'fb_7',
            timestamp: now(),
            type: 'ai',
            prefix: '[GEMINI 3.8 FLASH]',
            text: 'Grounded inference initiated with zero false promises. Modeling 3 realistic growth scenarios...',
          },
          {
            id: 'fb_8',
            timestamp: now(),
            type: 'code',
            prefix: '[SCENARIOS]',
            text: 'Scenarios: [Conservative: +150-300 | Moderate: +450-800 | Optimistic: +1.1k-2.0k]',
          },
          {
            id: 'fb_9',
            timestamp: now(),
            type: 'ai',
            prefix: '[CONTENT PLANNER]',
            text: 'Building 30-day interactive calendar: morning discussions, video hooks, and referral polls...',
          },
          {
            id: 'fb_10',
            timestamp: now(),
            type: 'success',
            prefix: '[PIPELINE COMPLETE]',
            text: '✓ Facebook Marketing Intelligence matrix synthesized ready for export (CSV / PDF)',
          },
        ];
  };

  const script = getScriptSequence(activePlatform);

  // Line advancement and typing logic
  useEffect(() => {
    if (!isRunning) return;

    if (currentLineIndex >= script.length) {
      // Loop after short pause
      const loopTimeout = setTimeout(() => {
        setVisibleLines([]);
        setCurrentLineIndex(0);
        setTypedChars('');
      }, 4000);
      return () => clearTimeout(loopTimeout);
    }

    const targetLine = script[currentLineIndex];
    let charIdx = 0;
    const typingIntervalTime = (speed === 2 ? 8 : 18);

    const typingTimer = setInterval(() => {
      charIdx++;
      if (charIdx <= targetLine.text.length) {
        setTypedChars(targetLine.text.substring(0, charIdx));
      } else {
        clearInterval(typingTimer);
        setVisibleLines((prev) => [...prev, targetLine]);
        setTypedChars('');
        setCurrentLineIndex((prev) => prev + 1);
      }
    }, typingIntervalTime);

    return () => clearInterval(typingTimer);
  }, [currentLineIndex, isRunning, activePlatform, speed]);

  // Auto scroll terminal to bottom as lines appear
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [visibleLines, typedChars]);

  const handleRestart = () => {
    setVisibleLines([]);
    setCurrentLineIndex(0);
    setTypedChars('');
    setIsRunning(true);
  };

  const handleCopyLogs = () => {
    const textToCopy = visibleLines.map((l) => `${l.timestamp} ${l.prefix} ${l.text}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const activeLineObj = script[currentLineIndex];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[#35322D] bg-[#181715] shadow-2xl text-[#FAF9F5] transition-all">
      {/* Terminal Title Bar (macOS Window Chrome) */}
      <div className="bg-[#252320] px-4 py-3 border-b border-[#35322D] flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: Window Control Dots */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 inline-block shadow-xs" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 inline-block shadow-xs" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 inline-block shadow-xs" />

          <div className="flex items-center gap-1.5 ml-2 rtl:ml-0 rtl:mr-2 text-xs font-mono text-[#A09C94]">
            <TerminalIcon className="w-3.5 h-3.5 text-[#CC785C]" />
            <span className="font-semibold text-[#FAF9F5]">orvex-engine</span>
            <span className="text-[#6C6A64]">v3.8-flash</span>
          </div>
        </div>

        {/* Center: Platform Mode Selector */}
        <div className="flex items-center gap-1 bg-[#181715] p-1 rounded-xl border border-[#35322D] text-[11px] font-mono">
          <button
            onClick={() => {
              setActivePlatform('instagram');
              handleRestart();
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePlatform === 'instagram'
                ? 'bg-[#CC785C] text-white font-bold'
                : 'text-[#A09C94] hover:text-white'
            }`}
          >
            <span>Instagram</span>
          </button>
          <button
            onClick={() => {
              setActivePlatform('facebook');
              handleRestart();
            }}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activePlatform === 'facebook'
                ? 'bg-[#1877F2] text-white font-bold'
                : 'text-[#A09C94] hover:text-white'
            }`}
          >
            <span>Facebook</span>
          </button>
        </div>

        {/* Right: Controls (Play/Pause, Speed, Copy) */}
        <div className="flex items-center gap-1.5 text-xs text-[#A09C94]">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 rounded-lg hover:bg-[#35322D] text-[#FAF9F5] transition-colors cursor-pointer"
            title={isRunning ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'استئناف' : 'Play')}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#5DB8A6]" />}
          </button>

          <button
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="px-2 py-1 rounded-lg hover:bg-[#35322D] text-[#FAF9F5] text-[10px] font-mono font-bold transition-colors cursor-pointer"
            title={isAr ? 'سرعة المحاكاة' : 'Simulation Speed'}
          >
            {speed}x
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg hover:bg-[#35322D] text-[#FAF9F5] transition-colors cursor-pointer"
            title={isAr ? 'إعادة تشغيل المحاكاة' : 'Restart Simulation'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopyLogs}
            className="p-1.5 rounded-lg hover:bg-[#35322D] text-[#FAF9F5] transition-colors cursor-pointer"
            title={isAr ? 'نسخ السجل' : 'Copy Output'}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#5DB8A6]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Viewport (Scrolling downward lines with syntax colors) */}
      <div
        ref={terminalScrollRef}
        className="p-4 sm:p-6 font-mono text-[11px] sm:text-xs leading-relaxed h-72 sm:h-80 overflow-y-auto space-y-2 select-text"
        dir="ltr"
      >
        {/* Banner header inside terminal */}
        <div className="text-[#6C6A64] pb-2 border-b border-[#35322D]/60 flex items-center justify-between text-[10px]">
          <span>ORVEX AI Autonomous Marketing Intelligence Shell [Session: RT-Live]</span>
          <span className="flex items-center gap-1.5 text-[#5DB8A6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5DB8A6] animate-pulse" />
            STREAMING
          </span>
        </div>

        {/* Existing Lines */}
        {visibleLines.map((line) => (
          <div key={line.id} className="flex items-start gap-2.5 animate-fade-in group">
            <span className="text-[#6C6A64] text-[10px] select-none shrink-0 pt-0.5">
              {line.timestamp}
            </span>

            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded select-none shrink-0 ${
                line.type === 'api'
                  ? 'bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30'
                  : line.type === 'ai'
                  ? 'bg-[#CC785C]/20 text-[#CC785C] border border-[#CC785C]/30'
                  : line.type === 'success'
                  ? 'bg-[#5DB8A6]/20 text-[#5DB8A6] border border-[#5DB8A6]/30'
                  : line.type === 'warn'
                  ? 'bg-[#E8A55A]/20 text-[#E8A55A] border border-[#E8A55A]/30'
                  : line.type === 'code'
                  ? 'bg-[#A09C94]/20 text-[#E8E0D2] border border-[#A09C94]/30'
                  : 'bg-[#252320] text-[#A09C94]'
              }`}
            >
              {line.prefix}
            </span>

            <span
              className={`flex-1 break-all ${
                line.type === 'success'
                  ? 'text-[#5DB8A6] font-semibold'
                  : line.type === 'warn'
                  ? 'text-[#E8A55A]'
                  : line.type === 'ai'
                  ? 'text-[#FAF9F5]'
                  : line.type === 'code'
                  ? 'text-[#E8E0D2] font-mono'
                  : 'text-[#A09C94]'
              }`}
            >
              {line.text}
              {line.highlight && (
                <span className="ml-2 px-1.5 py-0.2 rounded bg-[#5DB8A6]/30 text-[#5DB8A6] font-bold text-[10px]">
                  {line.highlight}
                </span>
              )}
            </span>
          </div>
        ))}

        {/* Actively Typing Line */}
        {activeLineObj && (
          <div className="flex items-start gap-2.5 pt-1">
            <span className="text-[#6C6A64] text-[10px] select-none shrink-0 pt-0.5">
              {activeLineObj.timestamp}
            </span>

            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded select-none shrink-0 ${
                activeLineObj.type === 'api'
                  ? 'bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30'
                  : activeLineObj.type === 'ai'
                  ? 'bg-[#CC785C]/20 text-[#CC785C] border border-[#CC785C]/30'
                  : activeLineObj.type === 'success'
                  ? 'bg-[#5DB8A6]/20 text-[#5DB8A6] border border-[#5DB8A6]/30'
                  : activeLineObj.type === 'warn'
                  ? 'bg-[#E8A55A]/20 text-[#E8A55A] border border-[#E8A55A]/30'
                  : 'bg-[#252320] text-[#A09C94]'
              }`}
            >
              {activeLineObj.prefix}
            </span>

            <span className="flex-1 text-[#FAF9F5] break-all">
              {typedChars}
              <span className="inline-block w-2 h-3.5 bg-[#CC785C] ml-1 animate-pulse align-middle" />
            </span>
          </div>
        )}

        {/* Finished notice */}
        {currentLineIndex >= script.length && (
          <div className="pt-2 text-[10px] text-[#5DB8A6] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Analysis Cycle Complete. Awaiting next periodic trigger...</span>
          </div>
        )}
      </div>

      {/* Terminal Footer Metrics Bar */}
      <div className="bg-[#252320] px-4 py-2.5 border-t border-[#35322D] flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#A09C94]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#5DB8A6]" />
            <span className="text-[#FAF9F5] font-bold">Engine:</span>
            <span>Gemini 3.8 Flash</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#CC785C]" />
            <span>Target:</span>
            <span className="text-[#FAF9F5] font-bold capitalize">{activePlatform}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#6C6A64]">
            Latency: <strong className="text-[#5DB8A6]">24ms</strong>
          </span>
          <span className="text-[#6C6A64]">
            Precision: <strong className="text-[#FAF9F5]">100% Deterministic</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
