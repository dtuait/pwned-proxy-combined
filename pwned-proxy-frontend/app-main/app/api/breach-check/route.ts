// app-main/app/api/breach-check/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Server‑side call to your Django API – no CORS issues here
    const baseUrl = (
      process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
      'http://api.haveibeenpwned.cert.dk'
    ).replace(/\/$/, '');
    const response = await fetch(
      `${baseUrl}/api/v3/breachedaccount/${encodeURIComponent(email)}?includeUnverified=true`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: authHeader,
          'X-API-Key': process.env.HIBP_API_KEY ?? '',
        },
      }
    );

    const text = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend API error: ${response.status}`, details: text },
        { status: response.status }
      );
    }

    return NextResponse.json(JSON.parse(text));
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
