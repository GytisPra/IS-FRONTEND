export interface Event {
  id: number;
  name: string;
  start_time: Date;
  end_time: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  age: number;
  phone_number: string;
  is_email_verified: boolean;
}
export interface Ticket {
  id: number;
  price: number;
  event_name: string;
  event_id: number;
  created_at: Date;
  start_time: Date;
  end_time: Date;
}
