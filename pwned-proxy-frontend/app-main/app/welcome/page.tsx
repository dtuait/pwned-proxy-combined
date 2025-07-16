"use client";

import { useSession, signOut  } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";


import BreachedAccount from '../components/breach/BreachedAccount';
import { DashboardButton } from '../components/DashboardButton';
import { CategoryCard } from "../components/CategoryCard";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [debugResponse, setDebugResponse] = useState<any>(null);

  if (status === 'loading') return null;
  if (!session) {
    router.push('/api/auth/signin?callbackUrl=/welcome');
    return null;
  }

  async function fetchStealerLogs() {
    try {
      const baseUrl = (
        process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
        'http://api.haveibeenpwned.cert.dk'
      ).replace(/\/$/, '');
      const res = await fetch(
        `${baseUrl}/api/v3/stealer-logs-domain/dtu.dk/`,
        {
          headers: {
            // session is validated above, so assert non-null
            Authorization: `Bearer ${session!.accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      setDebugResponse(await res.json());
    } catch (err) {
      setDebugResponse({ error: String(err) });
    }
  }

  const goToBreachChecker = () => {
    router.push('/breach-checker');
  };

  const categories = [
    {
      title: 'Email Checks',
      desc: 'Requires email + API key',
      tools: [
        { label: 'Breached Account',    path: '/breach-checker' },
        { label: 'Paste Account',       path: '/paste-account' },
        { label: 'Stealer Logs (Email)',path: '/stealer-logs-email' },
        { label: 'Pwned Passwords',     path: '/pwned-passwords' },
      ],
    },
    {
      title: 'Domain & Website Checks',
      desc: 'Requires domain/website + API key',
      tools: [
        { label: 'Breached Domain Search', path: '/breached-domain-search' },
        { label: 'Stealer Logs (Domain)',   path: '/stealer-logs-domain' },
        { label: 'Stealer Logs (Website)',  path: '/stealer-logs-website' },
      ],
    },
    {
      title: 'Subscription & Metadata',
      desc: 'Requires only API key',
      tools: [
        { label: 'All Breaches',        path: '/all-breaches' },
        { label: 'Single Breach',       path: '/single-breach' },
        { label: 'Data Classes',        path: '/data-classes' },
        { label: 'Subscription Domains',path: '/subscription-domains' },
        { label: 'Subscription Status', path: '/subscription-status' },
      ],
    },
  ];

  return (
    <main className="relative min-h-screen bg-[#1a1b26] text-[#a9b1d6] p-6">
      {/* Sign Out in top-right */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="
          absolute top-6 right-6        /* position it */
          px-4 py-2                     /* padding */
          rounded-md                    /* rounded corners */
          border-2 border-[#9ece6a]     /* lime border */
          text-[#9ece6a]                /* lime text */
          hover:bg-[#27304e]            /* hover background */
          transition
        "
      >
        Sign Out
      </button>
      

      {/* User Info */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-[#7aa2f7]">
          Welcome, <span className="text-[#9ece6a]">{session.user?.name}</span>
        </h1>
        <p className="mt-1">Logged in as {session.user?.email}</p>
      </div>

      {/* ==== HERE: embed your iframe ==== */}
      <section className="max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-semibold text-[#7aa2f7] mb-2">
          Live API Preview
        </h2>

        {/* Scrollable “window” box */}
        <div className="border border-gray-700 rounded overflow-auto h-80">
          <iframe
            src={
              process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
              'http://api.haveibeenpwned.cert.dk/'
            }
            title="Backend API Preview"
            className="w-full min-h-full"
          />
        </div>

        {/* Click-out link */}
        <a
          href={
            process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
            'http://api.haveibeenpwned.cert.dk/'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-[#9ece6a] hover:underline"
        >
          Open full API site →
        </a>
      </section>




    </main>
  );
}