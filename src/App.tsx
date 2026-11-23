/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FormatComparisonSection } from './components/FormatComparisonSection';
import { BentoGridSection } from './components/BentoGridSection';
import { SeatSimulatorSection } from './components/SeatSimulatorSection';
import { PricingMatrixSection } from './components/PricingMatrixSection';
import { BookingModal } from './components/BookingModal';
import { DesignSpecModal } from './components/DesignSpecModal';
import { Footer } from './components/Footer';
import { TheaterFormat, SeatRow, BookingDetails, BrandConfig } from './types';
import { BRAND_PRESETS } from './data/brands';

export default function App() {
  // Brand Configuration with full visual identity preset
  const [brand, setBrand] = useState<BrandConfig>(BRAND_PRESETS.cine_v);

  // UX Inspector Mode (10-Year Designer UX/UI Analysis Mode)
  const [inspectorMode, setInspectorMode] = useState<boolean>(false);

  // Active Cinema Format in Hero
  const [activeFormat, setActiveFormat] = useState<TheaterFormat>('imax');

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingFormat, setBookingFormat] = useState<string>('IMAX LASER 3D');
  const [bookingSeatRow, setBookingSeatRow] = useState<SeatRow>('G');

  // Saved Bookings
  const [bookings, setBookings] = useState<BookingDetails[]>([
    {
      id: 'V-882194',
      format: 'IMAX LASER 3D',
      theater: 'CINE V 용산 플래그십 (IMAX GT관)',
      date: '오늘 (11월 09일)',
      timeSlot: '20:00',
      seatRow: 'G',
      seatNumber: 12,
      ticketCount: 2,
      totalPrice: 44000,
      bookingTime: '20:00',
    },
  ]);

  // Design Spec Modal State
  const [isDesignSpecOpen, setIsDesignSpecOpen] = useState<boolean>(false);

  // Handlers
  const handleUpdateBrand = (newBrand: BrandConfig) => {
    setBrand(newBrand);
  };

  const handleOpenBooking = (formatName?: string) => {
    if (formatName) {
      setBookingFormat(formatName);
    }
    setIsBookingOpen(true);
  };

  const handleOpenBookingWithSeat = (row: SeatRow) => {
    setBookingFormat(`IMAX LASER (${row}열 명당 지정)`);
    setBookingSeatRow(row);
    setIsBookingOpen(true);
  };

  const handleSaveBooking = (booking: BookingDetails) => {
    setBookings((prev) => [booking, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#101114] text-[#EAECEF] font-sans selection:bg-[#B82935] selection:text-[#EAECEF]">
      {/* 1. Header (GNB) */}
      <Header
        brand={brand}
        onUpdateBrand={handleUpdateBrand}
        inspectorMode={inspectorMode}
        onToggleInspector={() => setInspectorMode(!inspectorMode)}
        onOpenBooking={handleOpenBooking}
        onOpenBookingsList={() => setIsBookingOpen(true)}
        hasBookings={bookings.length > 0}
        onOpenDesignSpec={() => setIsDesignSpecOpen(true)}
      />

      <main>
        {/* 2. Hero Section */}
        <HeroSection
          brand={brand}
          activeFormat={activeFormat}
          onSelectFormat={setActiveFormat}
          onOpenBooking={handleOpenBooking}
          inspectorMode={inspectorMode}
        />

        {/* 3. Interactive Aspect Ratio & Spatial Audio Comparison */}
        <FormatComparisonSection
          brand={brand}
          inspectorMode={inspectorMode}
        />

        {/* 4. 12-Column Bento Grid Special Theater Technology */}
        <BentoGridSection
          brand={brand}
          inspectorMode={inspectorMode}
        />

        {/* 5. 3D Seat Perspective Simulator */}
        <SeatSimulatorSection
          brand={brand}
          onOpenBookingWithSeat={handleOpenBookingWithSeat}
          inspectorMode={inspectorMode}
        />

        {/* 6. Pricing Matrix & Customized Recommendation */}
        <PricingMatrixSection
          brand={brand}
          onOpenBooking={handleOpenBooking}
          inspectorMode={inspectorMode}
        />
      </main>

      {/* 7. Footer */}
      <Footer
        brand={brand}
        onOpenDesignSpec={() => setIsDesignSpecOpen(true)}
      />

      {/* 8. Booking Modal & Mobile QR Ticket */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        brand={brand}
        initialFormat={bookingFormat}
        initialSeatRow={bookingSeatRow}
        onSaveBooking={handleSaveBooking}
        existingBookings={bookings}
      />

      {/* 9. University Project Design Spec Sheet Modal */}
      <DesignSpecModal
        isOpen={isDesignSpecOpen}
        onClose={() => setIsDesignSpecOpen(false)}
        brand={brand}
      />
    </div>
  );
}
