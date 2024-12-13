export interface Event {
  id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  is_free: boolean;
  created_at: string;
  updated_at: string;
  seats_count: number;
  event_location_id: string | null;
  max_volunteer_count: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface Location {
  id: string;
  country: string;
  address: string;
  specified_location: string;
  longitude: number;
  latitude: number;
}

export interface NewEventForm {
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  is_free: boolean;
  seats_count: number;
  max_volunteer_count: number;
  location?: {
    // manau, kad gali but nullable, nes renginys gali but ir online
    country?: string;
    address?: string;
    specified_location?: string;
    longitude?: number;
    latitude?: number;
  } | null;
}
