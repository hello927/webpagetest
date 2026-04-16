"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useScroll, useSpring } from 'framer-motion';

const FRAME_COUNT = 199;

/* ── 챕터 데이터 ── 
   range: [fadeIn시작, fadeIn완료, fadeOut시작, fadeOut완료]
   스크롤 진행도(0~1) 기준 */
const chapters = [
  {
    tag: 'THE TIMELESS ICON',
    heading: ['Eternal', 'Maknae.'],
    body: '그룹 신화의 영원한 막내, 이선호.\n시간이 흘러도 변치 않는 단정하고 훈훈한 매력.',
    range: [0.02, 0.07, 0.16, 0.22],
  },
  {
    tag: 'GENTLE & MATURE',
    heading: ['Sweetest', 'Aura.'],
    body: '신사다운 다정함과 어른스러움의 공존.\n가장 따뜻한 배려심으로 팀의 중심을 잡아주는 존재.',
    range: [0.24, 0.29, 0.40, 0.46],
  },
  {
    tag: 'RHYTHM & FLOW',
    heading: ['Perfect', 'Balance.'],
    body: '군더더기 없는 깔끔한 춤선과\n곡의 무게를 잡아주는 매력적인 로우톤 래핑.',
    range: [0.48, 0.53, 0.64, 0.70],
  },
  {
    tag: 'BEYOND THE STAGE',
    heading: ['Visionary', 'Producer.'],
    body: '스테이지 위의 아티스트를 넘어.\n탁월한 안목으로 새로운 비전을 제시하는 제작자로서의 도약.',
    range: [0.72, 0.77, 0.85, 0.90],
  },
];

/* ── 헬퍼: 스크롤 진행도로부터 opacity 계산 ── */
function calcOpacity(v: number, [r0, r1, r2, r3]: number[]): number {
  if (v <= r0) return 0;
  if (v <= r1) return (v - r0) / (r1 - r0);
  if (v <= r2) return 1;
  if (v <= r3) return 1 - (v - r2) / (r3 - r2);
  return 0;
}

/* ── 헬퍼: 스크롤 진행도로부터 Y 오프셋(px) 계산 ── */
function calcY(v: number, [r0, r1, r2, r3]: number[]): number {
  if (v <= r0) return 50;
  if (v <= r1) return 50 * (1 - (v - r0) / (r1 - r0));
  if (v <= r2) return 0;
  if (v <= r3) return -50 * ((v - r2) / (r3 - r2));
  return -50;
}

