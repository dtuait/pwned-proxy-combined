import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Server-side call to the Django API without requiring Authorization
  // Prefer the internal backend hostname when running inside Docker.
  const baseUrl = (
    process.env.HIBP_PROXY_INTERNAL_URL ||
    'http://backend:8000'
  ).replace(/\/$/, '');
    const apiUrl = `${baseUrl}/api/v3/breachedaccount/${encodeURIComponent(email)}?includeUnverified=true`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });


    console.log('=== SERVER: Backend response ===');
    console.log('Status:', response.status);

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