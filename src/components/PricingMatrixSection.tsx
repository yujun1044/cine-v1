import React, { useState } from 'react';
import { Sparkles, Users, Crown, ArrowRight, Eye, Check } from 'lucide-react';
import { TheaterFormat, BrandConfig } from '../types';

interface PricingMatrixSectionProps {
  brand: BrandConfig;
  onOpenBooking: (format?: string) => void;
  inspectorMode: boolean;
}

export const PricingMatrixSection: React.FC<PricingMatrixSectionProps> = ({
  brand,
  onOpenBooking,
  inspectorMode,
}) => {
  const [audienceFilter, setAudienceFilter] = useState<'solo' | 'couple' | 'family'>('couple');
  const [experienceFilter, setExperienceFilter] = useState<'visual' | 'sensory' | 'vip'>('visual');
  const [showVipModal, setShowVipModal] = useState<boolean>(false);

  // Compute recommendation
  const getRecommendation = (): { format: TheaterFormat; title: string; desc: string } => {
    if (experienceFilter === 'vip') {
      return {
        format: 'privatebox',
        title: 'PRIVATE BOX VIP 스위트',
        desc: '독립된 전용 공간과 최고급 리클라이너, 프리미엄 웰컴 패키지로 누리는 럭셔리 관람',
      };
    }
    if (experienceFilter === 'sensory') {
      return {
        format: '4dx',
        title: '4DX 오감 모션관',
        desc: '역동적인 12축 모션시트와 워터, 윈드, 안개 환경 특수효과로 생동감 극대화',
      };
    }
    if (audienceFilter === 'family') {
      return {
        format: 'screenx',
        title: 'SCREENX 270° 파노라마관',
        desc: '좌우 3면으로 넓게 펼쳐지는 시야로 남녀노소 누구나 시각적 감동을 나누기 적합',
      };
    }
    return {
      format: 'imax',
      title: 'IMAX LASER 3D',
      desc: '26% 더 넓은 화각과 듀얼 4K 레이저의 압도적 명암비로 영화 본연의 스케일 체감',
    };
  };

  const currentRec = getRecommendation();

  return (
    <section id="pricing-matrix" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="text-[#C2A878] text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRANSPARENT PRICING & MATRIX</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#EAECEF] mb-4">
          맞춤 특별관 진단 & 요금 매트릭스
        </h2>
        <p className="text-[#9499A6] text-sm sm:text-base leading-relaxed">
          관람 대상과 선호하는 몰입 취향을 선택하면 실시간으로 최적의 포맷을 추천하고 투명한 스펙을 비교해드립니다.
        </p>
      </div>

      {/* UX Inspector Callout */}
      {inspectorMode && (
        <div className="mb-8 p-4 rounded-2xl text-left text-xs bg-[#181A20] border border-white/15 text-[#EAECEF] animate-in fade-in">
          <div className="flex items-center space-x-2 font-bold mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[#C2A878] text-[10px]">
              PRICING MATRIX UX 분석
            </span>
            <span>[As-Is: 티켓 가격만 단순 나열] ➔ [To-Be: 유저 맞춤형 2스텝 진단 + 가치 체감 매트릭스]</span>
          </div>
          <p className="leading-relaxed text-[#9499A6]">
            특별관 가격 저항을 줄이기 위해, 관람 인원(혼자/데이트/가족)과 원하는 관람 경험(대화면/오감/VIP)에 따른
            알고리즘 추천 박스를 상단에 제공하고, 매트릭스 표에 실시간 하이라이트를 연동해 구매 결정을 유도합니다.
          </p>
        </div>
      )}

      {/* Interactive Recommendation Filter Box */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl mb-10 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Question 1 */}
          <div>
            <label className="block text-xs font-bold text-[#EAECEF] mb-2.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#C2A878]" />
              <span>누구와 관람하시나요?</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setAudienceFilter('solo')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  audienceFilter === 'solo'
                    ? 'bg-[#B82935] border-[#B82935] text-[#EAECEF]'
                    : 'bg-[#101114] border-white/10 text-[#9499A6] hover:text-[#EAECEF] hover:border-white/20'
                }`}
              >
                혼자 관람
              </button>
              <button
                onClick={() => setAudienceFilter('couple')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  audienceFilter === 'couple'
                    ? 'bg-[#B82935] border-[#B82935] text-[#EAECEF]'
                    : 'bg-[#101114] border-white/10 text-[#9499A6] hover:text-[#EAECEF] hover:border-white/20'
                }`}
              >
                커플/데이트
              </button>
              <button
                onClick={() => setAudienceFilter('family')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  audienceFilter === 'family'
                    ? 'bg-[#B82935] border-[#B82935] text-[#EAECEF]'
                    : 'bg-[#101114] border-white/10 text-[#9499A6] hover:text-[#EAECEF] hover:border-white/20'
                }`}
              >
                가족/친구
              </button>
            </div>
          </div>

          {/* Question 2 */}
          <div>
            <label className="block text-xs font-bold text-[#EAECEF] mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C2A878]" />
              <span>원하는 관람 경험</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setExperienceFilter('visual')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  experienceFilter === 'visual'
                    ? 'bg-[#B82935] border-[#B82935] text-[#EAECEF]'
                    : 'bg-[#101114] border-white/10 text-[#9499A6] hover:text-[#EAECEF] hover:border-white/20'
                }`}
              >
                압도적 대화면
              </button>
              <button
                onClick={() => setExperienceFilter('sensory')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  experienceFilter === 'sensory'
                    ? 'bg-[#B82935] border-[#B82935] text-[#EAECEF]'
                    : 'bg-[#101114] border-white/10 text-[#9499A6] hover:text-[#EAECEF] hover:border-white/20'
                }`}
              >
                오감 모션
              </button>
              <button
                onClick={() => setExperienceFilter('vip')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors border ${
                  experienceFilter === 'vip'
                    ? 'bg-[#B82935] border-[#B82935] text-[#EAECEF]'
                    : 'bg-[#101114] border-white/10 text-[#9499A6] hover:text-[#EAECEF] hover:border-white/20'
                }`}
              >
                최상급 VIP
              </button>
            </div>
          </div>
        </div>

        {/* Diagnostic Output */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#9499A6]">맞춤 진단 결과:</span>
            <span className="font-black text-[#C2A878] text-sm flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#C2A878]" />
              {currentRec.title}
            </span>
          </div>
          <span className="text-[#9499A6]">{currentRec.desc}</span>
        </div>
      </div>

      {/* Pricing Matrix Table Container */}
      <div className="glass-card rounded-3xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="border-b border-white/10 bg-[#14151A] text-xs font-bold uppercase text-[#9499A6] tracking-wider">
              <th className="p-5">특별관 포맷</th>
              <th className="p-5">평균 관람료</th>
              <th className="p-5">화면 비율</th>
              <th className="p-5">핵심 특수효과</th>
              <th className="p-5">추천 관람 장르</th>
              <th className="p-5 text-right">선택</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {/* Row 1: IMAX */}
            <tr
              className={`transition-colors ${
                currentRec.format === 'imax'
                  ? 'bg-white/[0.04]'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <td className="p-5 font-black text-[#EAECEF]">
                <div className="flex items-center space-x-2">
                  <span>IMAX LASER</span>
                  {currentRec.format === 'imax' && (
                    <span className="text-[10px] bg-[rgba(255,255,255,0.06)] border border-[#C2A878]/50 text-[#C2A878] px-2 py-0.5 rounded font-bold">
                      현재 맞춤 추천
                    </span>
                  )}
                </div>
              </td>
              <td className="p-5 font-extrabold text-[#C2A878] tabular-nums">22,000원</td>
              <td className="p-5 text-[#9499A6] font-mono text-xs">1.90:1 (26% 시야 확장)</td>
              <td className="p-5 text-[#9499A6] text-xs">4K Dual Laser & 12ch 입체 음향</td>
              <td className="p-5 text-[#9499A6] text-xs">SF, 블록버스터, 대작 영화</td>
              <td className="p-5 text-right">
                <button
                  onClick={() => onOpenBooking('IMAX LASER 3D')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors active:scale-95 border ${
                    currentRec.format === 'imax'
                      ? 'bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] border-white/10'
                      : 'bg-[#101114] border-white/10 hover:border-white/25 text-[#EAECEF]'
                  }`}
                >
                  예매하기
                </button>
              </td>
            </tr>

            {/* Row 2: 4DX */}
            <tr
              className={`transition-colors ${
                currentRec.format === '4dx'
                  ? 'bg-white/[0.04]'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <td className="p-5 font-black text-[#EAECEF]">
                <div className="flex items-center space-x-2">
                  <span>4DX MOTION</span>
                  {currentRec.format === '4dx' && (
                    <span className="text-[10px] bg-[rgba(255,255,255,0.06)] border border-[#C2A878]/50 text-[#C2A878] px-2 py-0.5 rounded font-bold">
                      현재 맞춤 추천
                    </span>
                  )}
                </div>
              </td>
              <td className="p-5 font-extrabold text-[#C2A878] tabular-nums">21,000원</td>
              <td className="p-5 text-[#9499A6] font-mono text-xs">2.39:1 (일반 규격)</td>
              <td className="p-5 text-[#9499A6] text-xs">12축 모션시트 + 바람·물·향기 환경 효과</td>
              <td className="p-5 text-[#9499A6] text-xs">액션, 애니메이션, 카체이싱</td>
              <td className="p-5 text-right">
                <button
                  onClick={() => onOpenBooking('4DX MOTION')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors active:scale-95 border ${
                    currentRec.format === '4dx'
                      ? 'bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] border-white/10'
                      : 'bg-[#101114] border-white/10 hover:border-white/25 text-[#EAECEF]'
                  }`}
                >
                  예매하기
                </button>
              </td>
            </tr>

            {/* Row 3: SCREENX */}
            <tr
              className={`transition-colors ${
                currentRec.format === 'screenx'
                  ? 'bg-white/[0.04]'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <td className="p-5 font-black text-[#EAECEF]">
                <div className="flex items-center space-x-2">
                  <span>SCREENX</span>
                  {currentRec.format === 'screenx' && (
                    <span className="text-[10px] bg-[rgba(255,255,255,0.06)] border border-[#C2A878]/50 text-[#C2A878] px-2 py-0.5 rounded font-bold">
                      현재 맞춤 추천
                    </span>
                  )}
                </div>
              </td>
              <td className="p-5 font-extrabold text-[#C2A878] tabular-nums">18,000원</td>
              <td className="p-5 text-[#9499A6] font-mono text-xs">270° 3면 파노라마</td>
              <td className="p-5 text-[#9499A6] text-xs">좌/우 벽면 연동 프로젝션 3면 화각</td>
              <td className="p-5 text-[#9499A6] text-xs">콘서트 실황, 뮤지컬, 마블 영화</td>
              <td className="p-5 text-right">
                <button
                  onClick={() => onOpenBooking('SCREENX 270°')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors active:scale-95 border ${
                    currentRec.format === 'screenx'
                      ? 'bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] border-white/10'
                      : 'bg-[#101114] border-white/10 hover:border-white/25 text-[#EAECEF]'
                  }`}
                >
                  예매하기
                </button>
              </td>
            </tr>

            {/* Row 4: PRIVATE BOX */}
            <tr
              className={`transition-colors ${
                currentRec.format === 'privatebox'
                  ? 'bg-white/[0.04]'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <td className="p-5 font-black text-[#EAECEF]">
                <div className="flex items-center space-x-2">
                  <span>PRIVATE BOX</span>
                  <span className="text-[10px] bg-[rgba(255,255,255,0.06)] text-[#C2A878] px-1.5 py-0.5 rounded font-bold border border-white/10">
                    VIP 독립관
                  </span>
                  {currentRec.format === 'privatebox' && (
                    <span className="text-[10px] bg-[rgba(255,255,255,0.06)] border border-[#C2A878]/50 text-[#C2A878] px-2 py-0.5 rounded font-bold">
                      현재 맞춤 추천
                    </span>
                  )}
                </div>
              </td>
              <td className="p-5 font-extrabold text-[#C2A878] tabular-nums">
                50,000원 <span className="text-[11px] font-normal text-[#9499A6]">(1인)</span>
              </td>
              <td className="p-5 text-[#9499A6] font-mono text-xs">프라이빗 가변관</td>
              <td className="p-5 text-[#9499A6] text-xs">
                전용 라운지 & 리클라이너 & B&O 하이엔드 음향
              </td>
              <td className="p-5 text-[#9499A6] text-xs">기념일, 비즈니스 접대, VIP 파티</td>
              <td className="p-5 text-right space-x-2">
                <button
                  onClick={() => setShowVipModal(true)}
                  className="px-3 py-2 bg-[rgba(255,255,255,0.06)] hover:bg-white/10 border border-white/10 text-[#EAECEF] text-xs font-bold rounded-xl transition-colors"
                  title="VIP 룸 미리보기"
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1 text-[#C2A878]" />
                  투어
                </button>
                <button
                  onClick={() => onOpenBooking('PRIVATE BOX VIP')}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors active:scale-95 border ${
                    currentRec.format === 'privatebox'
                      ? 'bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] border-white/10'
                      : 'bg-[#101114] border-white/10 hover:border-white/25 text-[#EAECEF]'
                  }`}
                >
                  예매하기
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Private Box VIP Suite Modal */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 bg-[#101114]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#181A20] max-w-2xl w-full rounded-3xl overflow-hidden border border-white/10 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowVipModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#101114]/80 hover:bg-[#101114] border border-white/10 text-[#EAECEF] flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="relative aspect-video w-full">
              <img
                src="/src/assets/images/private_box_vip_lounge_1794209493890.jpg"
                alt="Private Box VIP Suite"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181A20] via-[#101114]/40 to-transparent flex items-end p-6">
                <div>
                  <span className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.06)] backdrop-blur-md border border-white/15 text-[#C2A878] font-bold text-xs">
                    {brand.name} PRIVATE BOX VIP
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#EAECEF] mt-2">
                    단 한 팀만을 위한 프라이빗 시네마틱 스위트
                  </h3>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                <div className="p-3 rounded-xl bg-[#101114] border border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C2A878]" />
                  <span className="text-[#EAECEF]">최고급 전동 리클라이너 소파</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101114] border border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C2A878]" />
                  <span className="text-[#EAECEF]">뱅앤올룹슨 독립 하이엔드 음향</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101114] border border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C2A878]" />
                  <span className="text-[#EAECEF]">웰컴 드링크 및 스낵 케이터링</span>
                </div>
                <div className="p-3 rounded-xl bg-[#101114] border border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C2A878]" />
                  <span className="text-[#EAECEF]">전용 라운지 사전 대기 서비스</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <span className="text-xs text-[#9499A6]">1인 이용 기준</span>
                  <div className="text-xl font-black text-[#C2A878] tabular-nums">50,000원</div>
                </div>
                <button
                  onClick={() => {
                    setShowVipModal(false);
                    onOpenBooking('PRIVATE BOX VIP');
                  }}
                  className="px-6 py-3 bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] font-extrabold text-xs rounded-xl border border-white/10 transition-colors"
                >
                  프라이빗 박스 예약 진행 ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
