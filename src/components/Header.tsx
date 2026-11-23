import React, { useState } from 'react';
import { Ticket, Sparkles, SlidersHorizontal, BookOpen, Check, Film } from 'lucide-react';
import { BrandConfig } from '../types';
import { BRAND_PRESETS } from '../data/brands';

interface HeaderProps {
  brand: BrandConfig;
  onUpdateBrand: (newBrand: BrandConfig) => void;
  inspectorMode: boolean;
  onToggleInspector: () => void;
  onOpenBooking: (format?: string) => void;
  onOpenBookingsList: () => void;
  hasBookings: boolean;
  onOpenDesignSpec: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  brand,
  onUpdateBrand,
  inspectorMode,
  onToggleInspector,
  onOpenBooking,
  onOpenBookingsList,
  hasBookings,
  onOpenDesignSpec,
}) => {
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [customBrandName, setCustomBrandName] = useState('');

  const brandPresetsList = Object.values(BRAND_PRESETS);

  const handleApplyPreset = (preset: BrandConfig) => {
    onUpdateBrand(preset);
    setShowBrandModal(false);
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customBrandName.trim()) {
      const trimmed = customBrandName.trim();
      onUpdateBrand({
        id: `custom_${Date.now()}`,
        name: trimmed,
        shortCode: trimmed.slice(0, 2).toUpperCase(),
        tagline: 'SPECIAL THEATER',
        theme: brand.theme || 'red',
        accentColor: brand.accentColor || '#B82935',
        featuredMovie: {
          title: `<${trimmed} 특별 상영작: 블록버스터 PLF>`,
          badge: '실시간 상영작 1위',
          image: brand.featuredMovie.image,
          subhead: `${trimmed}의 압도적인 스케일과 최첨단 시청각 테크놀로지로 최고의 감동을 선사합니다.`,
        },
        branches: [
          `${trimmed} 용산 플래그십`,
          `${trimmed} 강남 센트럴`,
          `${trimmed} 판교 메가관`,
          `${trimmed} 송도 센트럴`,
        ],
      });
      setShowBrandModal(false);
      setCustomBrandName('');
    }
  };

  // Dynamic Theme Colors (Restrained, no neon glow)
  const getThemeAccentClass = () => {
    switch (brand.theme) {
      case 'purple':
        return 'bg-[#5A4D7D] border-white/10';
      case 'emerald':
        return 'bg-[#256353] border-white/10';
      case 'amber':
        return 'bg-[#C2A878] text-[#101114] border-white/10';
      default:
        return 'bg-[#B82935] border-white/10';
    }
  };

  const getThemeDotClass = () => {
    switch (brand.theme) {
      case 'purple':
        return 'bg-[#7B68A6]';
      case 'emerald':
        return 'bg-[#2E7D67]';
      case 'amber':
        return 'bg-[#C2A878]';
      default:
        return 'bg-[#B82935]';
    }
  };

  const getCtaButtonClass = () => {
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
    <>
      <header className="fixed top-0 left-0 w-full z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          {/* Brand Zone */}
          <div
            onClick={() => setShowBrandModal(true)}
            className="flex items-center space-x-3 group shrink-0 cursor-pointer"
            title="클릭하여 영화관 브랜드 & 테마 전환"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-2xl tracking-tighter text-[#EAECEF] transform group-hover:scale-105 transition-transform border ${getThemeAccentClass()}`}
            >
              {brand.shortCode}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider text-[#EAECEF] whitespace-nowrap">
                {brand.name}
              </span>
              <span className="text-[10px] text-[#9499A6] tracking-widest uppercase font-semibold whitespace-nowrap">
                {brand.tagline}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold tracking-wide">
            <a href="#hero" className="text-[#9499A6] hover:text-[#EAECEF] transition-colors whitespace-nowrap py-1">
              홈
            </a>
            <a href="#format-comparison" className="text-[#9499A6] hover:text-[#EAECEF] transition-colors whitespace-nowrap py-1">
              포맷 비교
            </a>
            <a href="#bento-grid" className="text-[#9499A6] hover:text-[#EAECEF] transition-colors whitespace-nowrap py-1">
              특별관 테크
            </a>
            <a href="#seat-simulator" className="text-[#9499A6] hover:text-[#EAECEF] transition-colors whitespace-nowrap py-1">
              명당 시야각
            </a>
            <a href="#pricing-matrix" className="text-[#9499A6] hover:text-[#EAECEF] transition-colors whitespace-nowrap py-1">
              요금 매트릭스
            </a>
          </nav>

          {/* Action Zone */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* UX Inspector Mode Toggle Button */}
            <button
              onClick={onToggleInspector}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-colors flex items-center space-x-1.5 border active:scale-95 shrink-0 ${
                inspectorMode
                  ? 'bg-white/[0.1] text-[#EAECEF] border-[#C2A878]/60'
                  : 'bg-white/[0.06] hover:bg-white/[0.1] text-[#9499A6] hover:text-[#EAECEF] border-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C2A878]" />
              <span className="whitespace-nowrap">
                기획 의도 분석 [{inspectorMode ? 'ON' : 'OFF'}]
              </span>
            </button>

            {/* Design Spec Modal Trigger */}
            <button
              onClick={onOpenDesignSpec}
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#9499A6] hover:text-[#EAECEF] px-3 py-2 rounded-xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.1] transition-colors shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C2A878]" />
              <span>기획서</span>
            </button>

            {/* Booking Action Button (Primary CTA) */}
            <button
              onClick={() => (hasBookings ? onOpenBookingsList() : onOpenBooking('IMAX LASER 3D'))}
              className={`px-4 py-2.5 rounded-xl transition-colors text-xs sm:text-sm font-bold flex items-center space-x-1.5 relative border border-white/10 shrink-0 ${getCtaButtonClass()}`}
            >
              <Ticket className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{hasBookings ? '예매 내역 확인' : '빠른 예매'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating UX Inspector Banner when activated */}
      {inspectorMode && (
        <div className="fixed top-20 left-0 w-full bg-[#181A20]/95 border-b border-white/10 text-[#EAECEF] text-xs py-2 px-4 z-40 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[#C2A878] font-bold text-[10px] shrink-0">
                10년차 UX/UI 디자이너 분석 모드
              </span>
              <span className="truncate text-[#9499A6]">
                각 섹션마다 <strong className="text-[#EAECEF]">[As-Is 기존 영화관의 문제점]</strong> vs <strong className="text-[#EAECEF]">[To-Be 리뉴얼 전략 및 기대효과]</strong> 주석 카드가 표시됩니다.
              </span>
            </div>
            <button
              onClick={onToggleInspector}
              className="text-[#9499A6] hover:text-[#EAECEF] font-bold underline text-[11px] shrink-0"
            >
              닫기 ✕
            </button>
          </div>
        </div>
      )}

      {/* Brand & Cinema Site Switcher Modal */}
      {showBrandModal && (
        <div className="fixed inset-0 z-50 bg-[#101114]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#181A20] max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getThemeDotClass()}`} />
                <h3 className="text-lg font-black text-[#EAECEF]">영화관 브랜드 & 상영작 테마 전환</h3>
              </div>
              <button
                onClick={() => setShowBrandModal(false)}
                className="text-[#9499A6] hover:text-[#EAECEF] p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#9499A6] mb-5 leading-relaxed">
              선택하는 영화관 브랜드에 따라 <strong className="text-[#EAECEF]">대표 상영작, 배경 비주얼, 시그니처 테마 컬러, 지점 목록</strong>이 전면 변경되어 완전히 새로운 영화관 사이트로 전환됩니다.
            </p>

            {/* 4 Distinct Cinema Site Visual Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {brandPresetsList.map((preset) => {
                const isSelected = brand.name === preset.name;

                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`rounded-2xl border cursor-pointer transition-colors p-3.5 relative overflow-hidden flex flex-col justify-between group ${
                      isSelected
                        ? 'border-[#B82935] bg-white/[0.06]'
                        : 'border-white/10 bg-[#101114] hover:border-white/25'
                    }`}
                  >
                    {/* Thumbnail Preview Banner */}
                    <div className="relative w-full h-24 rounded-xl overflow-hidden mb-3 border border-white/10">
                      <img
                        src={preset.featuredMovie.image}
                        alt={preset.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#101114]/90 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-extrabold text-[#EAECEF] truncate">
                          {preset.featuredMovie.title}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#181A20]/90 border border-[#C2A878]/60 text-[#C2A878] font-bold text-[9px] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>적용 중</span>
                        </div>
                      )}
                    </div>

                    {/* Brand Info */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-5 h-5 rounded-md flex items-center justify-center font-black text-xs text-[#EAECEF]"
                            style={{ backgroundColor: preset.accentColor }}
                          >
                            {preset.shortCode}
                          </span>
                          <span className="font-black text-base text-[#EAECEF]">{preset.name}</span>
                        </div>
                        <span className="text-[10px] text-[#9499A6] font-mono">{preset.tagline}</span>
                      </div>
                      <div className="text-[11px] text-[#9499A6] font-medium truncate mb-2">
                        {preset.featuredMovie.badge}
                      </div>
                      <div className="text-[10px] text-[#9499A6]/80 truncate">
                        대표관: {preset.branches[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Brand Direct Entry Form */}
            <form onSubmit={handleApplyCustom} className="pt-4 border-t border-white/10">
              <span className="text-xs font-bold text-[#EAECEF] block mb-2">
                또는 원하는 브랜드명을 직접 입력:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="예: CINE NOVA, 시네마틱스"
                  value={customBrandName}
                  onChange={(e) => setCustomBrandName(e.target.value)}
                  className="flex-1 bg-[#101114] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#EAECEF] placeholder-[#9499A6]/60 focus:outline-none focus:border-[#B82935]"
                />
                <button
                  type="submit"
                  disabled={!customBrandName.trim()}
                  className="px-5 py-2.5 bg-[#B82935] hover:bg-[#9E202B] disabled:opacity-40 text-[#EAECEF] text-xs font-bold rounded-xl transition-colors border border-white/10"
                >
                  적용
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
