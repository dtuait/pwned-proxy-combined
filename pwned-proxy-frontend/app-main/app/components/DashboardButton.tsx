// components/DashboardButton.tsx
'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface DashboardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export function DashboardButton({
  children,
  className = '',
  ...props
}: DashboardButtonProps) {
  return (
      <button
      {...props}
      className={`
        w-full text-center py-2 px-4 rounded-md font-medium transition
        bg-[#24283b]
        text-white
-       border border-[#2f3344]
+       border border-[#a9b1d6]/50    /* now matches explanatory text color */
        hover:bg-[#2d3145]
        hover:border-[#9ece6a]
        hover:text-[#9ece6a]
        focus:outline-none focus:ring-2 focus:ring-[#9ece6a]
        ${className}
      `}
    >
      {children}
    </button>
  );
}