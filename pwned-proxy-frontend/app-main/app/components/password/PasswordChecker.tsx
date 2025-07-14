"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

async function sha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [display, setDisplay] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (loading) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleCheck();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      setPassword((p) => p.slice(0, -1));
      setDisplay((d) => d.slice(0, -1));
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setPassword((p) => p + e.key);
      setDisplay((d) => d + "\u2022");
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (loading) return;
    const text = e.clipboardData.getData("text");
    if (text) {
      e.preventDefault();
      setPassword((p) => p + text);
      setDisplay((d) => d + "\u2022".repeat(text.length));
    }
  };

  const handleCheck = async () => {
    if (!password) return;
    const original = password;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const hash = await sha1(password);
      const prefix = hash.slice(0, 5);
      const suffix = hash.slice(5);
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: {
          "Add-Padding": "true",
          "User-Agent": "pwned-proxy-frontend",
        },
      });
      if (!res.ok) throw new Error("API request failed");
      const text = await res.text();
      const lines = text.split("\n");
      let count: number | null = null;
      for (const line of lines) {
        const [hashSuffix, hits] = line.trim().split(":");
        if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
          count = parseInt(hits, 10);
          break;
        }
      }
      const finalCount = count === null ? 0 : count;
      setResult(finalCount);
      if (finalCount === 0) {
        import("canvas-confetti")
          .then((mod) => {
            const confetti = mod.default;
            confetti({ particleCount: 100, spread: 70, origin: { x: 0.5, y: 0.7 } });
            confetti({
              particleCount: 80,
              spread: 60,
              angle: 60,
              origin: { x: 0.1, y: 0.75 },
              gravity: 1.0,
              decay: 0.92,
              ticks: 180,
              colors: ["#C7E333", "#A8CC2A", "#22C55E"],
            });
            confetti({
              particleCount: 80,
              spread: 60,
              angle: 120,
              origin: { x: 0.9, y: 0.75 },
              gravity: 1.0,
              decay: 0.92,
              ticks: 180,
              colors: ["#C7E333", "#A8CC2A", "#22C55E"],
            });
          })
          .catch((e) => console.error("Failed to load confetti module:", e));
      }
    } catch (err) {
      setError((err as Error).message || "Error checking password");
    } finally {
      setLoading(false);
      setPassword("");
      // Clear the masked input after checking so users can easily enter a new password
      setDisplay("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Enter password"
          autoComplete="off"
          name="password-check-text"
          value={display}
          readOnly
          onKeyDown={handleInputKeyDown}
          onPaste={handlePaste}
          className="w-full max-w-md p-4 rounded-l-lg border border-gray-300 text-black focus:outline-none focus:border-green-500"
          disabled={loading}
          aria-label="Password"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="bg-[#C7E333] hover:bg-[#A8CC2A] text-white px-6 font-semibold rounded-r-lg disabled:opacity-50"
        >
          {loading ? "Checking…" : "Check"}
        </button>
      </div>
      {error && <div className="text-red-700 text-center">{error}</div>}
      {result !== null && (
        result > 0 ? (
          <div className="bg-red-100 border border-red-300 rounded-xl p-6 max-w-md mx-auto text-red-700 space-y-2">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h2 className="text-xl font-bold">Oh no — pwned!</h2>
            </div>
            <p>This password has been seen {result.toLocaleString()} times before in data breaches!</p>
            <p>
              This password has previously appeared in a data breach and should never be used. If you've ever used it anywhere before, change it immediately!
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="bg-white/90 border border-green-200 rounded-xl p-6 shadow max-w-md mx-auto text-gray-700">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-[#22C55E] mr-2" />
                <h2 className="text-xl font-bold text-[#22C55E]">Good news — no pwnage found!</h2>
              </div>
              <p>
                This password wasn't found in any of the Pwned Passwords loaded into Have I Been Pwned. That doesn't necessarily mean it's a good password, merely that it's not indexed on this site.
              </p>
            </div>
          </div>
        )
      )}
      <p className="text-sm text-gray-500 text-center">
        The password is hashed locally and only a partial hash is sent to the API for privacy.
      </p>
    </div>
  );
}
