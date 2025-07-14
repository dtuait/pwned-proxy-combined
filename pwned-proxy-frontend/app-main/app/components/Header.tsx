"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

export default function Header() {
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: `https://${process.env.NEXT_PUBLIC_MY_DOMAIN}`,
    });

    window.location.href = `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=https://${process.env.NEXT_PUBLIC_MY_DOMAIN}`;
  };

  return (
    <header
      className="
        w-full 
        flex 
        items-center 
        justify-between 
        p-4 
        border-b 
        bg-tnLight-bg
        border-tnLight-border
        dark:bg-tnStorm-bg 
        dark:border-tnStorm-border
      "
    >
      {/* Left side: site logo or title */}
      <Link href="/">
        <h1 className="text-lg font-bold text-tnLight-accent dark:text-tnStorm-accent flex items-center">
          <img
            src="https://www.deic.dk/themes/custom/deic/logo.svg"
            alt="Deic logo"
            className="h-6 mr-2"
          />
          HaveIBeenPwned
        </h1>
      </Link>

      {/* Right side: actions */}
      <div className="flex items-center space-x-4">
        <Link
          href={
            process.env.NEXT_PUBLIC_HIBP_PROXY_URL ||
            'https://preview.api.haveibeenpwned.cert.dk/'
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="
              bg-blue-600
              text-white
              px-3 py-1
              rounded-sm
              hover:opacity-90
              dark:bg-blue-500
            "
          >
            API
          </button>
        </Link>
        <Link href="/email">
          <button
            className="
              bg-green-600
              text-white
              px-3 py-1
              rounded-sm
              hover:opacity-90
              dark:bg-green-500
            "
          >
            Email
          </button>
        </Link>
        <Link href="/passwords">
          <button
            className="
              bg-green-600
              text-white
              px-3 py-1
              rounded-sm
              hover:opacity-90
              dark:bg-green-500
            "
          >
            Passwords
          </button>
        </Link>

        {status === "loading" && <span className="text-sm">Loading...</span>}

        {session?.user ? (
          <UserAvatar
            name={session.user.name || session.user.email || ""}
            onClick={handleSignOut}
          />
        ) : (
          <button
            className="
              hidden
              bg-deic-green
              text-black
              px-3 py-1
              rounded-sm
              hover:opacity-90
              dark:bg-deic-green
              dark:text-black
            "
            onClick={() => signIn("azure-ad")}
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
