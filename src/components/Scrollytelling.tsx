"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

const FRAME_COUNT = 199;

/* 챕터 데이터: 네 개의 포인트 [fadeIn시작, fadeIn완료, fadeOut시작, fadeOut완료] */
const chapters = [
  {
    tag: 'THE TIMELESS ICON',
    heading: ['Eternal', 'Maknae.'],
    body: '그룹 신화의 영원한 막내, 이선호.\n시간이 흘러도 변치 않는 단정하고 훈훈한 매력.',
    range: [0, 0.05, 0.16, 0.22],
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

/* ── 텍스트 패널 ── */
function TextPanel({
  chapter,
  progress,
}: {
  chapter: typeof chapters[0];
  progress: any;
}) {
  const [r0, r1, r2, r3] = chapter.range;
  const opacity = useTransform(progress, [r0, r1, r2, r3], [0, 1, 1, 0]);
  const y = useTransform(progress, [r0, r1, r2, r3], [40, 0, 0, -40]);

  return (
    <motion.div
      className="flex flex-col items-start gap-5 py-12 px-10 md:px-16 pointer-events-none select-none"
      style={{
        gridArea: '1 / 1',
        opacity,
        y,
        background: 'rgba(4, 4, 4, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.18)',
        maxWidth: '640px',
        width: '100%',
      }}
    >
      {/* 태그 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ display:'block', width:'2rem', height:'1px', background:'rgba(212,175,55,0.6)' }} />
        <span style={{ color:'#D4AF37', fontSize:'0.68rem', letterSpacing:'0.4em', fontStyle:'italic', fontFamily:'serif', textTransform:'uppercase' }}>
          {chapter.tag}
        </span>
      </div>

      {/* 헤드라인 */}
      <h2
        className="font-serif font-bold"
        style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
          lineHeight: 1.1,
          color: '#FFFFFF',
          textShadow: '0 2px 20px rgba(0,0,0,0.9)',
          margin: 0,
          textAlign: 'left',
        }}
      >
        {chapter.heading[0]}<br />
        <span style={{ color:'#D4AF37', fontStyle:'italic', textShadow:'0 0 40px rgba(212,175,55,0.5)' }}>
          {chapter.heading[1]}
        </span>
      </h2>

      {/* 구분선 */}
      <div style={{ height:'1px', width:'4rem', background:'linear-gradient(90deg,transparent,#D4AF37,transparent)', opacity:0.5 }} />

      {/* 본문 */}
      <p
        style={{
          fontSize: 'clamp(0.88rem, 1.8vw, 1.05rem)',
          color: 'rgba(255,255,255,0.88)',
          textAlign: 'left',
          lineHeight: 1.9,
          whiteSpace: 'pre-line',
          textShadow: '0 1px 8px rgba(0,0,0,0.95)',
          margin: 0,
        }}
      >
        {chapter.body}
      </p>
    </motion.div>
  );
}

