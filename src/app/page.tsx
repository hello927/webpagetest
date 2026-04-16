import Navbar from '@/components/Navbar';
import Scrollytelling from '@/components/Scrollytelling';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: '#080808' }}>
      <Navbar />
      <Scrollytelling />

      {/* 푸터 */}
      <footer
        className="relative flex flex-col items-center justify-center gap-6 border-t"
        style={{
          height: '50vh',
          borderColor: 'rgba(212,175,55,0.1)',
          background: 'linear-gradient(to bottom, #080808, #000)',
        }}
      >
        <div className="flex items-center gap-4">
          <span className="block w-16 h-px" style={{ background: 'rgba(212,175,55,0.3)' }}></span>
          <span className="text-[10px] tracking-[0.5em] uppercase font-serif" style={{ color: 'rgba(212,175,55,0.5)' }}>
            The Legend Continues
          </span>
          <span className="block w-16 h-px" style={{ background: 'rgba(212,175,55,0.3)' }}></span>
        </div>

        <div
          className="font-serif font-bold tracking-widest"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: 'rgba(255,255,255,0.85)' }}
        >
          SHINHWA
        </div>

        <div className="gold-line w-20"></div>

        <p className="text-[10px] tracking-[0.5em] uppercase font-light" style={{ color: 'rgba(255,255,255,0.2)' }}>
          © {new Date().getFullYear()} Andy Lee (이선호) · All Rights Reserved
        </p>
      </footer>
    </main>
  );
}
