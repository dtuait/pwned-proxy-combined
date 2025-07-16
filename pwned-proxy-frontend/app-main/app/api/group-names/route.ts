import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
    'http://api.haveibeenpwned.cert.dk'
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
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: 'No groups returned from backend' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
