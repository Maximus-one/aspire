import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Use this to detect dev mode or mock flag
  const isDev = process.env.NODE_ENV !== 'production';

  const { title, location, date } = await req.json();

  if (isDev) {
    // Return mock description to avoid API calls during dev
    const mockDescription = `This is a mock description for the event "${title}" happening in ${location} on ${date}.`;
    return NextResponse.json({ description: mockDescription });
  }

  const prompt = `
    Write a professional, engaging description for an event titled:
    "${title}", taking place in ${location} on ${date}.
    Focus on what attendees can expect and why it's worth attending.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful event description assistant.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ OpenAI API error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    const data = await response.json();
    const description = data.choices[0]?.message?.content;

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Fetch failed:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
