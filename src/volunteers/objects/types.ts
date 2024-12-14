// types.ts

export interface Event {
    id: string; // Assuming event IDs are UUIDs
    date: string;
    start_time: string;
    name?: string;
    description?: string;
    end_time: string;
    is_free: boolean;
    created_at: string;
    updated_at: string;
    seats_count: number;
    event_location_id: string | null;
    max_volunteer_count: number;
    available_volunteers: number;
    form_url?: string;
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
    date: string;
    start_time: string;
    end_time: string;
    is_free: boolean;
    seats_count: number;
    max_volunteer_count: number;
    location?: {
      country?: string;
      address?: string;
      specified_location?: string;
      longitude?: number;
      latitude?: number;
    } | null;
  }
  
  export interface VolunteerApplication {
    id: string;
    date: string; 
    volunteer_id: string; 
    event_id: string; 
    status: 'priimta' | 'atmesta' | 'laukiama';
    form_url?: string;
  }
  export interface User {
    id: string;
    created_at: string;
    role: 'admin' | 'volunteer' | 'user';
    name: string;
    email: string;
    username: string;
    age: number;
    phone_number: string;
    is_email_verified: boolean;
  }