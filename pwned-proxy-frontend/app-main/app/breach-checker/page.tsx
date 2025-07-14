"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BreachedAccount from '../components/breach/BreachedAccount';

export default function BreachCheckerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-center text-gray-300">Loading...</p>;
  }

  // If the user is not authenticated, redirect to sign-in
  if (!session) {
    router.push("/api/auth/signin?callbackUrl=/breach-checker");
    return null;
  }

   // Main page layout
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0d0f14]">
      <div className="w-full max-w-3xl p-8 rounded-2xl bg-gradient-to-r from-[#1e2030] to-[#15161f] shadow-xl ring-1 ring-[#2f323f]">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="text-[#7aa2f7] hover:text-[#9ec2ff] transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-extrabold text-[#9ece6a]">Breach Checker</h1>
        </div>

        {/* This component handles the email input, API call, and results display */}
        <BreachedAccount />
      </div>
    </main>
  );
}
