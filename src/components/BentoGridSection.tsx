import React, { useState } from 'react';
import { Layers, Calculator } from 'lucide-react';
import { BrandConfig } from '../types';
import { CinemaHall3DViewer } from './CinemaHall3DViewer';

interface BentoGridSectionProps {
  brand: BrandConfig;
  inspectorMode: boolean;
}

export const BentoGridSection: React.FC<BentoGridSectionProps> = ({
  brand,
  inspectorMode,
}) => {
  // Box 3: ScreenX Active Panel
  const [activeSxPanel, setActiveSxPanel] = useState<'all' | 'left' | 'center' | 'right'>('all');

  // Box 4: MoviePass Calculator
  const [monthlyCount, setMonthlyCount] = useState<number>(2);

  const calculatedDiscount = monthlyCount * 3000 * 12;
  const freeTickets = monthlyCount >= 4 ? 4 : monthlyCount >= 2 ? 2 : 1;

  return (
    <section id="bento-grid" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="text-[#C2A878] text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>SPECIAL TECHNOLOGY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#EAECEF] mb-4">
          {brand.name} 4대 핵심 특별관 테크놀로지
        </h2>
        <p className="text-[#9499A6] text-sm sm:text-base leading-relaxed">
          압도적 4K 레이저 스크린부터 오감 자극 모션, 270도 파노라마 뷰까지 비대칭 벤토 그리드로 한눈에 탐색하세요.
        </p>
      </div>

      {/* UX Inspector Callout */}
      {inspectorMode && (
        <div className="mb-8 p-4 rounded-2xl text-left text-xs bg-[#181A20] border border-white/15 text-[#EAECEF] animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[#C2A878] text-[10px]">
              BENTO GRID UX 분석
            </span>
            <span>[As-Is: 개별 하위 페이지 분산] ➔ [To-Be: 12-컬럼 비대칭 벤토 그리드 통합 체험]</span>
          </div>
          <p className="leading-relaxed text-[#9499A6]">
            기존 영화관 사이트는 각 특별관 소개가 흩어져 있어 기술력을 비교하기 어려웠습니다.
            이를 12-컬럼 비대칭 그리드로 구성하고 3D 상영관 아키텍처 쇼룸(IMAX 4K 레이저 · 4DX 모션 · SCREENX 270° · Atmos 천장 음향),
            SCREENX 3면 파노라마, 무비패스 계산기를 배치해 이탈 없이 즉시 이해하도록 설계했습니다.
          </p>
        </div>
      )}

      {/* 12-Column Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 3D Interactive Showroom Viewer (12 Columns) */}
        <div className="md:col-span-12 glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-[#EAECEF] border border-white/10 text-xs font-bold">
                3D AUDITORIUM SHOWCASE
              </span>
              <span className="text-xs text-[#9499A6] font-mono">IMAX GT · 4DX · ATMOS ARCHITECTURE</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#EAECEF] mb-1.5">
                  {brand.name} 플래그십 특별관 3D 아키텍처 뷰어
                </h3>
                <p className="text-[#9499A6] text-sm max-w-2xl leading-relaxed">
                  곡면 IMAX 4K 듀얼 레이저 스크린, 5단 계단식 G열 명당 좌석, 4DX 모션 액추에이터, Dolby Atmos 천장 스피커 어레이까지 특별관 내부 구조를 3D로 자유롭게 탐색해보세요.
                </p>
              </div>
            </div>
          </div>

          <CinemaHall3DViewer brandName={brand.name} />
        </div>

        {/* Box 3 (Small 6 Cols): SCREENX 270° Panorama */}
        <div className="md:col-span-6 glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-[#EAECEF] border border-white/10 text-xs font-bold">
                SCREENX
              </span>
              <span className="text-xs text-[#9499A6] font-mono">270° 3-PANEL VIEW</span>
            </div>
            <h3 className="text-xl font-bold text-[#EAECEF] mb-2">정면과 좌우 벽면까지 3면 파노라마</h3>
            <p className="text-xs text-[#9499A6] mb-4">
              스크린 패널을 클릭하여 좌측, 정면, 우측으로 확장되는 270도 시야각 파노라마를 체험하세요.
            </p>
          </div>

          {/* 3-Sided Panoramic Display */}
          <div className="bg-[#101114] p-3 rounded-2xl border border-white/10">
            <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3">
              <img
                src="/src/assets/images/screenx_panoramic_scene_1794209493353.jpg"
                alt="Cyberpunk Panorama"
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  activeSxPanel === 'left'
                    ? 'scale-125 -translate-x-12'
                    : activeSxPanel === 'right'
                    ? 'scale-125 translate-x-12'
                    : 'scale-100 translate-x-0'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101114]/90 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[11px] font-bold text-[#EAECEF]">
                  {activeSxPanel === 'left' && '좌측 벽면 스크린 투사 화각'}
                  {activeSxPanel === 'center' && '정면 메인 스크린 시점'}
                  {activeSxPanel === 'right' && '우측 벽면 스크린 투사 화각'}
                  {activeSxPanel === 'all' && '270° 파노라마 전경 (3면 동시 투사)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveSxPanel('left')}
                className={`py-2 rounded-xl text-xs font-bold transition-colors border ${
                  activeSxPanel === 'left'
                    ? 'bg-[#B82935] text-[#EAECEF] border-[#B82935]'
                    : 'bg-[#181A20] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                }`}
              >
                좌측 스크린
              </button>
              <button
                onClick={() => setActiveSxPanel(activeSxPanel === 'center' ? 'all' : 'center')}
                className={`py-2 rounded-xl text-xs font-bold transition-colors border ${
                  activeSxPanel === 'center' || activeSxPanel === 'all'
                    ? 'bg-[#B82935] text-[#EAECEF] border-[#B82935]'
                    : 'bg-[#181A20] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                }`}
              >
                정면 메인
              </button>
              <button
                onClick={() => setActiveSxPanel('right')}
                className={`py-2 rounded-xl text-xs font-bold transition-colors border ${
                  activeSxPanel === 'right'
                    ? 'bg-[#B82935] text-[#EAECEF] border-[#B82935]'
                    : 'bg-[#181A20] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                }`}
              >
                우측 스크린
              </button>
            </div>
          </div>
        </div>

        {/* Box 4 (Small 6 Cols): MoviePass Calculator */}
        <div className="md:col-span-6 glass-card p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-[rgba(255,255,255,0.06)] text-[#C2A878] border border-white/10 text-xs font-bold">
                MOVIE PASS
              </span>
              <span className="text-xs text-[#9499A6] font-mono">VIP CALCULATOR</span>
            </div>
            <h3 className="text-xl font-bold text-[#EAECEF] mb-2">특별관 전용 무비패스 혜택 계산기</h3>
            <p className="text-xs text-[#9499A6] mb-4 leading-relaxed">
              월 관람 회차를 선택하면 {brand.name} 특별관 무비패스를 통해 절약 가능한 연간 혜택을 계산해드립니다.
            </p>
          </div>

          {/* Calculator Controls & Output */}
          <div className="bg-[#101114] p-4 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#EAECEF] font-semibold flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-[#C2A878]" />
                월 예상 관람 횟수:
              </span>
              <div className="flex gap-1.5">
                {[1, 2, 4, 8].map((count) => (
                  <button
                    key={count}
                    onClick={() => setMonthlyCount(count)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      monthlyCount === count
                        ? 'bg-[#B82935] text-[#EAECEF] border-[#B82935]'
                        : 'bg-[#181A20] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
                    }`}
                  >
                    {count}회
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#9499A6] uppercase">연간 예상 절감액</div>
                <div className="text-xl font-black text-[#C2A878] tabular-nums">
                  {calculatedDiscount.toLocaleString()}원 절약
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#9499A6] uppercase">특별관 전용 초대권</div>
                <div className="text-xs font-extrabold text-[#EAECEF]">
                  연간 {freeTickets}매 무료 증정
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
