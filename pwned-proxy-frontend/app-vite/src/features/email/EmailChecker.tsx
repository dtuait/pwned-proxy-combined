import { useState } from 'react';
import { getBreachesForEmail, type Breach } from '../../lib/api';

type Status = 'idle' | 'loading' | 'done' | 'error';

export default function EmailChecker() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<Breach[]>([]);
  const [error, setError] = useState('');

  async function handleCheck() {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email address');
      return;
    }

    setStatus('loading');
    setError('');

    try {
      const data = await getBreachesForEmail(trimmed);
      setResults(data);
      setStatus('done');

      // confetti when clean
      if (data.length === 0) {
        import('canvas-confetti').then((mod) => {
          mod.default({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
        });
      }
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }

  return (
    <div>
      {/* Input row */}
      <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          disabled={status === 'loading'}
        />
        <button onClick={handleCheck} disabled={status === 'loading' || !email}>
          {status === 'loading' ? 'Checking…' : 'Check'}
        </button>
      </div>

      {/* Error */}
      {(status === 'error' || error) && (
        <p style={{ color: 'crimson' }}>{error}</p>
      )}

      {/* Results */}
      {status === 'done' && results.length === 0 && (
        <p style={{ color: 'green' }}>✅ Good news — no pwnage found!</p>
      )}

      {status === 'done' && results.length > 0 && (
        <div>
          <p style={{ color: 'crimson' }}>
            ⚠️ Found in {results.length} breach{results.length > 1 ? 'es' : ''}
          </p>
          {results.map((breach) => (
            <div
              key={breach.Name}
              style={{
                border: '1px solid #ccc',
                margin: '1rem 0',
                padding: '1rem',
                borderRadius: 8,
              }}
            >
              <h3>{breach.Title || breach.Name}</h3>
              <p>
                <strong>Domain:</strong> {breach.Domain}
              </p>
              <p>
                <strong>Date:</strong> {breach.BreachDate}
              </p>
              {breach.DataClasses.length > 0 && (
                <p>
                  <strong>Exposed:</strong> {breach.DataClasses.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
