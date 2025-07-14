
"use client";

import PasswordChecker from "../components/password/PasswordChecker";

export default function PasswordsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #E0F2FE 0%, rgb(182, 196, 155) 100%)",
        }}
      />
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold">
          <span className="text-[#2563EB]">Pwned </span>
          <span className="text-[#C7E333]">Passwords</span>
        </h1>
        <p className="text-lg text-gray-800">
          Find out if a password appears in known data breaches.
        </p>
        <PasswordChecker />
      </main>
    </div>
  );
}
