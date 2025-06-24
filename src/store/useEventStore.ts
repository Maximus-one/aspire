import { create } from 'zustand';
import { EventItem } from '@/types/event';

interface State {
  events: EventItem[];
  fetchEvents: () => Promise<void>;
  addEvent: (event: Omit<EventItem, 'id'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<EventItem>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<State>((set) => ({
  events: [],

  fetchEvents: async () => {
    const res = await fetch('/api/events');
    const data = await res.json();
    set({ events: data });
  },

  addEvent: async (event) => {
    const res = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(event),
    });
    const newEvent = await res.json();
    set((state) => ({ events: [...state.events, newEvent] }));
  },

  updateEvent: async (id, updates) => {
    const res = await fetch('/api/events', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    });
    const updated = await res.json();
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? updated : e)),
    }));
  },

  deleteEvent: async (id) => {
    await fetch('/api/events', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
    set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    }));
  },
}));
