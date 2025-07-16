// app/components/Footer.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Github } from "lucide-react";

export default function Footer() {
  // Keep track of user’s theme choice. Default is "auto".
  const [theme, setTheme] = useState<"auto" | "light" | "dark">("auto");

  // On first mount, load from localStorage (if present)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as
        | "auto"
        | "light"
        | "dark"
        | null;
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, []);

  // Whenever `theme` changes, apply the corresponding class logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      const htmlEl = document.documentElement;

      if (theme === "dark") {
        htmlEl.classList.add("dark");
      } else if (theme === "light") {
        htmlEl.classList.remove("dark");
      } else {
        // "auto" => system preference
        if (
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          htmlEl.classList.add("dark");
        } else {
          htmlEl.classList.remove("dark");
        }
      }

      // Store in localStorage
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <footer
      className="
        w-full 
        border-t 
        p-4 
        flex 
        items-center 
        justify-between
        bg-tnLight-bg 
        text-tnLight-text
        border-tnLight-border
        dark:bg-tnStorm-bg
        dark:text-tnStorm-text
        dark:border-tnStorm-border
      "
    >
      {/* Left side: The triple-mode selector */}
      <div className="text-sm flex items-center space-x-2">
        <label htmlFor="themeSelector" className="sr-only">
          Theme Selector
        </label>
        <select
          id="themeSelector"
          value={theme}
          onChange={(e) => setTheme(e.target.value as "auto" | "light" | "dark")}
          className="border px-2 py-1 rounded-sm
                     bg-tnLight-bg text-tnLight-text
                     dark:bg-tnStorm-bg dark:text-tnStorm-text
                     border-tnLight-border dark:border-tnStorm-border
                     cursor-pointer
          "
        >
          <option value="auto">Auto (system)</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Right side: GitHub links and message */}
      <div className="text-sm flex items-center space-x-3">
        <span>© {new Date().getFullYear()} Pwned Proxy</span>
        <a
          href="https://github.com/dtuait/pwned-proxy-combined"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:underline"
        >
          <Github className="w-4 h-4 mr-1" />
          GitHub
        </a>
        <span>Get involved on GitHub!</span>
      </div>
    </footer>
  );
}
