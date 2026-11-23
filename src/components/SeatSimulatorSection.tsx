import React, { useState } from 'react';
import { Eye, CheckCircle2, Armchair } from 'lucide-react';
import { SeatRow, BrandConfig } from '../types';

interface SeatSimulatorSectionProps {
  brand: BrandConfig;
  onOpenBookingWithSeat: (row: SeatRow) => void;
  inspectorMode: boolean;
}

export const SeatSimulatorSection: React.FC<SeatSimulatorSectionProps> = ({
  brand,
  onOpenBookingWithSeat,
  inspectorMode,
}) => {
  const [selectedRow, setSelectedRow] = useState<SeatRow>('G');

  const rowDetails: Record<
    SeatRow,
    {
      title: string;
      badge: string;
      badgeColor: string;
      description: string;
      perspectiveStyle: string;
      seatsAvailable: number;
      sweetSpotRating: string;
    }
  > = {
    A: {
      title: 'A열 (전열 몰입석)',
      badge: '초대형 꽉 찬 시야',
      badgeColor: 'bg-[rgba(255,255,255,0.06)] text-[#9499A6] border-white/10',
      description: '화면이 시야각 전체(110°)를 가득 채워 마치 영화 속에 직접 들어가 있는 듯한 극도의 임팩트를 제공합니다.',
      perspectiveStyle: 'scale(1.24) translateY(12px) rotateX(-6deg)',
      seatsAvailable: 8,
      sweetSpotRating: '몰입감 100% · 시야 채움 최상',
    },
    G: {
      title: 'G열 (★ 골든 에리어 최고 명당)',
      badge: '시선 일치 황금 구역',
      badgeColor: 'bg-[rgba(255,255,255,0.06)] text-[#C2A878] border-white/10 font-bold',
      description: '스크린의 정중앙과 관객의 시선이 수평으로 완벽하게 일치하여 목의 피로가 전혀 없는 절대적인 1순위 명당입니다.',
      perspectiveStyle: 'scale(1.0) translateY(0px) rotateX(0deg)',
      seatsAvailable: 4,
      sweetSpotRating: '골든 존 1위 · 왜곡률 0%',
    },
    M: {
      title: 'M열 (후열 서라운드석)',
      badge: '입체 음향 밸런스 최적',
      badgeColor: 'bg-[rgba(255,255,255,0.06)] text-[#9499A6] border-white/10',
      description: '초대형 스크린 전체를 한눈에 조망할 수 있으며, 64채널 서라운드 스피커의 소리가 가장 조화롭게 모이는 음향 명당입니다.',
      perspectiveStyle: 'scale(0.82) translateY(-14px) rotateX(6deg)',
      seatsAvailable: 16,
      sweetSpotRating: '사운드 밸런스 최상 · 조망 최적',
    },
  };

  const currentInfo = rowDetails[selectedRow];

  return (
    <section id="seat-simulator" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="text-[#C2A878] text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5" />
          <span>SEAT PERSPECTIVE SIMULATOR</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#EAECEF] mb-4">
          상영관 명당 좌석 사전 3D 체험
        </h2>
        <p className="text-[#9499A6] text-sm sm:text-base leading-relaxed">
          예매 전 A열(전열 몰입), G열(골든 에리어), M열(후열 음향 명당)에서 바라본 실제 스크린 시야각과 원근감을 3D 렌더로 미리 확인하세요.
        </p>
      </div>

      {/* UX Inspector Callout */}
      {inspectorMode && (
        <div className="mb-8 p-4 rounded-2xl text-left text-xs bg-[#181A20] border border-white/15 text-[#EAECEF] animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[#C2A878] text-[10px]">
              SEAT SIMULATOR UX 분석
            </span>
            <span>[As-Is: 2D 평면도만 보고 예매 포기] ➔ [To-Be: 열별 3D 시야각 체험으로 잔여석 가치 증대]</span>
          </div>
          <p className="leading-relaxed text-[#9499A6]">
            기존 영화관 앱에서는 G열(골든존)이 매진되면 유저가 예매를 이탈하는 문제가 컸습니다.
            이를 극복하기 위해 전열 A열의 압도적 시야 충만감과 후열 M열의 서라운드 음향 특장점을 3D 투시도로 직접 시각화하여
            타 열의 예매 전환율을 끌어올리도록 기획했습니다.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Seat Row Selection Buttons (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {(['A', 'G', 'M'] as SeatRow[]).map((row) => {
            const info = rowDetails[row];
            const isSelected = selectedRow === row;
            return (
              <button
                key={row}
                onClick={() => setSelectedRow(row)}
                className={`p-5 rounded-2xl text-left transition-colors relative overflow-hidden border ${
                  isSelected
                    ? 'bg-white/[0.06] border-[#B82935]'
                    : 'bg-[#181A20] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Armchair
                      className={`w-5 h-5 shrink-0 ${isSelected ? 'text-[#C2A878]' : 'text-[#9499A6]'}`}
                    />
                    <span className="font-extrabold text-base text-[#EAECEF] truncate">{info.title}</span>
                  </div>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded border shrink-0 ${info.badgeColor}`}>
                    {info.badge}
                  </span>
                </div>
                <p className="text-xs text-[#9499A6] leading-relaxed mb-3">{info.description}</p>
                <div className="flex items-center justify-between text-[11px] font-medium pt-2 border-t border-white/10">
                  <span className="text-[#9499A6]">{info.sweetSpotRating}</span>
                  <span className={`font-bold tabular-nums ${info.seatsAvailable <= 5 ? 'text-[#C2A878]' : 'text-[#EAECEF]'}`}>
                    잔여 {info.seatsAvailable}석
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 3D Perspective Viewport Stage (8 Cols) */}
        <div className="lg:col-span-8 glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-[#EAECEF]">{currentInfo.title} 시야각 시뮬레이션</span>
            </div>
            <span className="text-xs text-[#9499A6] font-mono">3D Perspective Render</span>
          </div>

          {/* Perspective Container */}
          <div className="relative w-full aspect-video bg-[#101114] rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center p-6 perspective-stage">
            {/* Simulated Curved IMAX Screen with Movie Motion Frame */}
            <div
              className="w-full h-full rounded-t-2xl border-t-2 border-[#C2A878]/60 transition-all duration-700 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden"
              style={{
                transform: currentInfo.perspectiveStyle,
                backgroundImage: `linear-gradient(to bottom, rgba(16, 17, 20, 0.45), rgba(16, 17, 20, 0.85)), url('/src/assets/images/hero_cinematic_blockbuster_1794209491695.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#101114] via-transparent to-[#101114]/40 pointer-events-none" />
              <span className="text-xs font-mono text-[#C2A878] tracking-widest uppercase mb-1 relative z-10">
                {brand.name} IMAX CURVED SCREEN (GT)
              </span>
              <span className="text-sm font-bold text-[#EAECEF] max-w-md relative z-10">
                {currentInfo.description}
              </span>
            </div>

            {/* Cinema Row Floor Indicators */}
            <div className="w-full h-10 bg-gradient-to-t from-[#181A20] to-transparent mt-2 flex items-center justify-center space-x-4">
              <div
                className={`w-10 h-2 rounded transition-all ${
                  selectedRow === 'A' ? 'bg-[#B82935] scale-110' : 'bg-white/10'
                }`}
                title="A열"
              />
              <div
                className={`w-14 h-2.5 rounded transition-all ${
                  selectedRow === 'G' ? 'bg-[#B82935] scale-110' : 'bg-white/10'
                }`}
                title="G열 (골든존)"
              />
              <div
                className={`w-10 h-2 rounded transition-all ${
                  selectedRow === 'M' ? 'bg-[#B82935] scale-110' : 'bg-white/10'
                }`}
                title="M열"
              />
            </div>
          </div>

          {/* Row Reserve Action Bar */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#9499A6]">
              <CheckCircle2 className="w-4 h-4 text-[#C2A878]" />
              <span>
                선택 좌석: <strong className="text-[#EAECEF]">{selectedRow}열 중앙석</strong> ({currentInfo.seatsAvailable}석 예매 가능)
              </span>
            </div>
            <button
              onClick={() => onOpenBookingWithSeat(selectedRow)}
              className="w-full sm:w-auto px-6 py-3 bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] text-xs sm:text-sm font-bold rounded-xl border border-white/10 transition-colors active:scale-95"
            >
              {selectedRow}열 명당으로 예매 진행 ➔
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
