import React from 'react';
import { BookOpen, X, Palette, CheckCircle2, Lightbulb, Target } from 'lucide-react';
import { BrandConfig } from '../types';

interface DesignSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandConfig;
}

export const DesignSpecModal: React.FC<DesignSpecModalProps> = ({
  isOpen,
  onClose,
  brand,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#101114]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181A20] w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9499A6] hover:text-[#EAECEF] p-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-white/10">
          <BookOpen className="w-6 h-6 text-[#C2A878]" />
          <div>
            <h2 className="text-xl font-black text-[#EAECEF]">
              특별관 몰입형 쇼룸 UX 기획서 & 디자인 시스템 명세
            </h2>
            <p className="text-xs text-[#9499A6]">
              시네마틱 인터랙티브 프로토타입 · {brand.name} 특별관 몰입형 쇼룸
            </p>
          </div>
        </div>

        <div className="space-y-6 text-xs text-[#9499A6] leading-relaxed">
          {/* Section 1: Project Objective */}
          <div className="p-4 rounded-2xl bg-[#101114] border border-white/10">
            <h3 className="text-sm font-bold text-[#EAECEF] flex items-center gap-1.5 mb-2">
              <Target className="w-4 h-4 text-[#C2A878]" />
              <span>1. 프로젝트 배경 및 브랜드 아이덴티티</span>
            </h3>
            <p className="mb-2 text-[#EAECEF]/90">
              본 프로젝트는 관객에게 영화관 특별관(IMAX, 4DX, SCREENX, PRIVATE BOX)의 압도적인 몰입 가치를 사전에 전달하고 최적의 명당을 선택할 수 있도록 설계된 인터랙티브 쇼룸 프로토타입입니다.
              독창적이고 혁신적인 차세대 시네마 브랜드 <strong className="text-[#EAECEF]">[{brand.name}]</strong>(Cinematic Vision)의 비주얼 아이덴티티를 바탕으로 구현되었습니다.
            </p>
            <p className="text-[#9499A6]">
              상단 헤더의 브랜드 스위처를 통해 다양한 시네마 브랜드(CINE V, CINEVERSE, V-CINEMA, CINE NOVA 등)로 실시간 전환할 수 있는 반응형 커스텀 아키텍처를 지원합니다.
            </p>
          </div>

          {/* Section 2: As-Is vs To-Be Strategy */}
          <div className="p-4 rounded-2xl bg-[#101114] border border-white/10">
            <h3 className="text-sm font-bold text-[#EAECEF] flex items-center gap-1.5 mb-3">
              <Lightbulb className="w-4 h-4 text-[#C2A878]" />
              <span>2. 핵심 UX 문제 해결 (As-Is vs To-Be)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-[#181A20] border border-white/10">
                <div className="font-bold text-[#EAECEF] mb-1">기존 영화관 사이트의 페인포인트 (As-Is)</div>
                <ul className="space-y-1 text-[#9499A6] list-disc list-inside">
                  <li>무분별한 팝업 배너로 첫인상 피로도 가중</li>
                  <li>IMAX 1.90:1 등 수치 표기만 있어 티켓값 가치 체감 난해</li>
                  <li>특별관 정보가 분산되어 포맷 간 비교 어려움</li>
                  <li>G열(골든존) 매진 시 관객의 예매 이탈률 급증</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-[#181A20] border border-white/10">
                <div className="font-bold text-[#C2A878] mb-1">본 프로토타입의 혁신 솔루션 (To-Be)</div>
                <ul className="space-y-1 text-[#9499A6] list-disc list-inside">
                  <li>시네마틱 앰비언트 루프 & 실시간 포맷 스위처 독</li>
                  <li>드래그 슬라이더로 26% 잘려나가는 시야 직관적 비교</li>
                  <li>12-컬럼 비대칭 벤토 그리드로 4대 핵심 테크 통합 쇼케이스</li>
                  <li>A/G/M열 3D 시야각 시뮬레이터로 전열·후열 매력 입증</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Design System Tokens */}
          <div className="p-4 rounded-2xl bg-[#101114] border border-white/10">
            <h3 className="text-sm font-bold text-[#EAECEF] flex items-center gap-1.5 mb-3">
              <Palette className="w-4 h-4 text-[#C2A878]" />
              <span>3. 디자인 시스템 규격 (Design Tokens)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="p-2.5 rounded-xl bg-[#101114] border border-white/10">
                <div className="text-[10px] text-[#9499A6]">Charcoal Dark</div>
                <div className="font-mono font-bold text-[#EAECEF]">#101114</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#181A20] border border-white/10">
                <div className="text-[10px] text-[#9499A6]">Card Surface</div>
                <div className="font-mono font-bold text-[#EAECEF]">#181A20</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#B82935] border border-white/10 text-[#EAECEF]">
                <div className="text-[10px] text-[#EAECEF]/80">Deep Crimson</div>
                <div className="font-mono font-bold">#B82935</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#C2A878] border border-white/10 text-[#101114]">
                <div className="text-[10px] text-[#101114]/80">Champagne Gold</div>
                <div className="font-mono font-bold">#C2A878</div>
              </div>
            </div>

            <div className="space-y-1 text-[#9499A6] text-[11px]">
              <div><strong className="text-[#EAECEF]">타이포그래피:</strong> Pretendard Variable (가독성 및 국문 자간 최적화)</div>
              <div><strong className="text-[#EAECEF]">원근 연출:</strong> CSS 3D Stage (perspective: 900px, perspective-origin: 50% 60%)</div>
              <div><strong className="text-[#EAECEF]">인터랙션:</strong> Web Audio API 합성 사운드 + Canvas 오디오 파형 렌더러</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] font-bold text-xs rounded-xl transition-colors border border-white/10"
          >
            기획서 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
