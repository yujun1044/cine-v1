export type TheaterFormat = 'imax' | '4dx' | 'screenx' | 'privatebox';

export type SeatRow = 'A' | 'G' | 'M';

export type AudioMode = 'stereo' | 'atmos';

export interface BookingDetails {
  id: string;
  format: string;
  theater: string;
  date: string;
  timeSlot: string;
  seatRow: string;
  seatNumber: number;
  ticketCount: number;
  totalPrice: number;
  bookingTime: string;
}

export interface BrandConfig {
  id: string;
  name: string;
  tagline: string;
  shortCode: string;
  theme: 'red' | 'purple' | 'emerald' | 'amber';
  accentColor: string;
  featuredMovie: {
    title: string;
    badge: string;
    image: string;
    subhead: string;
  };
  branches: string[];
}

export interface UXAnnotation {
  section: string;
  title: string;
  asIs: string;
  toBe: string;
  description: string;
}
