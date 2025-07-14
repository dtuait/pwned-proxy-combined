'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AlertTriangle, Shield, Search, ArrowLeft, Calendar, Database, Info } from 'lucide-react';
import Link from 'next/link';

interface BreachData {
  Name: string;
  Title?: string;
  BreachDate?: string;
  Domain?: string;
  PwnCount?: number;
  Description?: string;
}

export default function BreachCheckerPage() {
  const { data: session } = useSession();
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<BreachData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any[]>([]);
  const [testMode, setTestMode] = useState(false);

  // Add debug entry
  const addDebug = (type: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    setDebugInfo(prev => [...prev, { timestamp, type, message, data }]);
    console.log(`[${timestamp}] ${type}: ${message}`, data);
  };

  // Test CORS capabilities
  const testCorsCapabilities = async () => {
    addDebug('TEST', 'Testing CORS capabilities...');
    
    try {
      // Test 1: Basic request without custom headers
      addDebug('TEST', 'Test 1: Basic request without custom headers');
      const basicResponse = await fetch(
        `https://api.dtuaitsoc.ngrok.dev/api/breached-account/test%40example.com/`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`,
          },
        }
      );
      addDebug('TEST', `Basic request status: ${basicResponse.status}`, {
        status: basicResponse.status,
        headers: Object.fromEntries(basicResponse.headers.entries())
      });

    } catch (err) {
      addDebug('ERROR', 'Basic request failed', err);
    }

    try {
      // Test 2: OPTIONS request to check CORS headers
      addDebug('TEST', 'Test 2: OPTIONS preflight request');
      const optionsResponse = await fetch(
        `https://api.dtuaitsoc.ngrok.dev/api/breached-account/test%40example.com/`,
        {
          method: 'OPTIONS',
          headers: {
            'Origin': 'https://dtuaitsoc.ngrok.dev',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'x-api-key',
          },
        }
      );
      addDebug('TEST', `OPTIONS request status: ${optionsResponse.status}`, {
        status: optionsResponse.status,
        headers: Object.fromEntries(optionsResponse.headers.entries())
      });

    } catch (err) {
      addDebug('ERROR', 'OPTIONS request failed', err);
    }
  };

  const handleBreachCheck = async () => {
    if (!email || !session) return;
    
    setLoading(true);
    setError(null);
    setSearched(false);
    setDebugInfo([]);
    
    addDebug('START', 'Starting breach check', { email, sessionExists: !!session });

    try {
      const encodedEmail = encodeURIComponent(email);
      addDebug('PREP', 'Email encoded', { original: email, encoded: encodedEmail });
      
      // Debug session info
      addDebug('SESSION', 'Session details', {
        hasSession: !!session,
        hasAccessToken: !!session?.accessToken,
        tokenPreview: session?.accessToken ? session.accessToken.substring(0, 20) + '...' : null,
        user: session?.user?.email || session?.user?.name,
        expires: session?.expires
      });

      // Debug environment
      addDebug('ENV', 'Environment check', {
        hasHibpKey: !!process.env.NEXT_PUBLIC_HIBP_API_KEY,
        keyPreview: process.env.NEXT_PUBLIC_HIBP_API_KEY ? 
          process.env.NEXT_PUBLIC_HIBP_API_KEY.substring(0, 10) + '...' : null,
        origin: window.location.origin,
        userAgent: navigator.userAgent.substring(0, 50) + '...'
      });

      const apiUrl = `https://api.dtuaitsoc.ngrok.dev/api/breached-account/${encodedEmail}/`;
      addDebug('URL', 'Target URL constructed', apiUrl);

      const requestHeaders = {
        'accept': 'application/json',
        'Authorization': `Bearer ${session?.accessToken}`,
        'X-API-Key': process.env.NEXT_PUBLIC_HIBP_API_KEY || '',
      };

      addDebug('HEADERS', 'Request headers prepared', {
        ...requestHeaders,
        'Authorization': requestHeaders.Authorization ? 
          requestHeaders.Authorization.substring(0, 20) + '...' : null,
        'X-API-Key': requestHeaders['X-API-Key'] ? 
          requestHeaders['X-API-Key'].substring(0, 10) + '...' : null
      });

      addDebug('FETCH', 'Making fetch request...');
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: requestHeaders,
      });

      addDebug('RESPONSE', 'Response received', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        type: response.type,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });

      const responseText = await response.text();
      addDebug('BODY', 'Response body', {
        length: responseText.length,
        preview: responseText.substring(0, 200),
        isJson: responseText.trim().startsWith('{') || responseText.trim().startsWith('[')
      });

      if (!response.ok) {
        addDebug('ERROR', 'Response not OK', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        throw new Error(`API returned ${response.status}: ${response.statusText}\nBody: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
        addDebug('PARSE', 'JSON parsed successfully', {
          type: Array.isArray(data) ? 'array' : typeof data,
          length: Array.isArray(data) ? data.length : 'N/A'
        });
      } catch (parseError) {
        addDebug('ERROR', 'JSON parse failed', parseError);
        throw new Error('Invalid JSON response from API');
      }

      setResults(data || []);
      setSearched(true);
      
      addDebug('SUCCESS', 'Breach check completed', {
        breachCount: data ? data.length : 0,
        hasBreaches: data && data.length > 0
      });
      
      if (!data || data.length === 0) {
        // No breaches found
      }

    } catch (err) {
      addDebug('CATCH', 'Error caught in main handler', {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : null
      });
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      addDebug('END', 'Breach check completed');
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
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/welcome" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Email Breach Checker</h1>
              <p className="text-gray-300 mt-2">Check if your email has been compromised in data breaches</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTestMode(!testMode)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium"
              >
                {testMode ? 'Hide' : 'Show'} Debug
              </button>
              <button
                onClick={testCorsCapabilities}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium"
              >
                Test CORS
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Search and Results */}
          <div>
            {/* Search Section */}
            <div className="text-center mb-8">
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
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-300 font-medium">Error occurred:</p>
                    <pre className="text-red-200 text-sm mt-2 whitespace-pre-wrap">{error}</pre>
                  </div>
                </div>
              </div>
            )}

            {/* Results Section */}
            {searched && (
              <div className="space-y-6">
                {/* Breach Count Card */}
                <div className={`rounded-2xl p-6 border ${
                  results && results.length > 0 
                    ? 'bg-gradient-to-r from-red-900 to-red-700 border-red-600' 
                    : 'bg-gradient-to-r from-green-900 to-green-700 border-green-600'
                }`}>
                  <div className="text-center">
                    <div className={`text-4xl font-bold mb-2 ${
                      results && results.length > 0 ? 'text-red-300' : 'text-green-300'
                    }`}>
                      {results ? results.length : 0}
                    </div>
                    <div className={`text-xl font-bold mb-2 ${
                      results && results.length > 0 ? 'text-red-200' : 'text-green-200'
                    }`}>
                      Data Breach{results && results.length !== 1 ? 'es' : ''}
                    </div>
                    <p className={`text-sm ${results && results.length > 0 ? 'text-red-100' : 'text-green-100'}`}>
                      {results && results.length > 0 ? (
                        <>Found in {results.length} data breaches</>
                      ) : (
                        <>No breaches found - great news!</>
                      )}
                    </p>
                  </div>
                </div>

                {/* Breach Details */}
                {results && results.length > 0 && (
                  <div className="space-y-4">
                    {results.map((breach, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-red-500">
                        <h3 className="text-lg font-bold">{breach.Title || breach.Name}</h3>
                        {breach.BreachDate && (
                          <p className="text-gray-300 text-sm">Date: {new Date(breach.BreachDate).toLocaleDateString()}</p>
                        )}
                        {breach.Domain && (
                          <p className="text-gray-300 text-sm">Domain: {breach.Domain}</p>
                        )}
                        {breach.PwnCount && (
                          <p className="text-gray-300 text-sm">Affected accounts: {breach.PwnCount.toLocaleString()}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Debug Info */}
          {testMode && (
            <div className="bg-gray-800 rounded-lg p-6 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold">Debug Information</h3>
                <button
                  onClick={() => setDebugInfo([])}
                  className="ml-auto px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                >
                  Clear
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {debugInfo.length === 0 ? (
                  <p className="text-gray-400 text-sm">No debug info yet. Try making a request.</p>
                ) : (
                  <div className="space-y-2">
                    {debugInfo.map((entry, index) => (
                      <div key={index} className="text-xs border-l-2 border-gray-600 pl-3 py-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            entry.type === 'ERROR' ? 'bg-red-900 text-red-200' :
                            entry.type === 'SUCCESS' ? 'bg-green-900 text-green-200' :
                            entry.type === 'TEST' ? 'bg-purple-900 text-purple-200' :
                            'bg-blue-900 text-blue-200'
                          }`}>
                            {entry.type}
                          </span>
                          <span className="text-gray-400">{entry.timestamp.split('T')[1].split('.')[0]}</span>
                        </div>
                        <p className="text-gray-300 mb-1">{entry.message}</p>
                        {entry.data && (
                          <pre className="text-gray-400 text-xs bg-gray-900 p-2 rounded overflow-x-auto">
                            {JSON.stringify(entry.data, null, 2)}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}