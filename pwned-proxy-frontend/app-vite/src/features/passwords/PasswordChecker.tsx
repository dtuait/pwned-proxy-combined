import { useState } from 'react';
import { getPasswordPwnedCount } from '../../lib/api'; // ← talks to the api layer

export default function PasswordChecker() {
  const [password, setPassword] = useState(''); // what the user typed
  const [count, setCount] = useState<number | null>(null); // the result
  const [loading, setLoading] = useState(false); // "checking…" flag
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // stop the page reloading
    if (!password) return;
    setLoading(true);
    setError(null);
    setCount(null);
    try {
      const hits = await getPasswordPwnedCount(password); // calls api layer
      setCount(hits); // save the answer
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setPassword('');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '.5rem' }}>
        <input
          type="password"
          placeholder="Enter a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // here tracks every keystroke, updates password as usertypes in
          disabled={loading}
        />
        <button type="submit" disabled={loading || !password}>
          {loading ? 'Checking…' : 'Check'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {count !== null &&
        (count > 0 ? (
          <p style={{ color: 'crimson' }}>
            ⚠️ Pwned! Seen {count.toLocaleString()} times.
          </p>
        ) : (
          <p style={{ color: 'green' }}>
            ✅ Good news — not found in any breach.
          </p>
        ))}

      <p style={{ fontSize: '.85rem', color: '#888' }}>
        Hashed in your browser; only 5 characters of the hash are sent.
      </p>
    </div>
  );
}
