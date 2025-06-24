'use client';

'use client';

import { EventItem } from '@/types/event';
import { useEventStore } from '@/store/useEventStore';
import Link from 'next/link';


export default function EventCard({ event }: { event: EventItem }) {
  const { deleteEvent } = useEventStore();

  return (
    <div className="border p-4 rounded mb-4">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p>{event.date}</p>
      <p>{event.location}</p>
      <p>{event.description}</p>
      <p className="italic text-sm text-gray-600">{event.status}</p>
      <div className="flex gap-2 mt-2">
        <Link href={`/events/${event.id}/edit`} className="text-blue-600 underline">
          Edit
        </Link>
        <button onClick={() => deleteEvent(event.id)} className="text-red-600 underline">
          Delete
        </button>
      </div>
    </div>
  );
}
