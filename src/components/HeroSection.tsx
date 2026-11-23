import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Flame, Film } from 'lucide-react';
import { TheaterFormat, BrandConfig } from '../types';

interface HeroSectionProps {
  brand: BrandConfig;
  activeFormat: TheaterFormat;
  onSelectFormat: (format: TheaterFormat) => void;
  onOpenBooking: (format?: string) => void;
  inspectorMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  brand,
  activeFormat,
  onSelectFormat,
  onOpenBooking,
  inspectorMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger toast on brand change to confirm site switch
  useEffect(() => {
    setToastMessage(`🎬 [${brand.name}] 특별관 쇼룸으로 메인 상영작과 테마가 전환되었습니다.`);
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [brand.id, brand.name]);

  // Ambient Canvas Animation with Brand Accent Particle Color
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 45;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedY: Math.random() * 0.35 + 0.15,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // Subtle muted ambient particle color
        let color = `rgba(184, 41, 53, ${p.opacity * 0.35})`;
        if (brand.theme === 'purple' || activeFormat === 'screenx') {
          color = `rgba(148, 153, 166, ${p.opacity * 0.35})`;
        } else if (brand.theme === 'emerald') {
          color = `rgba(148, 153, 166, ${p.opacity * 0.35})`;
        } else if (brand.theme === 'amber') {
          color = `rgba(194, 168, 120, ${p.opacity * 0.4})`;
        } else if (activeFormat === '4dx') {
          color = `rgba(148, 153, 166, ${p.opacity * 0.35})`;
        }

        ctx.fillStyle = color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [brand.theme, activeFormat]);

