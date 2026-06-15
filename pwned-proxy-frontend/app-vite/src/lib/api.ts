// SHA-1 hash of a string, uppercase hex (uses the browser's built-in crypto).
async function sha1(message: string): Promise<string> {
  const bytes = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest('SHA-1', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

// Returns how many times a password appears in breaches (0 = not found).
export async function getPasswordPwnedCount(password: string): Promise<number> {
  const hash = await sha1(password); // hash in the browser
  const prefix = hash.slice(0, 5); // only these 5 chars leave the browser
  const suffix = hash.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' },
  });
  if (!res.ok) throw new Error('Pwned Passwords request failed');

  const text = await res.text();
  for (const line of text.split('\n')) {
    const [hashSuffix, hits] = line.trim().split(':');
    if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
      return parseInt(hits, 10); // found it → return the count
    }
  }
  return 0; // not found
}

export interface Breach {
  Name: string;
  Title: string;
  Domain: string;
  BreachDate: string;
  DataClasses: string[];
}

export async function getBreachesForEmail(email: string): Promise<Breach[]> {
  const res = await fetch(
    // relative url: send it to the same sever that serves this page - Vite dev server
    // --proxy--adds the key and forwards to the backend, which then forwards to HIBP API.
    `/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false&includeUnverified=true`,
    { headers: { accept: 'application/json' } },
  );
  if (res.status === 404) return []; // 404 = no breaches
  if (!res.ok) throw new Error(`Backend error ${res.status}`);
  return (await res.json()) as Breach[];
}
