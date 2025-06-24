'use client';

import { useParams } from 'next/navigation';
import { useEventStore } from '@/store/useEventStore';
import EventForm from '@/components/EventForm';


export default function EditEventPage() {
  const { id } = useParams();
  const { events } = useEventStore();
  const event = events.find((e) => e.id === id);

  if (!event) return <p className="text-center mt-6">Event not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mt-4">Edit Event</h1>
      <EventForm initialData={event} />
    </div>
  );
}