  const handleFormatChange = (format: TheaterFormat) => {
    onSelectFormat(format);
    const formatLabels: Record<TheaterFormat, string> = {
      imax: 'IMAX 1.90:1 대화면',
      '4dx': '4DX 오감 모션',
      screenx: 'SCREENX 270° 파노라마',
      privatebox: 'PRIVATE BOX VIP 스위트',
    };
    setToastMessage(`${formatLabels[format]} 앰비언트 모드가 적용되었습니다.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getFormatGradient = () => {
    return 'from-[#101114] via-[#101114]/80 to-[#101114]/35';
  };

  const getPrimaryButtonClass = () => {
    switch (brand.theme) {
      case 'purple':
        return 'bg-[#5A4D7D] hover:bg-[#4C406B] text-[#EAECEF]';
      case 'emerald':
        return 'bg-[#256353] hover:bg-[#1E5244] text-[#EAECEF]';
      case 'amber':
        return 'bg-[#C2A878] hover:bg-[#AD9365] text-[#101114]';
      default:
        return 'bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF]';
    }
  };

  return (
    <section
      key={brand.id}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#101114]"
    >
      {/* Background Visual Asset & Calm Charcoal Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={brand.featuredMovie.image}
          alt={brand.featuredMovie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 filter brightness-75 scale-105 transition-all duration-1000 ease-out"
        />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <div className={`absolute inset-0 bg-gradient-to-t ${getFormatGradient()} transition-all duration-700`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(16,17,20,0.92)_90%)] pointer-events-none" />
      </div>

      {/* Hero Content (Centered) */}
      <div className="relative z-10 max-w-5xl mx-auto my-auto text-center pt-2">
        {/* Academic UX Inspector Callout */}
        {inspectorMode && (
          <div className="mb-6 p-4 rounded-2xl text-left text-xs bg-[#181A20]/95 border border-white/15 text-[#EAECEF] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center space-x-2 font-bold mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[#C2A878] text-[10px]">
                HERO SECTION UX 기획 의도
              </span>
              <span className="text-[#EAECEF]">[As-Is: 복잡한 팝업 배너] ➔ [To-Be: 시네마틱 루프 & 포맷 스위처 독]</span>
            </div>
            <p className="leading-relaxed text-[#9499A6]">
              첫 화면 접속 3초 안에 영화 속으로 빨려 들어가는 시네마틱 무드를 전달하며, 하단 플로팅 독(Dock)을 조작해
              IMAX(1.90:1 확장), 4DX(오감 모션), SCREENX(270° 파노라마)의 비주얼·무드를 즉시 직관적으로 체험할 수 있도록 설계했습니다.
            </p>
          </div>
        )}

        {/* Trending Movie Badge - Restrained translucent dark pill with 1px border */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.06)] border border-white/10 text-[#9499A6] text-xs font-semibold mb-6">
          <Flame className="w-3.5 h-3.5 text-[#C2A878]" />
          <span className="text-[#C2A878]">{brand.featuredMovie.badge}</span>
          <span className="text-white/20">|</span>
          <span className="text-[#EAECEF] font-bold">{brand.featuredMovie.title}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#EAECEF] tracking-tight leading-tight sm:leading-none mb-6">
          스크린을 넘어,<br className="hidden sm:inline" />
          <span className="text-[#EAECEF]">
            영화 속으로 들어가는 순간.
          </span>
        </h1>

        {/* Subtitle - Dynamic by brand */}
        <p className="text-base sm:text-xl text-[#9499A6] max-w-3xl mx-auto font-medium leading-relaxed mb-8">
          {brand.featuredMovie.subhead}
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onOpenBooking(activeFormat.toUpperCase())}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg transition-colors active:scale-95 flex items-center justify-center space-x-2 border border-white/10 ${getPrimaryButtonClass()}`}
          >
            <span>{activeFormat.toUpperCase()} 명당 즉시 예매</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

          <a
            href="#format-comparison"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#181A20] border border-white/10 hover:bg-white/[0.06] text-[#EAECEF] font-bold text-base sm:text-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>포맷별 차이 10초 체험하기</span>
            <ChevronDown className="w-5 h-5 text-[#9499A6]" />
          </a>
        </div>
      </div>

      {/* Floating Format Switcher Bottom Dock */}
      <div className="relative z-20 max-w-4xl mx-auto w-full mt-6">
        <div className="bg-[#181A20]/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 grid grid-cols-3 gap-2.5 sm:gap-4 border border-white/10">
          {/* Switcher Card 1: IMAX */}
          <button
            onClick={() => handleFormatChange('imax')}
            className={`p-3 sm:p-4 rounded-xl text-left transition-colors relative overflow-hidden border ${
              activeFormat === 'imax'
                ? 'bg-white/[0.06] border-[#B82935]'
                : 'bg-[#101114] hover:bg-white/[0.04] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`font-black text-sm sm:text-lg ${activeFormat === 'imax' ? 'text-[#EAECEF]' : 'text-[#9499A6]'}`}>
                IMAX
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-white/10 text-[#C2A878] font-bold">
                1.90:1
              </span>
            </div>
            <p className="text-[11px] text-[#9499A6] hidden sm:block">26% 더 넓어진 압도적 화각</p>
            <div className="mt-2 text-[10px] font-bold flex items-center space-x-1.5">
              {activeFormat === 'imax' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82935]" />
                  <span className="text-[#EAECEF]">라이브 뷰 적용 중</span>
                </>
              ) : (
                <span className="text-[#9499A6] hover:text-[#EAECEF]">체험 클릭 ➔</span>
              )}
            </div>
          </button>

          {/* Switcher Card 2: 4DX */}
          <button
            onClick={() => handleFormatChange('4dx')}
            className={`p-3 sm:p-4 rounded-xl text-left transition-colors relative overflow-hidden border ${
              activeFormat === '4dx'
                ? 'bg-white/[0.06] border-[#B82935]'
                : 'bg-[#101114] hover:bg-white/[0.04] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`font-black text-sm sm:text-lg ${activeFormat === '4dx' ? 'text-[#EAECEF]' : 'text-[#9499A6]'}`}>
                4DX
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-white/10 text-[#9499A6] font-bold">
                오감 모션
              </span>
            </div>
            <p className="text-[11px] text-[#9499A6] hidden sm:block">12가지 모션시트 & 환경 연출</p>
            <div className="mt-2 text-[10px] font-bold flex items-center space-x-1.5">
              {activeFormat === '4dx' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82935]" />
                  <span className="text-[#EAECEF]">라이브 뷰 적용 중</span>
                </>
              ) : (
                <span className="text-[#9499A6] hover:text-[#EAECEF]">체험 클릭 ➔</span>
              )}
            </div>
          </button>

          {/* Switcher Card 3: SCREENX */}
          <button
            onClick={() => handleFormatChange('screenx')}
            className={`p-3 sm:p-4 rounded-xl text-left transition-colors relative overflow-hidden border ${
              activeFormat === 'screenx'
                ? 'bg-white/[0.06] border-[#B82935]'
                : 'bg-[#101114] hover:bg-white/[0.04] border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`font-black text-sm sm:text-lg ${activeFormat === 'screenx' ? 'text-[#EAECEF]' : 'text-[#9499A6]'}`}>
                SCREENX
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-white/10 text-[#9499A6] font-bold">
                270° 파노라마
              </span>
            </div>
            <p className="text-[11px] text-[#9499A6] hidden sm:block">좌/우 벽면까지 3면 파노라마</p>
            <div className="mt-2 text-[10px] font-bold flex items-center space-x-1.5">
              {activeFormat === 'screenx' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B82935]" />
                  <span className="text-[#EAECEF]">라이브 뷰 적용 중</span>
                </>
              ) : (
                <span className="text-[#9499A6] hover:text-[#EAECEF]">체험 클릭 ➔</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#181A20] border border-white/15 text-[#EAECEF] px-4 py-2.5 rounded-xl shadow-lg text-xs font-bold animate-in fade-in slide-in-from-bottom-3 duration-200 flex items-center gap-2">
          <Film className="w-4 h-4 text-[#C2A878]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
};
