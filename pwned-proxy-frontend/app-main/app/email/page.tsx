// app/page.tsx

import type { Metadata } from "next";
import HomePage from "../components/HomePage";

// (Optional) Next.js 13+ metadata
// export const metadata: Metadata = {
//   title: "Have I Been Pwned",
//   description: "Check if an email address appears in a data breach",
// };

export default function Page() {
  return <HomePage />;
}
