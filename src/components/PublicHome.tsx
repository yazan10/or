import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, useScroll, Html, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Facebook,
  MessageSquare,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Paper mesh with crease fold                                       */
/* ------------------------------------------------------------------ */
type PaperProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  title: string;
  subtitle: string;
  content: string;
  index: number;
  total: number;
  isOpen: boolean;
  isAr: boolean;
};

function FoldablePaper({
  position,
  rotation = [0, 0, 0],
  color,
  title,
  subtitle,
  content,
  index,
  total,
  isOpen,
  isAr,
}: PaperProps) {
  const group = useRef<THREE.Group>(null);
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);
  const scroll = useScroll();

  const paperWidth = 2.4;
  const paperHeight = 1.6;
  const halfW = paperWidth / 2;

  useFrame(() => {
    if (!group.current || !left.current || !right.current) return;

    const pageProgress = scroll.range(index / (total + 1), 1 / (total + 1));
    const openTarget = isOpen ? 1 : pageProgress;

    const fold = THREE.MathUtils.lerp(
      (left.current.rotation as any)._fold ?? 0,
      isOpen ? 0 : 0.85 - openTarget * 0.7,
      0.08
    );
    (left.current.rotation as any)._fold = fold;

    left.current.rotation.y = -fold * Math.PI * 0.45;
    right.current.rotation.y = fold * Math.PI * 0.45;

    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      position[1] + (isOpen ? 0.35 : 0),
      0.1
    );
    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      position[2] + (isOpen ? 0.6 : 0),
      0.1
    );
  });

  return (
    <group ref={group} position={position} rotation={rotation}>
      <mesh ref={left} position={[-halfW / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[halfW, paperHeight]} />
        <meshStandardMaterial color="#FAF9F5" roughness={0.75} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={right} position={[halfW / 2, 0, 0]} castShadow receiveShadow>
        <planeGeometry args={[halfW, paperHeight]} />
        <meshStandardMaterial color="#FAF9F5" roughness={0.75} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, paperHeight / 2 - 0.08, 0.01]}>
        <planeGeometry args={[paperWidth * 0.92, 0.06]} />
        <meshBasicMaterial color={color} />
      </mesh>

      <Html
        position={[0, 0.15, 0.02]}
        center
        distanceFactor={3.2}
        style={{ pointerEvents: 'none', width: '220px', textAlign: 'center' }}
      >
        <div style={{ color: '#141413', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ fontSize: '13px', fontWeight: 800, lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: '10px', color: '#6C6A64', marginTop: 4 }}>{subtitle}</div>
        </div>
      </Html>

      {isOpen && (
        <Html position={[0, -0.45, 0.05]} center distanceFactor={3.2} style={{ width: '240px' }}>
          <div
            style={{
              background: 'rgba(250,249,245,0.95)',
              borderRadius: 12,
              padding: '12px 14px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #E6DFD8',
              color: '#3D3D3A',
              fontSize: '11px',
              lineHeight: 1.55,
              fontFamily: 'system-ui, sans-serif',
              textAlign: isAr ? 'right' : 'left',
              direction: isAr ? 'rtl' : 'ltr',
            }}
          >
            {content}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  3D Scene                                                          */
/* ------------------------------------------------------------------ */
function Scene({
  papers,
  openId,
  setOpenId,
  isAr,
}: {
  papers: Array<{
    id: string;
    title: string;
    subtitle: string;
    content: string;
    color: string;
  }>;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  isAr: boolean;
}) {
  const scroll = useScroll();
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const offset = scroll.offset;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, Math.sin(offset * Math.PI * 1.2) * 0.8, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.8 - offset * 1.2, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 5.5 - offset * 0.8, 0.05);
    cameraTarget.current.set(0, 0.2 - offset * 0.4, 0);
    state.camera.lookAt(cameraTarget.current);
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={1.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, 2]} intensity={0.35} color="#CC785C" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#EFE9DE" roughness={0.9} />
      </mesh>

      {papers.map((p, i) => {
        const x = (i - (papers.length - 1) / 2) * 2.7;
        const z = -i * 0.15;
        const rotY = (i - (papers.length - 1) / 2) * 0.08;
        return (
          <group
            key={p.id}
            onClick={(e) => {
              e.stopPropagation();
              setOpenId(openId === p.id ? null : p.id);
            }}
          >
            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
              <FoldablePaper
                position={[x, 0.1, z]}
                rotation={[0, rotY, 0]}
                color={p.color}
                title={p.title}
                subtitle={p.subtitle}
                content={p.content}
                index={i}
                total={papers.length}
                isOpen={openId === p.id}
                isAr={isAr}
              />
            </Float>
          </group>
        );
      })}

      <Environment preset="city" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main PublicHome                                                   */
/* ------------------------------------------------------------------ */
export const PublicHome: React.FC = () => {
  const { lang, t, setCurrentView, user } = useApp();
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const [openId, setOpenId] = useState<string | null>(null);

  const papers = useMemo(
    () => [
      {
        id: 'audit',
        title: isAr ? 'التقرير التشخيصي' : 'Diagnostic Audit',
        subtitle: isAr ? 'درجة + SWOT + توصيات' : 'Score + SWOT + Recommendations',
        color: '#CC785C',
        content: isAr
          ? 'تقرير كامل بالأرقام: درجة أداء 0–100، تحليل SWOT، أفضل وأسوأ المنشورات، وتوصيات مرتبة. مبني على بيانات Meta الرسمية.'
          : 'Full numbered report: 0–100 score, SWOT, top & bottom posts, prioritized recommendations. Built on official Meta data.',
      },
      {
        id: 'plan',
        title: isAr ? 'خطة المحتوى 30 يوماً' : '30-Day Content Plan',
        subtitle: isAr ? 'يوم بيوم · جاهزة' : 'Day-by-day · Ready',
        color: '#5DB8A6',
        content: isAr
          ? 'جدول يومي: نوع المحتوى، الهدف، الـ Hook، السيناريو، الـ CTA والـ Caption. قابل للتصدير CSV.'
          : 'Daily calendar: content type, goal, hook, script, CTA and caption. Exportable as CSV.',
      },
      {
        id: 'wallet',
        title: isAr ? 'محفظة مزدوجة' : 'Dual Wallet',
        subtitle: isAr ? 'Instagram و Facebook' : 'Instagram & Facebook',
        color: '#1877F2',
        content: isAr
          ? 'رصيد مستقل لكل منصة. المحاولات لا تنتهي. كل محاولة تشمل التقرير + الخطة + متابعة + دردشة.'
          : 'Independent balance per platform. Credits never expire. Every trial includes report + plan + follow-up + chat.',
      },
      {
        id: 'meta',
        title: isAr ? 'ربط Meta الرسمي' : 'Official Meta Connect',
        subtitle: isAr ? 'OAuth آمن' : 'Secure OAuth',
        color: '#E8A55A',
        content: isAr
          ? 'ربط عبر Meta OAuth فقط. صلاحيات قراءة. لا نطلب كلمة المرور ولا نقرأ الرسائل. افصل في أي وقت.'
          : 'Meta OAuth only. Read-only permissions. We never ask for passwords or read DMs. Disconnect anytime.',
      },
    ],
    [isAr]
  );

  return (
    <div className="relative w-full" style={{ height: '320vh' }}>
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          shadows
          camera={{ position: [0, 1.8, 5.5], fov: 42, near: 0.1, far: 50 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'linear-gradient(180deg, #FAF9F5 0%, #EFE9DE 100%)' }}
        >
          <Suspense fallback={null}>
            <ScrollControls pages={3.2} damping={0.18}>
              <Scene papers={papers} openId={openId} setOpenId={setOpenId} isAr={isAr} />

              <Scroll html style={{ width: '100%' }}>
                <section
                  style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingTop: '12vh',
                    pointerEvents: 'none',
                  }}
                >
                  <div
                    style={{
                      maxWidth: 720,
                      textAlign: 'center',
                      padding: '0 24px',
                      pointerEvents: 'auto',
                    }}
                  >
                    <p
                      className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#CC785C] uppercase mb-4"
                      style={{ marginBottom: 16 }}
                    >
                      {t.hero.kicker}
                    </p>
                    <h1
                      className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#141413] tracking-tight leading-[1.15]"
                      style={{ marginBottom: 20 }}
                    >
                      {t.hero.title}
                    </h1>
                    <p className="text-base sm:text-lg text-[#6C6A64] max-w-2xl mx-auto leading-relaxed" style={{ marginBottom: 28 }}>
                      {t.hero.description}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3" style={{ pointerEvents: 'auto' }}>
                      <button
                        onClick={() => (user ? setCurrentView('dashboard') : setCurrentView('auth'))}
                        className="px-8 py-3.5 text-sm font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-md transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>{t.hero.primaryCta}</span>
                        <ArrowIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#6C6A64]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#5DB8A6]" />
                        <span>{t.hero.badgeOfficial}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#CC785C]" />
                        <span>{t.hero.badgeNoScraping}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-[#5DB8A6]" />
                        <span>{t.hero.badgeCreditsNeverExpire}</span>
                      </div>
                    </div>
                  </div>

                  <p className="absolute bottom-10 left-0 right-0 text-center text-xs text-[#A09C94] animate-pulse">
                    {isAr ? '↓ اسحب للأسفل · اضغط على الورقة لتفردها' : '↓ Scroll · Click a paper to flatten it'}
                  </p>
                </section>

                <section style={{ height: '100vh', pointerEvents: 'none' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '12%',
                      left: 0,
                      right: 0,
                      textAlign: 'center',
                      pointerEvents: 'auto',
                    }}
                  >
                    <p className="text-xs font-bold tracking-widest text-[#CC785C] uppercase mb-2">
                      {isAr ? 'الأوراق' : 'The Papers'}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
                      {isAr ? 'اضغط على أي ورقة لتفردها' : 'Press any paper to flatten it'}
                    </h2>
                  </div>
                </section>

                <section
                  style={{
                    height: '120vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 24px',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ maxWidth: 900, width: '100%', pointerEvents: 'auto' }}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                      {[
                        {
                          icon: <Instagram className="w-5 h-5 text-[#CC785C]" />,
                          title: 'Instagram',
                          desc: isAr ? '3 محاولات بـ 12 شيقل · ثم 10 بـ 8' : '3 trials for 12 ILS · then 10 for 8',
                        },
                        {
                          icon: <Facebook className="w-5 h-5 text-[#1877F2]" />,
                          title: 'Facebook',
                          desc: isAr ? '3 محاولات بـ 15 شيقل · ثم 10 بـ 10' : '3 trials for 15 ILS · then 10 for 10',
                        },
                        {
                          icon: <MessageSquare className="w-5 h-5 text-[#5DB8A6]" />,
                          title: isAr ? 'مشمول مجاناً' : 'Included free',
                          desc: isAr ? 'سؤال متابعة + دردشة استشارية' : 'Follow-up + advisory chat',
                        },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="p-5 rounded-2xl bg-[#FAF9F5]/95 border border-[#E6DFD8] flex items-start gap-3 shadow-sm backdrop-blur"
                        >
                          <div className="mt-0.5">{item.icon}</div>
                          <div>
                            <p className="text-sm font-bold text-[#141413]">{item.title}</p>
                            <p className="text-xs text-[#6C6A64] mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center space-y-5">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#141413]">
                        {isAr ? 'جاهز لفهم حسابك بعمق؟' : 'Ready to understand your account deeply?'}
                      </h2>
                      <p className="text-sm text-[#6C6A64] max-w-md mx-auto">
                        {isAr
                          ? 'اربط حسابك عبر Meta، اختر المنصة، وابدأ أول تحليل خلال دقائق.'
                          : 'Connect via Meta, choose the platform, and run your first analysis in minutes.'}
                      </p>
                      <button
                        onClick={() => (user ? setCurrentView('dashboard') : setCurrentView('auth'))}
                        className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold rounded-xl bg-[#CC785C] hover:bg-[#A9583E] text-white shadow-md transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{t.hero.primaryCta}</span>
                      </button>
                    </div>
                  </div>
                </section>
              </Scroll>
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};
