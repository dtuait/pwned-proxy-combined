"use client";

import React, { useState } from "react";
import { signOut, useSession, signIn } from "next-auth/react";
import { Shield, Search, AlertTriangle, CheckCircle } from "lucide-react";
import FireworkAnimation from "../components/ui/FireworkAnimation";


interface BreachData {
  Name: string;
  Title?: string;
  BreachDate?: string;
  Domain?: string;
  PwnCount?: number;
  Description?: string;
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BreachData[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // Sign out handler
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: `https://${process.env.NEXT_PUBLIC_MY_DOMAIN}`,
    });
    window.location.href = `https://login.microsoftonline.com/${
      process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID
    }/oauth2/v2.0/logout?post_logout_redirect_uri=https://${
      process.env.NEXT_PUBLIC_MY_DOMAIN
    }`;
  };

  

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // "Have I Been Pwned?" click handler
  const handleClick = async () => {
    const trimmedEmail = email.trim();
    
    // Reset previous results
    setError(null);
    setResults(null);
    setSearched(false);

    // Validation
    if (!trimmedEmail) {
      setError("Please enter an email address!");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address!");
      return;
    }

    setLoading(true);

    try {
      console.log('=== DEBUG: Starting breach check ===');
      console.log('Email:', trimmedEmail);

      const baseUrl = (process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
        'http://localhost:8000').replace(/\/$/, '');
      const apiUrl = `${baseUrl}/api/v3/breachedaccount/${encodeURIComponent(trimmedEmail)}?includeUnverified=true`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      });

      console.log('=== DEBUG: Response received ===');
      console.log('Status:', response.status);

      // Handle 404 as "no breaches found"
      if (response.status === 404) {
        console.log('No breaches found (404)');
        setResults([]);
        setSearched(true);
        
        // dynamically import so Next.js won't try to SSR this
          import("canvas-confetti").then((mod) => {
            const confetti = mod.default;

            // one‐time burst in center‐top
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { x: 0.5, y: 0.7 },
              gravity: 1.2,
              decay: 0.9,
              ticks: 200,
            });

            // Left side burst (fires immediately)
            confetti({
              particleCount: 80,
              spread: 60,
              angle: 60, // Angle towards center-right
              origin: { x: 0.1, y: 0.75 }, // Left side, slightly lower
              gravity: 1.0,
              decay: 0.92,
              ticks: 180,
              colors: ['#C7E333', '#A8CC2A', '#22C55E'],
            });

            // Right side burst (fires immediately)
            confetti({
              particleCount: 80,
              spread: 60,
              angle: 120, // Angle towards center-left
              origin: { x: 0.9, y: 0.75 }, // Right side, slightly lower
              gravity: 1.0,
              decay: 0.92,
              ticks: 180,
              colors: ['#C7E333', '#A8CC2A', '#22C55E'],
            });

          }).catch((e) => {
            console.error("Failed to load confetti module:", e);
          });

        return;
      }

      const text = await response.text();
      console.log('Response text:', text);

      if (!response.ok) {
        setError(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      const data = JSON.parse(text);
      setResults(data || []);
      setSearched(true);

      console.log('=== DEBUG: Success ===');
      console.log('Breach count:', data ? data.length : 0);

    } catch (err) {
      console.error('=== DEBUG: Error ===', err);
      setError('An error occurred while checking for breaches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };
return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 1) EXACT two-stop gradient to match your pic */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #E0F2FE 0%,rgb(182, 196, 155) 100%)",
        }}
      />

      {/* 2) Sign-out button */}
      {/* <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 z-10 bg-white/80 text-green-700 px-4 py-2 rounded-lg shadow hover:bg-white"
      >
        Sign Out
      </button> */}

       <main className="relative z-10 max-w-3xl mx-auto px-4 py-16 text-center">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className="text-[#2563EB]">Have I </span>
          <span className="text-[#C7E333]">Been</span>
          <span className="text-gray-600"> Pwned?</span>
        </h1>
          <p className="text-lg text-gray-800 mb-8">
            Check if your email address has been compromised in a data breach.
          </p>

          {/* Search bar */}
          <div className="flex justify-center mb-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              className="w-full max-w-md p-4 rounded-l-lg border border-gray-300 focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleClick}
              disabled={loading}
              className="bg-[#C7E333] hover:bg-[#A8CC2A] text-white px-6 font-semibold rounded-r-lg disabled:opacity-50"
            >
              {loading ? "Checking…" : "Check"}
            </button>
          </div>
          <p className="text-sm text-gray-700">
            Using this service is subject to our{" "}
            <a href="#" className="underline text-green-700">
              terms of use
            </a>
            .
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 text-center text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {searched && results && (
          <div className="mx-auto w-full px-4 md:px-0">
            {results.length > 0 ? (
              <div className="bg-green-50 rounded-2xl p-6 shadow-lg border-l-4 border-red-500 max-w-4xl mx-auto">
                {/* Icon + heading */}
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
                  <h3 className="text-xl font-bold text-red-600">Oh no — pwned!</h3>
                </div>

                {/* Breach count */}
                <p className="text-red-500 mb-6">
                  Found in {results.length} breach{results.length > 1 ? "es" : ""}.
                </p>

                {/* Breach list */}
                <div className="space-y-3">
                  {results.map((b, i) => (
                    <div
                      key={i}
                      className="
                        bg-white 
                        rounded-md 
                        p-4 
                        border border-red-200
                        hover:bg-red-100        /* light pink hover */
                        transition-colors
                      "
                    >
                      <h4 className="text-red-600 font-semibold text-lg">
                        {b.Title || b.Name}
                      </h4>
                      {b.BreachDate && (
                        <p className="text-gray-500 text-sm mt-1">
                          Date: {new Date(b.BreachDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              
              <div className="relative">
                {/* 1) Place your fireworks behind or above */}
                {/* <FireworkAnimation /> */}

                {/* 2) Your “Good news” card */}
                <div className="bg-white/90 rounded-2xl p-6 shadow-lg border border-green-200 relative z-20">
                  <div className="flex items-center justify-center  mb-4">
                    <CheckCircle className="w-6 h-6 text-[#C7E333] mr-2" />
                    <h2 className="text-2xl md:text-3xl font-bold text-center">
                      <span className="text-[#C7E333]">Good news</span>
                      <span className="text-gray-600"> — </span>
                      <span className="text-[#C7E333]">no pwnage!</span>
                    </h2>
                   
                  </div>
                  <p className="text-gray-700 text-center">
                    No breached accounts or pastes found.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        
      </main>
    </div>
  );
}