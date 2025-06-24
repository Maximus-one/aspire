export type EventStatus = 'upcoming' | 'attending' | 'maybe' | 'declined';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  location: string;
  status: EventStatus;
}
