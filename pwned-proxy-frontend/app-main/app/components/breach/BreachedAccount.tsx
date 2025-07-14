'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AlertTriangle, Shield, Search, ArrowLeft, Calendar, Database } from 'lucide-react';
import Link from 'next/link';
import BreachCountCard from '../BreachCountCard';

interface BreachData {
  Name: string;
  Title?: string;
  BreachDate?: string;
  Domain?: string;
  PwnCount?: number;
  Description?: string;
}

export default function BreachCheckerPage() {
  // Defines the component and obtains the current authentication session.
  const { data: session } = useSession();

  // Declares state variables: the email input, the breach results, loading state, error message, 
  // whether a search has been performed, and whether to show a fireworks animation.
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<BreachData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleBreachCheck = async () => {
    if (!email || !session) return;
    
    // Basic email validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Extract domain from input email
    const inputDomain = email.split('@')[1]?.toLowerCase();
    if (!inputDomain) {
      setError('Please enter a valid email address with a domain');
      return;
    }
    
    // Extract domain from logged-in user's email
    const userEmail = session.user?.email;
    if (!userEmail) {
      setError('Unable to verify your email domain. Please try logging in again.');
      return;
    }
    
    const userDomain = userEmail.split('@')[1]?.toLowerCase();
    if (!userDomain) {
      setError('Unable to verify your email domain. Please contact support.');
      return;
    }
    
    // Check if domains match
    if (inputDomain !== userDomain) {
      setError(`You can only check emails from your own institution (${userDomain}). Please enter an email with the same domain as your account.`);
      return;
    }
    
    console.log('=== DEBUG: Validation Passed ===');
    console.log('Input email:', email);
    console.log('Input domain:', inputDomain);
    console.log('User email:', userEmail);
    console.log('User domain:', userDomain);
    
    // Resets UI state and shows a loading spinner.
    setLoading(true);
    setError(null);
    setSearched(false);
    
    try {
      // Debug session information
      console.log('=== DEBUG: Session Info ===');
      console.log('Session exists:', !!session);
      console.log('Access Token exists:', !!session?.accessToken);
      console.log('Access Token preview:', session?.accessToken ? 
        `${session.accessToken.substring(0, 10)}...` : 'None');
      
      const response = await fetch('/api/breach-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // session is guaranteed above, so assert non-null
          Authorization: `Bearer ${session!.accessToken}`,
        },
        body: JSON.stringify({ email }),
      });

      console.log('=== DEBUG: API Response ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}\n${responseText}`);
      }

      const data = JSON.parse(responseText);
      setResults(data || []);
      setSearched(true);
      
      // No breaches found
    } catch (err) {
      console.log('=== DEBUG: Catch Block ===');
      console.error('Full error object:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBreachCheck();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-300">Please sign in to access the breach checker.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 relative z-20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* <Link href="/welcome" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link> */}
          <h1 className="text-3xl font-bold">Email Breach Checker</h1>
          <p className="text-gray-300 mt-2">Check if your email has been compromised in data breaches</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-20">
        {/* Search Section */}
        <div className="text-center mb-12">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="max-w-md mx-auto">
              <div className="flex rounded-lg overflow-hidden shadow-lg">
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                />
                <button
                  onClick={handleBreachCheck}
                  disabled={loading || !email}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold transition-colors"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></div>
                  ) : (
                    'Check'
                  )}
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Using our security API is subject to the terms of use
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">Error: {error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {searched && (
          <div className="space-y-8">
            {/* Breach History Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Email Breach History</h2>
              <p className="text-gray-300">Timeline of data breaches affecting your email address</p>
            </div>

            {/* Breach Count Card */}
            <BreachCountCard count={results ? results.length : 0} />

            {/* Stay Protected Section */}
            <div className="bg-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold">Stay Protected</h3>
                  </div>
                  <p className="text-gray-300">Get notified when your email appears in future data breaches</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                  Notify Me
                </button>
              </div>
            </div>

            {/* Breach Details */}
            {results && results.length > 0 && (
              <div className="space-y-6">
                {results.map((breach, index) => (
                  <div key={index} className="bg-gray-800 rounded-2xl p-6 border-l-4 border-red-500">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Database className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold">{breach.Title || breach.Name}</h3>
                          {breach.BreachDate && (
                            <div className="flex items-center gap-2 text-gray-400">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(breach.BreachDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        {breach.Domain && (
                          <p className="text-gray-300 mb-2">Domain: {breach.Domain}</p>
                        )}
                        {breach.PwnCount && (
                          <p className="text-gray-300 mb-2">
                            Compromised accounts: {breach.PwnCount.toLocaleString()}
                          </p>
                        )}
                        {breach.Description && (
                          <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: breach.Description }} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}