"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle, CheckCircle } from "lucide-react";
import FireworkAnimation from "../components/ui/FireworkAnimation";

interface BreachData {
  Name: string;
  Title?: string;
  BreachDate?: string;
  Domain?: string;
  PwnCount?: number;
  Description?: string;
  DataClasses?: string[];
  LogoPath?: string;
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BreachData[] | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleClick = async () => {
    const trimmedEmail = email.trim();
    setError(null);
    setResults(null);
    setSearched(false);

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
      const baseUrl = (process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
        "http://localhost:8000").replace(/\/$/, "");

      const apiUrl = `${baseUrl}/api/v3/breachedaccount/${encodeURIComponent(
        trimmedEmail
      )}?truncateResponse=false&includeUnverified=true`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { accept: "application/json" },
      });

      if (response.status === 404) {
        setResults([]);
        setSearched(true);
        import("canvas-confetti").then((mod) => {
          const confetti = mod.default;
          confetti({ particleCount: 100, spread: 70, origin: { x: 0.5, y: 0.7 }, gravity: 1.2, decay: 0.9, ticks: 200 });
          confetti({ particleCount: 80, spread: 60, angle: 60, origin: { x: 0.1, y: 0.75 }, gravity: 1.0, decay: 0.92, ticks: 180, colors: ["#C7E333", "#A8CC2A", "#22C55E"] });
          confetti({ particleCount: 80, spread: 60, angle: 120, origin: { x: 0.9, y: 0.75 }, gravity: 1.0, decay: 0.92, ticks: 180, colors: ["#C7E333", "#A8CC2A", "#22C55E"] });
        });
        return;
      }

      const text = await response.text();
      if (!response.ok) {
        setError(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      const data = JSON.parse(text);
      setResults(data || []);
      setSearched(true);
    } catch (err) {
      setError("An error occurred while checking for breaches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleClick();
  };

  const formatMonthYear = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-100 to-lime-100">
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">
          <span className="text-[#2563EB]">Have I </span>
          <span className="text-[#C7E333]">Been</span>
          <span className="text-gray-700"> Pwned?</span>
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          Check if your email address has been compromised in a data breach.
        </p>

        <div className="flex justify-center max-w-xl mx-auto mb-6">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
            className="flex-1 p-3 rounded-l-md border border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleClick}
            disabled={loading}
            className="bg-[#C7E333] hover:bg-[#A8CC2A] text-white px-6 rounded-r-md font-semibold"
          >
            {loading ? "Checking…" : "Check"}
          </button>
        </div>

        {error && <p className="text-red-600 mb-6">{error}</p>}

        {searched && results && (
          <div className="text-left mt-10">
            {results.length > 0 ? (
              <>

                <div className="bg-gray-50 rounded-xl p-6 border border-red-200 text-center max-w-2xl mx-auto mb-10">
                  <div className="flex justify-center items-center gap-2 text-red-600 font-semibold text-lg">
                    <AlertTriangle className="w-5 h-5" /> Oh no — pwned!
                  </div>
                  <p className="text-red-600 mt-2 font-mono">
                    Found in {results.length} breach{results.length > 1 ? "es" : ""}
                  </p>
                </div>

                <div className="relative pl-4 md:pl-0">
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-[#C7E333] h-full z-0"></div>

                  {results
                    .slice()
                    .sort((a, b) => new Date(b.BreachDate!).getTime() - new Date(a.BreachDate!).getTime())
                    .map((breach, index) => (
                      <div
                        key={index}
                        className={`relative z-10 mb-12 md:flex md:items-start ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
                      >
                        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-20 h-20 bg-[#C7E333] text-white text-sm font-bold rounded-full shadow items-center justify-center z-20">
                          <div className="text-center">
                            <div className="text-sm font-bold leading-tight">
                              {new Date(breach.BreachDate!).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            <div className="text-sm font-bold">
                              {new Date(breach.BreachDate!).getFullYear()}
                            </div>
                          </div>
                        </div>

                        <div className={`bg-white p-6 rounded-lg shadow-md w-full md:w-[43%] ${index % 2 === 0 ? "md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0"}`}>
                          
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {breach.Title || breach.Name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Domain:</strong> {breach.Domain}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Date:</strong> {new Date(breach.BreachDate!).toLocaleDateString()}
                          </p>


                          {breach.PwnCount && (
                            <p className="text-[#C7E333] text-sm font-medium">
                              {breach.PwnCount.toLocaleString()} accounts affected
                            </p>
                          )}
                          {breach.DataClasses?.length && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {breach.DataClasses.map((item, i) => (
                                <span
                                  key={i}
                                  className="bg-[#C7E333]/10 text-[#C7E333] border border-[#C7E333] px-3 py-1 rounded-full text-xs"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          )}
                          {breach.Description && (
                            <p className="text-sm text-gray-700 mt-4" dangerouslySetInnerHTML={{ __html: breach.Description }} />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <div className="text-center mt-10">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-green-600">Good news — no pwnage!</h3>
                <p className="text-gray-700">Your email has not been found in any known breaches.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
