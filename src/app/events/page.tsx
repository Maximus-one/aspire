'use client';

import { useEventStore } from '@/store/useEventStore';
import EventCard from '@/components/EventCard';


import Link from 'next/link';
import { useState } from 'react';

export default function EventsPage() {
  const { events } = useEventStore();
  const [search, setSearch] = useState('');

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Events</h1>
        <Link href="/events/new" className="bg-green-600 text-white px-3 py-1 rounded">
          + New
        </Link>
      </div>

      <input
        placeholder="Search by title or location..."
        className="w-full border p-2 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}

      {filtered.length === 0 && <p>No events found.</p>}
    </div>
  );
}
