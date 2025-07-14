
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Server-side session check
  const session = await getServerSession(authOptions);

  // 2. If no session, redirect to sign in
  if (!session) {
    redirect("/api/auth/signin");
  }

  return <>{children}</>;
}
