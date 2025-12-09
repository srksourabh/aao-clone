export interface PlaceDetails {
  placeId: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface BookingFormData {
  from: string;
  to: string;
  date: string;
  time: string;
  passengers: number;
  carType: string;
  babyOnBoard: boolean;
  patientOnBoard: boolean;
  petOnBoard: boolean;
  name: string;
  phone: string;
}

export interface Booking extends BookingFormData {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export const CAR_TYPES = [
  "Sedan",
  "Sedan XL",
  "SUV",
  "Innova",
  "Tempo Traveller",
  "Mini Bus",
  "Custom"
] as const;

export type CarType = typeof CAR_TYPES[number];

/**
 * Geocoding data for a location (coordinates, place ID, formatted address)
 * Used for future distance calculations and route mapping
 */
export interface LocationData {
  address: string;
  placeId: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

/**
 * A unified interface for data parsed from natural language input.
 * This can be used to populate any of the booking tabs.
 */
export interface ParsedBookingData {
  from?: string;
  to?: string;
  location?: string; // Used for rental location
  date?: string;
  time?: string;
  passengers?: number;
  carType?: string;
  packageType?: "spiti" | "wedding";
}
