import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Radio } from 'lucide-react';
import { AudioMode, BrandConfig } from '../types';
import aspectRatioFrameImg from '../assets/images/aspect_ratio_movie_frame_1794209493491.jpg';

interface FormatComparisonSectionProps {
  brand: BrandConfig;
  inspectorMode: boolean;
}

export const FormatComparisonSection: React.FC<FormatComparisonSectionProps> = ({
  brand,
  inspectorMode,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(100);
  const [audioMode, setAudioMode] = useState<AudioMode>('atmos');
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Waveform Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const renderWave = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 110;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      step += 0.045;

      const isAtmos = audioMode === 'atmos';
      const waveCount = isAtmos ? 4 : 1;

      for (let i = 0; i < waveCount; i++) {
        ctx.beginPath();
        ctx.strokeStyle = isAtmos
          ? i % 2 === 0
            ? '#B82935'
            : '#C2A878'
          : '#9499A6';

        for (let x = 0; x < canvas.width; x += 4) {
          const freq = isAtmos ? 0.026 : 0.012;
          const amp = isAtmos ? 24 - i * 5 : 8;
          const y = canvas.height / 2 + Math.sin(x * freq + step + i) * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animId = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [audioMode]);

  // Web Audio Synthesizer Tone for Live Acoustics Preview
  const playAcousticPreview = (mode: AudioMode) => {
    setAudioMode(mode);
    setIsPlayingSound(true);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      if (mode === 'atmos') {
        // Multi-frequency harmonic chord for 3D surround feel
        const freqs = [220, 330, 440, 660];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          if (pan) {
            pan.pan.setValueAtTime((idx % 2 === 0 ? -0.8 : 0.8), ctx.currentTime);
          }

          gain.gain.setValueAtTime(0.01, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.12 / freqs.length, ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);

          if (pan) {
            osc.connect(pan);
            pan.connect(gain);
          } else {
            osc.connect(gain);
          }
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime + idx * 0.05);
          osc.stop(ctx.currentTime + 1.0);
        });
      } else {
        // Flat narrow mono/stereo beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch {
      // Audio context might be restricted before interaction
    }

    setTimeout(() => setIsPlayingSound(false), 900);
  };

  const croppedBarHeight = ((100 - sliderValue) / 100) * 18;

  return (
    <section id="format-comparison" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="text-[#C2A878] text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>COMPARISON SIMULATOR</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#EAECEF] mb-4">
          화면비 & 공간 음향 체감 시뮬레이터
        </h2>
        <p className="text-[#9499A6] text-sm sm:text-base leading-relaxed">
          슬라이더를 좌우로 움직여 일반 상영관(2.39:1) 대비 {brand.name} IMAX 스크린에서 확장되는 26% 시야각을 직접 확인해보세요.
        </p>
      </div>

      {/* UX Inspector Callout */}
      {inspectorMode && (
        <div className="mb-8 p-4 rounded-2xl text-left text-xs bg-[#181A20] border border-white/15 text-[#EAECEF] animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[#C2A878] text-[10px]">
              FORMAT SIMULATOR UX 분석
            </span>
            <span>[As-Is: 모호한 수치 표기(1.90:1)] ➔ [To-Be: 드래그 시 잘려나가는 시야 가시화]</span>
          </div>
          <p className="leading-relaxed text-[#9499A6]">
            관객이 특별관 관람료에 대해 갖는 의문을 해소하기 위해, 슬라이더 조작 시 상하 레터박스가 실시간으로 덮이며
            일반관에서 소실되는 화면 정보를 극명하게 대조하도록 구현했습니다.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Interactive Aspect Ratio Slider Visualizer (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-[#EAECEF]">화면 비율 라이브 비교 (Aspect Ratio)</span>
              </div>
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded-md font-bold border transition-colors ${
                  sliderValue > 70
                    ? 'bg-[rgba(255,255,255,0.06)] text-[#C2A878] border-white/15'
                    : 'bg-[rgba(255,255,255,0.04)] text-[#9499A6] border-white/10'
                }`}
              >
                {sliderValue > 70 ? 'IMAX 1.90:1 (풀스크린 26% 확장)' : 'Standard 2.39:1 (상하 블랙바)'}
              </span>
            </div>

            {/* Canvas Movie Frame Container */}
            <div className="relative w-full aspect-video bg-[#101114] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
              {/* High-Fidelity Generated Movie Still */}
              <img
                src={aspectRatioFrameImg}
                alt="Alien Planet Expedition"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
              />

              {/* Champagne Gold Grid Indicating Expanded IMAX Area */}
              <div className="w-full h-full border border-[#C2A878]/35 flex items-center justify-center relative pointer-events-none">
                <span className="absolute top-3 left-3 text-[10px] bg-[#101114]/85 backdrop-blur-sm text-[#C2A878] font-bold px-2.5 py-0.5 rounded border border-white/15">
                  IMAX EXPANDED VIEWPORT (+26%)
                </span>
                <span className="absolute bottom-3 right-3 text-[10px] bg-[#101114]/85 text-[#9499A6] font-mono px-2 py-0.5 rounded border border-white/10">
                  Dual 4K Laser Projection
                </span>
              </div>

              {/* Cropped Mask Overlay (Standard 2.39:1 Letterbox) */}
              <div
                className="absolute inset-x-0 top-0 bg-[#101114]/92 transition-all duration-150 flex items-center justify-center pointer-events-none border-b border-white/10"
                style={{ height: `${croppedBarHeight}%` }}
              >
                {croppedBarHeight > 5 && (
                  <span className="text-[10px] text-[#9499A6] font-mono tracking-widest uppercase">
                    Standard 2.39:1 상단 잘림
                  </span>
                )}
              </div>
              <div
                className="absolute inset-x-0 bottom-0 bg-[#101114]/92 transition-all duration-150 flex items-center justify-center pointer-events-none border-t border-white/10"
                style={{ height: `${croppedBarHeight}%` }}
              >
                {croppedBarHeight > 5 && (
                  <span className="text-[10px] text-[#9499A6] font-mono tracking-widest uppercase">
                    Standard 2.39:1 하단 잘림
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Slider Control */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between text-xs text-[#9499A6] mb-2 font-medium">
              <span className="cursor-pointer hover:text-[#EAECEF] transition-colors" onClick={() => setSliderValue(0)}>
                일반관 (2.39:1 상하 잘림)
              </span>
              <span className="text-[#EAECEF] font-bold flex items-center gap-1 tabular-nums">
                ↔ 슬라이더 조절 ({sliderValue}%)
              </span>
              <span className="text-[#C2A878] font-bold cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSliderValue(100)}>
                IMAX (1.90:1 풀스크린)
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full cursor-ew-resize"
            />
          </div>
        </div>

        {/* Spatial Audio Visualizer & Audio Test (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-[#C2A878]" />
                <h3 className="font-bold text-lg text-[#EAECEF]">Dolby Atmos 64ch 공간 음향</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[#9499A6] border border-white/10 font-semibold">
                Dynamic 3D Sound
              </span>
            </div>
            <p className="text-xs text-[#9499A6] mb-5 leading-relaxed">
              상영관 천장과 측면, 좌석 뒤쪽 64개 스피커가 객체(Object) 위치에 따라 3차원으로 음향을 투사합니다.
              아래 버튼을 눌러 모드를 전환하고 음향 시뮬레이션을 청취해보세요.
            </p>

            {/* Audio Waveform Canvas */}
            <div className="bg-[#101114] rounded-2xl p-4 border border-white/10 mb-5 relative overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-28" />
              {isPlayingSound && (
                <div className="absolute top-2 right-2 text-[10px] text-[#C2A878] bg-[#181A20]/90 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>사운드 출력 중...</span>
                </div>
              )}
            </div>
          </div>

          {/* Mode Selector Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => playAcousticPreview('stereo')}
              className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-colors flex flex-col items-center justify-center space-y-1 border ${
                audioMode === 'stereo'
                  ? 'border-[#B82935] bg-white/[0.06] text-[#EAECEF]'
                  : 'border-white/10 bg-[#101114] text-[#9499A6] hover:border-white/20 hover:text-[#EAECEF]'
              }`}
            >
              <div className="flex items-center gap-1 font-bold">
                <VolumeX className="w-3.5 h-3.5" />
                <span>2.1ch 스테레오</span>
              </div>
              <span className="text-[10px] text-[#9499A6] font-normal">단조로운 평면 음향</span>
            </button>

            <button
              onClick={() => playAcousticPreview('atmos')}
              className={`py-3.5 px-4 rounded-xl text-xs font-bold transition-colors flex flex-col items-center justify-center space-y-1 border ${
                audioMode === 'atmos'
                  ? 'border-[#B82935] bg-white/[0.06] text-[#EAECEF]'
                  : 'border-white/10 bg-[#101114] text-[#9499A6] hover:border-white/20 hover:text-[#EAECEF]'
              }`}
            >
              <div className="flex items-center gap-1 font-extrabold text-[#C2A878]">
                <Volume2 className="w-3.5 h-3.5 text-[#EAECEF]" />
                <span>64ch Dolby Atmos</span>
              </div>
              <span className="text-[10px] text-[#9499A6] font-normal">360° 입체 객체 서라운드</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
