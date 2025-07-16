import { NextResponse } from 'next/server';

export async function GET() {
  // Always prefer the internal backend URL when available. Falling back to the
  // backend container hostname ensures the API can be reached when the public
  // URL (often pointing to localhost) isn't accessible from within the
  // container network.
  const baseUrl = (
    process.env.HIBP_PROXY_INTERNAL_URL ||
    'http://backend:8000'
  ).replace(/\/$/, '');
  const apiKey = process.env.HIBP_API_KEY ?? '';

  console.log('[group-names] using baseUrl:', baseUrl);

  try {
    const response = await fetch(`${baseUrl}/api/v3/group-names`, {
      headers: {
        'X-API-Key': apiKey,
        accept: 'application/json',
      },
    });

    console.log('[group-names] response status:', response.status);
    const text = await response.text();
    console.log('[group-names] raw response:', text);
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
    console.error('[group-names] unexpected error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
