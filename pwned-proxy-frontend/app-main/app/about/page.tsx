"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [groups, setGroups] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        console.log('[about] fetching group names');
        const res = await fetch("/api/group-names");
        console.log('[about] response status', res.status);
        if (!res.ok) throw new Error(`Failed to load groups: ${res.status}`);
        const data = await res.json();
        console.log('[about] data', data);
        if (!Array.isArray(data)) {
          throw new Error("Invalid group list returned");
        }
        setGroups(data as string[]);
      } catch (err) {
        console.error('[about] error fetching group names', err);
        setError((err as Error).message);
      }
    };
    load();
  }, []);

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  if (!groups) {
    return <div className="p-4">Loading…</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #E0F2FE 0%, rgb(182, 196, 155) 100%)",
        }}
      />
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <p className="text-lg text-gray-800">
          Contact
          <a
            href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'itsecurity@dtu.dk'}`}
            className="underline text-blue-600 ml-1"
          >
            {process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'itsecurity@dtu.dk'}
          </a>
          to request access.
        </p>
        <h2 className="text-xl font-semibold mt-6">Subscribed Universities</h2>
        <ul className="list-disc pl-5 text-left space-y-1">
          {groups.length > 0 ? (
            groups.map((g) => <li key={g}>{g}</li>)
          ) : (
            <li className="list-none">No groups configured</li>
          )}
        </ul>
        {/* Download Postman collection from public/haveibeenpwned.deic.dk.postman_collection_v2.json */}
        <div className="mt-8 flex justify-center">
          <a
            href="/haveibeenpwned.cert.dk.postman_collection_v2.json"
            download
            className="block"
          >
            <img
              src="/postman-icon-svgrepo-com.svg"
              alt="Download Postman collection"
              className="w-32 h-32 hover:opacity-80"
            />
          </a>
        </div>
      </main>
    </div>
  );
}