/* ── CTA 패널 ── */
function CtaPanel({ progress }: { progress: any }) {
  const opacity = useTransform(progress, [0.93, 0.98], [0, 1]);
  const scale = useTransform(progress, [0.93, 0.98], [0.97, 1]);

  return (
    <motion.div
      className="flex flex-col items-center gap-6 py-14 px-12 md:px-20 pointer-events-auto"
      style={{
        gridArea: '1 / 1',
        opacity,
        scale,
        background: 'rgba(4,4,4,0.80)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(212,175,55,0.22)',
        maxWidth: '580px',
        width: '100%',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
        <span style={{ display:'block', width:'3rem', height:'1px', background:'rgba(212,175,55,0.4)' }} />
        <span style={{ color:'rgba(212,175,55,0.7)', fontSize:'0.62rem', letterSpacing:'0.5em', fontFamily:'serif', fontStyle:'italic' }}>Since 1998</span>
        <span style={{ display:'block', width:'3rem', height:'1px', background:'rgba(212,175,55,0.4)' }} />
      </div>

      <h2
        className="font-serif font-bold text-center"
        style={{ fontSize:'clamp(3rem,10vw,6.5rem)', lineHeight:1, color:'#FFFFFF', textShadow:'0 2px 30px rgba(0,0,0,0.95)', letterSpacing:'0.08em', margin:0 }}
      >
        ANDY
      </h2>
      <h3
        className="font-serif font-bold text-center"
        style={{ fontSize:'clamp(1rem,4vw,2.5rem)', color:'#D4AF37', letterSpacing:'0.5em', textShadow:'0 0 40px rgba(212,175,55,0.6)', marginTop:'-1.2rem', margin:0 }}
      >
        LEE
      </h3>

      <div style={{ height:'1px', width:'5rem', background:'linear-gradient(90deg,transparent,#D4AF37,transparent)', opacity:0.5 }} />

      <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.62rem', letterSpacing:'0.4em', textTransform:'uppercase', fontFamily:'serif', margin:0 }}>
        Artist · Producer · Icon
      </p>

      <button className="btn-gold pointer-events-auto cursor-pointer">Discover His Journey</button>
    </motion.div>
  );
}

/* ═══════════════════
   메인 컴포넌트
═══════════════════ */
export default function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);

  const [images, setImages]                   = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded]       = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showScrollHint, setShowScrollHint]   = useState(true);

  /* ① 마운트 시 맨 위로 강제 스크롤 + 브라우저 자동 복원 비활성화 */
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
  // smoothProgress: 캔버스 프레임 보간과 텍스트 애니메이션에 함께 사용
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  /* 이미지 프리로딩 */
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

  /* Canvas 드로잉 */
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current || images.length === 0) return;
    const canvas = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;

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
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const w = img.width  * scale;
      const h = img.height * scale;
      const x = (canvas.width  - w) / 2;
      const y = (canvas.height - h) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
    };

    draw(0);

    /* 캔버스: smoothProgress(spring)로 부드럽게 재생 */
    const unsubCanvas = smoothProgress.on('change', (v) => {
      const frameIdx = Math.max(0, Math.min(Math.floor(v * (FRAME_COUNT - 1)), FRAME_COUNT - 1));
      draw(frameIdx);
      if (v > 0.04) setShowScrollHint(false);
    });

    window.addEventListener('resize', resize);
    return () => {
      unsubCanvas();
      window.removeEventListener('resize', resize);
    };
  }, [imagesLoaded, images, smoothProgress]);

  // 진행도에 따른 인디케이터 포지션 계산용 State
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => {
      if (v < 0.22) setActiveIndex(0);
      else if (v < 0.46) setActiveIndex(1);
      else if (v < 0.70) setActiveIndex(2);
      else if (v < 0.90) setActiveIndex(3);
      else setActiveIndex(4);
    });
    return unsub;
  }, [scrollYProgress])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:0, pointerEvents:'none' }}
      />
      <div style={{
        position:'fixed', inset:0, zIndex:1, pointerEvents:'none',
        background:'linear-gradient(to bottom, rgba(4,4,4,0.5) 0%, rgba(4,4,4,0.2) 30%, rgba(4,4,4,0.2) 70%, rgba(4,4,4,0.55) 100%)'
      }} />
      <div style={{ position:'fixed', inset:0, zIndex:2, pointerEvents:'none', background:'radial-gradient(ellipse at center, transparent 35%, rgba(4,4,4,0.75) 100%)' }} />

      {!imagesLoaded && (
        <div style={{ position:'fixed', inset:0, zIndex:50, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#080808' }}>
          <div style={{ color:'rgba(212,175,55,0.4)', fontSize:'0.6rem', letterSpacing:'0.6em', textTransform:'uppercase', fontFamily:'serif', marginBottom:'2rem' }}>
            Andy Lee
          </div>
          <div style={{ width:'14rem', height:'1px', background:'rgba(255,255,255,0.1)', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${loadingProgress}%`, background:'#D4AF37', transition:'width 0.2s' }} />
          </div>
          <div style={{ color:'rgba(212,175,55,0.5)', fontSize:'0.6rem', marginTop:'1rem', letterSpacing:'0.4em', textTransform:'uppercase' }}>
            {loadingProgress}%
          </div>
        </div>
      )}

      <div ref={containerRef} style={{ height:'600vh', position:'relative' }}>
        <div style={{ 
          position:'sticky', 
          top:0, 
          height:'100vh', 
          zIndex:10, 
          paddingTop:'80px', 
          pointerEvents:'none',
          paddingLeft: 'clamp(1.5rem, 6vw, 5rem)',
          paddingRight: '1.5rem',
          display: 'grid', /* Grid로 텍스트 패널들을 한 곳에 쌓음 */
          alignItems: 'center', /* 세로 정렬: 중앙 */
          justifyItems: 'start' /* 가로 정렬: 왼쪽 */
        }}>
          {chapters.map((chapter, idx) => (
            <TextPanel key={idx} chapter={chapter} progress={smoothProgress} />
          ))}
          <CtaPanel progress={smoothProgress} />

          <AnimatePresence>
            {showScrollHint && (
              <motion.div
                key="hint"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{ 
                  gridArea: '1 / 1', /* 같은 그리드 셀 위 */
                  alignSelf: 'end', /* 하단 정렬 */
                  justifySelf: 'center', /* 가운데 정렬 */
                  marginBottom: '2.5rem',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', pointerEvents:'none' 
                }}
              >
                <span style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.55rem', letterSpacing:'0.5em', textTransform:'uppercase' }}>Scroll</span>
                <div className="bounce-down">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 9l5 5 5-5" stroke="rgba(212,175,55,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ position:'fixed', right:'1.5rem', top:'50%', transform:'translateY(-50%)', zIndex:30, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.75rem' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '1px',
              borderRadius: '1px',
              height: i === activeIndex ? '28px' : '8px',
              background: i === activeIndex ? '#D4AF37' : 'rgba(255,255,255,0.25)',
              transition: 'all 0.5s ease',
            }}
          />
        ))}
      </div>
    </>
  );
}
