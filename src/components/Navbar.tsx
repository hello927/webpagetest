"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        /* Navbar는 반드시 canvas(z:0), overlay(z:1,2), sticky text(z:10), indicator(z:30) 보다 위 */
        zIndex: 100,
        transition: 'all 0.5s ease',
        padding: scrolled ? '1rem 0' : '1.6rem 0',
        background: scrolled
          ? 'rgba(6, 6, 6, 0.82)'
          : 'linear-gradient(to bottom, rgba(6,6,6,0.7) 0%, transparent 100%)',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(212,175,55,0.12)' : '1px solid transparent',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* ── 로고 ── */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          {/* 골드 엠블럼 박스 */}
          <div style={{
            width: '2.2rem', height: '2.2rem',
            border: '1px solid rgba(212,175,55,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.3s, box-shadow 0.3s',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = '#D4AF37';
              (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 12px rgba(212,175,55,0.3)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,175,55,0.55)';
              (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
          >
            <span style={{ color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, fontFamily: 'serif' }}>A</span>
          </div>

          {/* 이름 2단 텍스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'serif', fontSize: '0.95rem', letterSpacing: '0.22em', fontWeight: 700 }}>ANDY</span>
            <span style={{ color: 'rgba(212,175,55,0.65)', fontSize: '0.55rem', letterSpacing: '0.4em', fontWeight: 300, marginTop: '0.2rem' }}>SHINHWA</span>
          </div>
        </a>

        {/* ── 링크 (데스크탑) ── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {['Profile', 'Artist', 'Vision', 'Gallery'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="nav-link"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── CTA 버튼 ── */}
        <button className="btn-gold" style={{ fontSize: '0.65rem' }}>
          Discover
        </button>

      </div>
    </motion.nav>
  );
}
