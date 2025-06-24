'use client';

import { useEventStore } from '@/store/useEventStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  initialData?: any;
}

export default function EventForm({ initialData }: Props) {
  const isEdit = !!initialData;
  const router = useRouter();
  const { addEvent, updateEvent } = useEventStore();

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
    location: initialData?.location || '',
    status: initialData?.status || 'upcoming',
    tags: initialData?.tags?.join(', ') || '',
  });

  const [loadingDesc, setLoadingDesc] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Generate Description (existing)
  const handleGenerateDescription = async () => {
    setLoadingDesc(true);
    setError('');
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          location: form.location,
          date: form.date,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, description: data.description || '' }));
      } else {
        setError(data.error || 'Failed to generate description');
      }
    } catch {
      setError('Something went wrong while generating description');
    }
    setLoadingDesc(false);
  };

  // Generate Title & Tags (new)
  const handleGenerateTitleTags = async () => {
    setLoadingTags(true);
    setError('');
    try {
      const res = await fetch('/api/ai/generateTitleTags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: form.description }),
      });

      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : prev.tags,
        }));
      } else {
        setError(data.error || 'Failed to generate title & tags');
      }
    } catch {
      setError('Something went wrong while generating title & tags');
    }
    setLoadingTags(false);
  };

  const handleSubmit = () => {
    const eventData = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (isEdit && initialData) updateEvent(initialData.id, eventData);
    else addEvent(eventData);
    router.push('/events');
  };

  return (
    <div className="space-y-4 max-w-md mx-auto mt-6">
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        type="datetime-local"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2"
        rows={5}
      />

      <button
        type="button"
        onClick={handleGenerateDescription}
        disabled={loadingDesc || !form.title || !form.location || !form.date}
        className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 px-4 py-2 rounded"
      >
        {loadingDesc ? 'Generating Description...' : 'Generate Description'}
      </button>

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
        className="w-full border p-2"
      />

      <button
        type="button"
        onClick={handleGenerateTitleTags}
        disabled={loadingTags || !form.description}
        className="bg-green-500 hover:bg-green-600 disabled:opacity-50 px-4 py-2 rounded"
      >
        {loadingTags ? 'Generating Title & Tags...' : 'Generate Title & Tags'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      <select
        name="status"
        value={form.status}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option value="upcoming">Upcoming</option>
        <option value="attending">Attending</option>
        <option value="maybe">Maybe</option>
        <option value="declined">Declined</option>
      </select>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isEdit ? 'Update Event' : 'Create Event'}
      </button>
    </div>
  );
}
