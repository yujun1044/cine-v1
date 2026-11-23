import React from 'react';
import { BrandConfig } from '../types';

interface FooterProps {
  brand: BrandConfig;
  onOpenDesignSpec: () => void;
}

export const Footer: React.FC<FooterProps> = ({ brand, onOpenDesignSpec }) => {
  return (
    <footer className="bg-[#101114] border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 text-xs text-[#9499A6]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-[#B82935] rounded-md flex items-center justify-center font-black text-xs text-[#EAECEF] border border-white/10">
              {brand.shortCode}
            </div>
            <div className="font-extrabold text-[#EAECEF] text-base tracking-wide">
              {brand.name} SPECIAL THEATER
            </div>
          </div>
          <p className="leading-relaxed text-[#9499A6]">
            {brand.name} 특별관(IMAX, 4DX, SCREENX, PRIVATE BOX)의 차세대 관람 경험을 미리 탐색하고 최적의 명당을 선택할 수 있는 시네마틱 인터랙티브 쇼룸 프로토타입입니다.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <div className="font-bold text-[#EAECEF] mb-2">특별관 빠른 안내</div>
          <ul className="space-y-1.5 text-[#9499A6]">
            <li>
              <a href="#hero" className="hover:text-[#EAECEF] transition-colors">
                IMAX 4K Laser 상영관
              </a>
            </li>
            <li>
              <a href="#hero" className="hover:text-[#EAECEF] transition-colors">
                4DX 12축 모션관
              </a>
            </li>
            <li>
              <a href="#hero" className="hover:text-[#EAECEF] transition-colors">
                SCREENX 270° 파노라마
              </a>
            </li>
            <li>
              <a href="#pricing-matrix" className="hover:text-[#C2A878] transition-colors">
                PRIVATE BOX VIP 스위트
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <div className="font-bold text-[#EAECEF] mb-2">고객 안심 규정</div>
          <ul className="space-y-1.5 text-[#9499A6]">
            <li>상영 20분 전까지 취소 수수료 0원</li>
            <li>스마트 모바일 티켓 즉시 발권 시스템</li>
            <li>특별관 전용 무비패스 수시 적립</li>
            <li>Dolby Atmos 64채널 음향 보증관</li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <div className="font-bold text-[#EAECEF] mb-2">UX 기획 의도 및 규격</div>
          <p className="leading-relaxed text-[#9499A6] mb-3">
            Pretendard Font · Charcoal Dark (#101114) · Deep Crimson (#B82935) · Champagne Gold (#C2A878)
          </p>
          <button
            onClick={onOpenDesignSpec}
            className="text-[#C2A878] hover:text-[#EAECEF] font-bold underline transition-colors"
          >
            기획 의도 & 디자인 시스템 명세서 열기 ➔
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 text-center flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#9499A6] gap-2">
        <span>© {brand.name} Cinematic Showroom. All rights reserved.</span>
        <span className="text-[#9499A6] font-mono">Senior Cinema UX/UI Design System</span>
      </div>
    </footer>
  );
};