/* ═══════════════════
   메인 컴포넌트
═══════════════════ */
export default function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  /* 각 텍스트 패널에 대한 ref (직접 DOM 조작용) */
  const panelRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const ctaRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const indicatorRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const [images, setImages]             = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  /* ① 마운트 시 맨 위로 강제 스크롤 */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  /* 스크롤 진행도 */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  /* 캔버스 애니메이션 전용 스프링 (부드러운 프레임 보간) */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001,
  });

  /* ② 이미지 프리로딩 */
  useEffect(() => {
    const arr: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = `/sequence/Flow_202604162239_${i}.jpg`;
      img.onload = () => {
        loaded++;
        setLoadingProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT) setImagesLoaded(true);
      };
      arr.push(img);
    }
    setImages(arr);
  }, []);

  /* ③ 캔버스 드로잉 */
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (idx: number) => {
      const img = images[idx];
      if (!img?.complete) return;
      const cw = canvas.width, ch = canvas.height;
      const iw = img.width, ih = img.height;

      /* 모바일(세로 화면): cover 방식으로 세로 꽉 채움
         데스크톱(가로 화면): contain 방식으로 전체 표시 */
      const isPortrait = ch > cw;
      const scale = isPortrait
        ? Math.max(cw / iw, ch / ih)   // cover
        : Math.min(cw / iw, ch / ih);  // contain

      const w = iw * scale;
      const h = ih * scale;
      const x = (cw - w) / 2;
      const y = (ch - h) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, 0, 0, iw, ih, x, y, w, h);
    };

    draw(0);

    /* 캔버스 프레임: smoothProgress로 부드럽게 */
    const unsubCanvas = smoothProgress.on('change', (v) => {
      const frameIdx = Math.max(0, Math.min(
        Math.floor(v * (FRAME_COUNT - 1)),
        FRAME_COUNT - 1
      ));
      draw(frameIdx);
    });

    window.addEventListener('resize', resize);
    return () => {
      unsubCanvas();
      window.removeEventListener('resize', resize);
    };
  }, [imagesLoaded, images, smoothProgress]);

  /* ④ 핵심: 스크롤에 따른 텍스트 패널 직접 DOM 조작
     ──────────────────────────────────────────────
     React 상태 변경이나 Framer Motion useTransform을 사용하지 않고,
     scrollYProgress 이벤트에서 직접 DOM의 style을 변경합니다.
     이 방식은 브라우저/빌드 환경에 관계없이 가장 안정적으로 동작합니다. */
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      /* ─ 4개의 챕터 패널 업데이트 ─ */
      chapters.forEach((ch, i) => {
        const el = panelRefs[i]?.current;
        if (!el) return;

        const opacity = calcOpacity(v, ch.range);
        const yOffset = calcY(v, ch.range);

        el.style.opacity = String(opacity);
        el.style.transform = `translateY(calc(-50% + ${yOffset}px))`;

        /* opacity가 0이면 완전히 숨겨서 backdrop-filter 충돌 방지 */
        el.style.visibility = opacity > 0.01 ? 'visible' : 'hidden';
        el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      });

      /* ─ CTA 패널 ─ */
      if (ctaRef.current) {
        const ctaOpacity = v <= 0.93 ? 0 : Math.min(1, (v - 0.93) / 0.05);
        const ctaScale = 0.97 + ctaOpacity * 0.03;
        ctaRef.current.style.opacity = String(ctaOpacity);
        ctaRef.current.style.transform = `translate(-50%, -50%) scale(${ctaScale})`;
        ctaRef.current.style.visibility = ctaOpacity > 0.01 ? 'visible' : 'hidden';
        ctaRef.current.style.pointerEvents = ctaOpacity > 0.5 ? 'auto' : 'none';
      }

      /* ─ 스크롤 힌트 ─ */
      if (hintRef.current) {
        const hintOpacity = v < 0.04 ? 1 : Math.max(0, 1 - (v - 0.04) / 0.03);
        hintRef.current.style.opacity = String(hintOpacity);
        hintRef.current.style.visibility = hintOpacity > 0.01 ? 'visible' : 'hidden';
      }

      /* ─ 우측 인디케이터 ─ */
      let activeIdx = 0;
      if (v >= 0.22) activeIdx = 1;
      if (v >= 0.46) activeIdx = 2;
      if (v >= 0.70) activeIdx = 3;
      if (v >= 0.90) activeIdx = 4;

      indicatorRefs.forEach((ref, i) => {
        if (!ref.current) return;
        const isActive = i === activeIdx;
        ref.current.style.height = isActive ? '28px' : '8px';
        ref.current.style.background = isActive ? '#D4AF37' : 'rgba(255,255,255,0.25)';
      });
    });

    return unsub;
  }, [scrollYProgress]);

  /* ── 공통 패널 스타일 ── */
  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: 'clamp(1.5rem, 6vw, 5rem)',
    transform: 'translateY(-50%)',
    maxWidth: '620px',
    width: 'calc(100% - clamp(3rem, 12vw, 10rem))',
    background: 'rgba(4, 4, 4, 0.78)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    border: '1px solid rgba(212, 175, 55, 0.18)',
    padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 5vw, 4rem)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    opacity: 0,             /* 초기 상태: 숨김 */
    visibility: 'hidden',   /* 초기 상태: 숨김 */
    pointerEvents: 'none',
    userSelect: 'none',
    willChange: 'opacity, transform',   /* GPU 가속 힌트 */
  };

  return (
    <>
      {/* ── [1] 캔버스 (fixed) ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          zIndex: 0, pointerEvents: 'none',
        }}
      />

      {/* ── [2] 다크 오버레이 (가독성 확보) ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(4,4,4,0.5) 0%, rgba(4,4,4,0.18) 30%, rgba(4,4,4,0.18) 70%, rgba(4,4,4,0.55) 100%)',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 35%, rgba(4,4,4,0.72) 100%)',
      }} />

      {/* ── [3] 로딩 스크린 ── */}
      {!imagesLoaded && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#080808',
        }}>
          <div style={{
            color: 'rgba(212,175,55,0.4)', fontSize: '0.6rem',
            letterSpacing: '0.6em', textTransform: 'uppercase',
            fontFamily: 'serif', marginBottom: '2rem',
          }}>
            Andy Lee
          </div>
          <div style={{
            width: '14rem', height: '1px',
            background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${loadingProgress}%`,
              background: '#D4AF37', transition: 'width 0.2s',
            }} />
          </div>
          <div style={{
            color: 'rgba(212,175,55,0.5)', fontSize: '0.6rem',
            marginTop: '1rem', letterSpacing: '0.4em', textTransform: 'uppercase',
          }}>
            {loadingProgress}%
          </div>
        </div>
      )}

      {/* ── [4] 스크롤 공간 ── */}
      <div ref={containerRef} style={{ height: '600vh', position: 'relative' }}>
        {/* sticky 뷰포트: 화면에 고정되며 그 위에 텍스트가 나타남 */}
        <div style={{
          position: 'sticky', top: 0,
          height: '100vh', width: '100%',
          zIndex: 10, pointerEvents: 'none',
          overflow: 'hidden',
        }}>

          {/* ── 챕터 텍스트 패널 4개 ── */}
          {chapters.map((chapter, idx) => (
            <div
              key={idx}
              ref={panelRefs[idx]}
              style={panelStyle}
            >
              {/* 태그 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  display: 'block', width: '1.8rem', height: '1px',
                  background: 'rgba(212,175,55,0.6)',
                }} />
                <span style={{
                  color: '#D4AF37', fontSize: '0.65rem',
                  letterSpacing: '0.4em', fontStyle: 'italic',
                  fontFamily: 'serif', textTransform: 'uppercase',
                }}>
                  {chapter.tag}
                </span>
              </div>

              {/* 헤드라인 */}
              <h2 style={{
                fontFamily: 'serif', fontWeight: 700,
                fontSize: 'clamp(2.4rem, 6.5vw, 5rem)',
                lineHeight: 1.1, color: '#FFFFFF',
                textShadow: '0 2px 20px rgba(0,0,0,0.9)',
                margin: 0, textAlign: 'left',
              }}>
                {chapter.heading[0]}<br />
                <span style={{
                  color: '#D4AF37', fontStyle: 'italic',
                  textShadow: '0 0 40px rgba(212,175,55,0.5)',
                }}>
                  {chapter.heading[1]}
                </span>
              </h2>

              {/* 구분선 */}
              <div style={{
                height: '1px', width: '3.5rem',
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                opacity: 0.5,
              }} />

              {/* 본문 */}
              <p style={{
                fontSize: 'clamp(0.85rem, 1.7vw, 1.05rem)',
                color: 'rgba(255,255,255,0.88)',
                textAlign: 'left', lineHeight: 1.9,
                whiteSpace: 'pre-line',
                textShadow: '0 1px 8px rgba(0,0,0,0.95)',
                margin: 0,
              }}>
                {chapter.body}
              </p>
            </div>
          ))}

          {/* ── CTA 패널 ── */}
          <div
            ref={ctaRef}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              maxWidth: '560px',
              width: 'calc(100% - 3rem)',
              background: 'rgba(4,4,4,0.82)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(212,175,55,0.22)',
              padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 5vw, 4rem)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '1.2rem',
              opacity: 0,
              visibility: 'hidden',
              pointerEvents: 'none',
              willChange: 'opacity, transform',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'block', width: '3rem', height: '1px', background: 'rgba(212,175,55,0.4)' }} />
              <span style={{
                color: 'rgba(212,175,55,0.7)', fontSize: '0.62rem',
                letterSpacing: '0.5em', fontFamily: 'serif', fontStyle: 'italic',
              }}>Since 1998</span>
              <span style={{ display: 'block', width: '3rem', height: '1px', background: 'rgba(212,175,55,0.4)' }} />
            </div>

            <h2 style={{
              fontFamily: 'serif', fontWeight: 700, textAlign: 'center',
              fontSize: 'clamp(3rem, 9vw, 6rem)', lineHeight: 1,
              color: '#FFFFFF', textShadow: '0 2px 30px rgba(0,0,0,0.95)',
              letterSpacing: '0.08em', margin: 0,
            }}>
              ANDY
            </h2>
            <h3 style={{
              fontFamily: 'serif', fontWeight: 700, textAlign: 'center',
              fontSize: 'clamp(1rem, 3.5vw, 2.2rem)', color: '#D4AF37',
              letterSpacing: '0.5em',
              textShadow: '0 0 40px rgba(212,175,55,0.6)',
              margin: 0,
            }}>
              LEE
            </h3>

            <div style={{
              height: '1px', width: '5rem',
              background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              opacity: 0.5,
            }} />

            <p style={{
              color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem',
              letterSpacing: '0.4em', textTransform: 'uppercase',
              fontFamily: 'serif', margin: 0,
            }}>
              Artist · Producer · Icon
            </p>

            <button className="btn-gold" style={{ cursor: 'pointer' }}>
              Discover His Journey
            </button>
          </div>

          {/* ── 스크롤 힌트 ── */}
          <div
            ref={hintRef}
            style={{
              position: 'absolute', bottom: '2.5rem',
              left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '0.5rem',
              pointerEvents: 'none',
              willChange: 'opacity',
            }}
          >
            <span style={{
              color: 'rgba(255,255,255,0.35)', fontSize: '0.55rem',
              letterSpacing: '0.5em', textTransform: 'uppercase',
            }}>Scroll</span>
            <div className="bounce-down">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 9l5 5 5-5"
                  stroke="rgba(212,175,55,0.6)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* ── [5] 우측 챕터 인디케이터 (fixed) ── */}
      <div style={{
        position: 'fixed', right: '1.5rem', top: '50%',
        transform: 'translateY(-50%)', zIndex: 30,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '0.75rem',
      }}>
        {indicatorRefs.map((ref, i) => (
          <div
            key={i}
            ref={ref}
            style={{
              width: '1px',
              borderRadius: '1px',
              height: '8px',
              background: 'rgba(255,255,255,0.25)',
              transition: 'all 0.5s ease',
            }}
          />
        ))}
      </div>
    </>
  );
}
