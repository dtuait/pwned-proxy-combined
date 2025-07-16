import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = (
    process.env.HIBP_PROXY_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
    'http://backend:8000'
  ).replace(/\/$/, '');
  const apiKey = process.env.HIBP_API_KEY ?? '';

  try {
    const response = await fetch(`${baseUrl}/api/v3/group-names`, {
      headers: {
        'X-API-Key': apiKey,
        accept: 'application/json',
      },
    });

    const text = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend API error: ${response.status}`, details: text },
        { status: response.status }
      );
    }

    const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid groups payload from backend' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
