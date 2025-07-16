"use client";

export default function AboutPage() {

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
        <p className="text-gray-700">This information is currently unavailable.</p>
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
