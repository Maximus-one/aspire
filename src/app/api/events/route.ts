import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';

const EVENTS_COLLECTION = 'events';

// GET: fetch all events
export async function GET() {
  const snapshot = await getDocs(collection(db, EVENTS_COLLECTION));
  const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(events);
}

// POST: create a new event
export async function POST(req: Request) {
  const body = await req.json();
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), body);
  return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
}

// PUT: update an event (must include id in body)
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });

  const ref = doc(db, EVENTS_COLLECTION, id);
  await updateDoc(ref, updates);

  return NextResponse.json({ id, ...updates });
}

// DELETE: delete event by ID (must include id in body)
export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: 'Missing event ID' }, { status: 400 });

  await deleteDoc(doc(db, EVENTS_COLLECTION, id));
  return NextResponse.json({ message: 'Deleted successfully' });
}
