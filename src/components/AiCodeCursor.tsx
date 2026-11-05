import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const AiCodeCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState<'IDLE' | 'EXECUTE' | 'INPUT' | 'AI' | 'SELECT'>('IDLE');
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const coordsRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse/trackpad), never on touch devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      coordsRef.current.targetX = e.clientX;
      coordsRef.current.targetY = e.clientY;
      setCoords({ x: e.clientX, y: e.clientY });

      // Determine interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest('button, a, input, textarea, select, [role="button"], .cursor-pointer, [data-cursor]')
        );

        const isInputElem = Boolean(target.closest('input, textarea, select'));

        if (isInputElem) {
          setIsPointer(true);
          setCursorText('INPUT');
        } else if (target.closest('[data-cursor="ai"]')) {
          setIsPointer(true);
          setCursorText('AI');
        } else if (isClickable) {
          setIsPointer(true);
          setCursorText('EXECUTE');
        } else {
          setIsPointer(false);
          setCursorText('IDLE');
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 700);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth interpolated RAF loop for trailing reticle
    const updateFollower = () => {
      const cur = coordsRef.current;
      // Smooth lerp
      cur.x += (cur.targetX - cur.x) * 0.22;
      cur.y += (cur.targetY - cur.y) * 0.22;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cur.targetX}px, ${cur.targetY}px, 0)`;
      }
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(updateFollower);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId.current = requestAnimationFrame(updateFollower);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Click binary shockwave ripples */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0.3, opacity: 0.9 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#CC785C] shadow-[0_0_15px_#CC785C]"
          style={{ left: ripple.x, top: ripple.y, width: 44, height: 44 }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono text-[#CC785C] opacity-60">
            &lt;/&gt;
          </div>
        </motion.div>
      ))}

      {/* Main Sharp Core Dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 will-change-transform"
      >
        <div
          className={`rounded-full transition-all duration-200 ${
            isClicking
              ? 'w-2 h-2 bg-[#FAF9F5] shadow-[0_0_12px_#CC785C] scale-75'
              : isPointer
              ? 'w-2.5 h-2.5 bg-[#5DB8A6] shadow-[0_0_10px_#5DB8A6] scale-125'
              : 'w-2 h-2 bg-[#CC785C] shadow-[0_0_8px_#CC785C]'
          }`}
        />
      </div>

      {/* Trailing Cybernetic Reticle HUD with AI & Programming Code Brackets */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div
          className={`relative flex items-center justify-center transition-all duration-300 ${
            isPointer ? 'w-12 h-12' : 'w-9 h-9'
          }`}
        >
          {/* Outer rotating cybernetic brackets */}
          <div
            className={`absolute inset-0 rounded-full border border-dashed transition-all duration-300 ${
              isPointer
                ? 'border-[#5DB8A6] rotate-45 scale-110 shadow-[0_0_14px_rgba(93,184,166,0.35)]'
                : 'border-[#CC785C]/50 rotate-0 scale-100 shadow-[0_0_8px_rgba(204,120,92,0.2)]'
            }`}
          />

          {/* Holographic Programming Corner Crosshairs */}
          {isPointer && (
            <div className="absolute inset-0 pointer-events-none animate-spin-slow">
              <span className="absolute top-0 left-0 text-[8px] font-mono text-[#5DB8A6] leading-none">┌</span>
              <span className="absolute top-0 right-0 text-[8px] font-mono text-[#5DB8A6] leading-none">┐</span>
              <span className="absolute bottom-0 left-0 text-[8px] font-mono text-[#5DB8A6] leading-none">└</span>
              <span className="absolute bottom-0 right-0 text-[8px] font-mono text-[#5DB8A6] leading-none">┘</span>
            </div>
          )}

          {/* Floating Code Glyph Brackets */}
          <div
            className={`flex items-center justify-between w-full px-1 text-[10px] font-mono font-bold select-none transition-colors duration-200 ${
              isPointer ? 'text-[#5DB8A6]' : 'text-[#CC785C]/70'
            }`}
          >
            <span className="transform -translate-x-1">{isPointer ? '⟨' : '<'}</span>
            <span className="transform translate-x-1">{isPointer ? '⟩' : '/>'}</span>
          </div>

          {/* Mini Live AI Terminal Tag & Coordinates */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap select-none bg-[#181715]/90 px-1.5 py-0.5 rounded border border-[#35322D] shadow-sm backdrop-blur-xs">
            <span
              className={`w-1.5 h-1.5 rounded-full animate-ping ${
                isPointer ? 'bg-[#5DB8A6]' : 'bg-[#CC785C]'
              }`}
            />
            <span className="text-[8px] font-mono font-extrabold text-[#FAF9F5] tracking-widest uppercase">
              {isPointer ? cursorText : 'YA.AI'}
            </span>
            <span className="text-[7px] font-mono text-[#A09C94] opacity-80">
              {coords.x.toString().padStart(3, '0')}:{coords.y.toString().padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
