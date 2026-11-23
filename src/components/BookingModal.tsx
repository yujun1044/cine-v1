import React, { useState } from 'react';
import { Ticket, Calendar, Clock, MapPin, CheckCircle, QrCode, Sparkles, X, ChevronRight, Share2, Download } from 'lucide-react';
import { BookingDetails, BrandConfig } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandConfig;
  initialFormat?: string;
  initialSeatRow?: string;
  onSaveBooking: (booking: BookingDetails) => void;
  existingBookings: BookingDetails[];
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  brand,
  initialFormat = 'IMAX LASER 3D',
  initialSeatRow = 'G',
  onSaveBooking,
  existingBookings,
}) => {
  const [format, setFormat] = useState<string>(initialFormat);
  const [theater, setTheater] = useState<string>(`${brand.name} 용산 플래그십 (IMAX GT관)`);
  const [date, setDate] = useState<string>('오늘 (11월 09일)');
  const [timeSlot, setTimeSlot] = useState<string>('14:20 (잔여 18석)');
  const [seatRow, setSeatRow] = useState<string>(initialSeatRow);
  const [seatNumber, setSeatNumber] = useState<number>(12);
  const [ticketCount, setTicketCount] = useState<number>(2);

  // Completed booking confirmation ticket view
  const [activeTicket, setActiveTicket] = useState<BookingDetails | null>(null);
  const [viewHistory, setViewHistory] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Sync initial props when opened or brand changes
  React.useEffect(() => {
    if (initialFormat) setFormat(initialFormat);
    if (initialSeatRow) setSeatRow(initialSeatRow);
    if (brand.branches?.[0]) setTheater(brand.branches[0]);
  }, [initialFormat, initialSeatRow, brand]);

  if (!isOpen) return null;

  const unitPrice = format.includes('PRIVATE')
    ? 50000
    : format.includes('4DX')
    ? 21000
    : format.includes('SCREENX')
    ? 18000
    : 22000;

  const totalPrice = unitPrice * ticketCount;

  const handleCompleteBooking = () => {
    const newBooking: BookingDetails = {
      id: `${brand.shortCode}-${Date.now().toString().slice(-6)}`,
      format,
      theater,
      date,
      timeSlot: timeSlot.split(' ')[0],
      seatRow,
      seatNumber,
      ticketCount,
      totalPrice,
      bookingTime: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    onSaveBooking(newBooking);
    setActiveTicket(newBooking);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `[${brand.name} 특별관 모바일 티켓] 예매번호: ${activeTicket?.id} | 상영관: ${activeTicket?.theater} | 좌석: ${activeTicket?.seatRow}열 ${activeTicket?.seatNumber}번`
    );
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#101114]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181A20] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#9499A6] hover:text-[#EAECEF] p-1.5 rounded-full hover:bg-white/[0.06] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pr-6">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#B82935]" />
            <h3 className="text-xl font-extrabold text-[#EAECEF]">
              {activeTicket
                ? `${brand.name} 모바일 티켓 발권 완료`
                : viewHistory
                ? `${brand.name} 예매 내역`
                : `${brand.name} 특별관 빠른 예매`}
            </h3>
          </div>

          {!activeTicket && existingBookings.length > 0 && (
            <button
              onClick={() => setViewHistory(!viewHistory)}
              className="text-xs text-[#C2A878] hover:text-[#EAECEF] font-bold underline transition-colors"
            >
              {viewHistory ? '새로 예매하기' : `내 예매 (${existingBookings.length})`}
            </button>
          )}
        </div>

        {/* View 1: Active Ticket Pass */}
        {activeTicket ? (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[#101114] border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] text-[#9499A6] uppercase tracking-widest font-mono">
                    E-TICKET NO. {activeTicket.id}
                  </span>
                  <div className="text-lg font-black text-[#EAECEF]">{brand.name} SPECIAL PASS</div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-white/10 text-[#C2A878] font-bold text-xs">
                  {activeTicket.format}
                </span>
              </div>

              <div className="space-y-3 text-xs mb-5">
                <div className="flex items-center gap-2 text-[#9499A6]">
                  <MapPin className="w-4 h-4 text-[#C2A878] shrink-0" />
                  <span className="font-semibold text-[#EAECEF]">{activeTicket.theater}</span>
                </div>
                <div className="flex items-center gap-2 text-[#9499A6]">
                  <Calendar className="w-4 h-4 text-[#C2A878] shrink-0" />
                  <span>
                    {activeTicket.date} · <strong className="text-[#EAECEF]">{activeTicket.timeSlot}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[#9499A6]">
                  <Ticket className="w-4 h-4 text-[#C2A878] shrink-0" />
                  <span>
                    지정 좌석:{' '}
                    <strong className="text-[#C2A878] font-black text-sm">
                      {activeTicket.seatRow}열 {activeTicket.seatNumber}번
                    </strong>{' '}
                    ({activeTicket.ticketCount}인)
                  </span>
                </div>
              </div>

              {/* QR Code and Barcode Visual Simulation */}
              <div className="pt-4 border-t border-dashed border-white/15 flex flex-col items-center justify-center">
                <div className="p-3 bg-[#EAECEF] rounded-xl mb-2">
                  <QrCode className="w-24 h-24 text-[#101114]" />
                </div>
                <span className="text-[10px] text-[#9499A6] font-mono tracking-widest">
                  스마트 티켓 입장 바코드 · 상영 15분 전 게이트 개방
                </span>
              </div>
            </div>

            {copiedNotification && (
              <div className="text-center text-xs font-bold text-[#C2A878] animate-in fade-in">
                모바일 티켓 정보가 클립보드에 복사되었습니다.
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleShare}
                className="py-3 px-4 rounded-xl bg-[#101114] border border-white/10 hover:border-white/25 text-[#EAECEF] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>티켓 정보 공유</span>
              </button>
              <button
                onClick={() => {
                  setActiveTicket(null);
                  onClose();
                }}
                className="py-3 px-4 rounded-xl bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>확인 완료</span>
              </button>
            </div>
          </div>
        ) : viewHistory ? (
          /* View 2: History List */
          <div className="space-y-4">
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {existingBookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setActiveTicket(b)}
                  className="p-4 rounded-2xl bg-[#101114] border border-white/10 hover:border-white/25 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-black text-[#EAECEF]">{b.format}</div>
                    <div className="text-[11px] text-[#9499A6]">{b.theater}</div>
                    <div className="text-[10px] text-[#C2A878] font-medium">
                      {b.date} · {b.seatRow}열 {b.seatNumber}번 ({b.ticketCount}인)
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9499A6]" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setViewHistory(false)}
              className="w-full py-3 bg-[#101114] hover:bg-white/[0.06] border border-white/10 text-[#EAECEF] font-bold rounded-xl text-xs transition-colors"
            >
              새로운 좌석 예매하기
            </button>
          </div>
        ) : (
          /* View 3: Booking Form */
          <div className="space-y-4">
            {/* Format Selection */}
            <div>
              <label className="block text-xs font-bold text-[#9499A6] mb-1">선택된 특별관 포맷</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#101114] border border-white/10 text-[#EAECEF] text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#B82935]"
              >
                <option value="IMAX LASER 3D">IMAX LASER 3D (22,000원)</option>
                <option value="4DX MOTION">4DX MOTION 오감 모션관 (21,000원)</option>
                <option value="SCREENX 270°">SCREENX 270° 파노라마관 (18,000원)</option>
                <option value="PRIVATE BOX VIP">PRIVATE BOX VIP 전용 스위트 (50,000원)</option>
              </select>
            </div>

            {/* Theater Selection */}
            <div>
              <label className="block text-xs font-bold text-[#9499A6] mb-1">상영관 지점</label>
              <select
                value={theater}
                onChange={(e) => setTheater(e.target.value)}
                className="w-full bg-[#101114] border border-white/10 text-[#EAECEF] text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#B82935]"
              >
                {brand.branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-bold text-[#9499A6] mb-1">관람 일자</label>
              <div className="grid grid-cols-3 gap-2">
                {['오늘 (11월 09일)', '내일 (11월 10일)', '주말 (11월 14일)'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDate(d)}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-colors border ${
                      date === d
                        ? 'bg-[#B82935] border-[#B82935] text-[#EAECEF]'
                        : 'bg-[#101114] text-[#9499A6] border-white/10 hover:border-white/20 hover:text-[#EAECEF]'
                    }`}
                  >
                    {d.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Showtime Selection */}
            <div>
              <label className="block text-xs font-bold text-[#9499A6] mb-1">상영 회차 선택</label>
              <div className="grid grid-cols-3 gap-2">
                {['14:20 (잔여 18석)', '17:10 (잔여 42석)', '20:00 (잔여 08석)'].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-1 text-center rounded-xl text-xs transition-colors border ${
                      timeSlot === slot
                        ? 'bg-[#B82935] border-[#B82935] text-[#EAECEF] font-bold'
                        : 'bg-[#101114] text-[#9499A6] border-white/10 hover:border-white/20 hover:text-[#EAECEF]'
                    }`}
                  >
                    <div className="font-bold tabular-nums">{slot.split(' ')[0]}</div>
                    <div className={`text-[10px] ${timeSlot === slot ? 'text-[#EAECEF]/80' : 'text-[#9499A6]'}`}>
                      {slot.split(' ')[1]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seat & Person Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#9499A6] mb-1">좌석 열 및 번호</label>
                <div className="flex gap-2">
                  <select
                    value={seatRow}
                    onChange={(e) => setSeatRow(e.target.value)}
                    className="flex-1 bg-[#101114] border border-white/10 text-[#EAECEF] text-xs font-bold rounded-xl px-2 py-2"
                  >
                    <option value="A">A열 (전열)</option>
                    <option value="G">G열 (명당★)</option>
                    <option value="M">M열 (후열)</option>
                  </select>
                  <select
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(Number(e.target.value))}
                    className="w-20 bg-[#101114] border border-white/10 text-[#EAECEF] text-xs font-bold rounded-xl px-2 py-2"
                  >
                    {[8, 9, 10, 11, 12, 13, 14, 15].map((n) => (
                      <option key={n} value={n}>
                        {n}번
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#9499A6] mb-1">인원 선택</label>
                <div className="flex items-center justify-between bg-[#101114] border border-white/10 rounded-xl px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                    className="w-7 h-7 rounded-lg bg-[#181A20] border border-white/10 text-[#EAECEF] font-bold hover:bg-white/[0.06]"
                  >
                    -
                  </button>
                  <span className="text-xs font-extrabold text-[#EAECEF] tabular-nums">{ticketCount}명</span>
                  <button
                    type="button"
                    onClick={() => setTicketCount(Math.min(8, ticketCount + 1))}
                    className="w-7 h-7 rounded-lg bg-[#181A20] border border-white/10 text-[#EAECEF] font-bold hover:bg-white/[0.06]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Golden Spot Live Callout */}
            <div className="p-3 bg-[#101114] rounded-xl border border-white/10 flex justify-between items-center text-xs">
              <span className="text-[#C2A878] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C2A878]" />
                {seatRow === 'G'
                  ? 'G열 12번 (골든 에리어 시선일치 구역)'
                  : seatRow === 'A'
                  ? 'A열 12번 (전열 꽉 찬 시야 몰입 구역)'
                  : 'M열 12번 (후열 서라운드 음향 밸런스 구역)'}
              </span>
              <span className="text-[#EAECEF] font-bold text-[11px]">지정 완료</span>
            </div>

            {/* Total Price Summary */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#9499A6]">총 결제 예정 금액</span>
                <div className="text-xl font-black text-[#C2A878] tabular-nums">
                  {totalPrice.toLocaleString()}원
                </div>
              </div>
              <button
                type="button"
                onClick={handleCompleteBooking}
                className="px-6 py-3.5 bg-[#B82935] hover:bg-[#9E202B] text-[#EAECEF] font-extrabold text-xs sm:text-sm rounded-xl border border-white/10 transition-colors active:scale-95"
              >
                예매 및 발권 완료 ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
