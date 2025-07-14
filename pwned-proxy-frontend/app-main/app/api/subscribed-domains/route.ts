import { NextResponse } from 'next/server';

// Fetch the currently subscribed domains from the official HIBP API.
export async function GET() {
  const apiKey = process.env.HIBP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'HIBP_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      'https://haveibeenpwned.com/api/v3/subscribeddomains',
      {
        headers: {
          'hibp-api-key': apiKey,
          'user-agent': 'pwned-proxy-frontend',
        },
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: `HIBP API error: ${response.status}`, details: text },
        { status: response.status }
      );
    }

    const data = JSON.parse(text) as { DomainName?: string }[];
    const domains = data
      .map((d) => d.DomainName)
      .filter((d): d is string => typeof d === 'string');

    if (domains.length === 0) {
      return NextResponse.json(
        { error: 'No domains returned from HIBP API' },
        { status: 500 }
      );
    }

    return NextResponse.json(domains);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
