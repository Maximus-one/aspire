import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV !== 'production';
  const { description } = await req.json();

  if (isDev) {
    // Mock response for dev
    return NextResponse.json({
      title: 'Sample Event Title',
      tags: ['sample', 'event', 'demo'],
    });
  }

  const prompt = `
    You are an AI assistant that generates a catchy event title and relevant tags from a description.

    Description:
    """${description}"""

    Return a JSON object with:
    {
      "title": "Catchy title here",
      "tags": ["tag1", "tag2", "tag3"]
    }
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
          { role: 'system', content: 'You are a helpful event title and tag generator.' },
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
    const text = data.choices[0]?.message?.content || '';

    // Parse AI response JSON safely
    let result;
    try {
      result = JSON.parse(text);
    } catch {
      // Fallback if AI returns text instead of JSON
      result = { title: 'Generated Title', tags: [] };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch failed:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
