import { ReactNode } from 'react';

/**
 * A reusable card for a dashboard category.
 * Ensures consistent header, description, and button alignment.
 */
export function CategoryCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col bg-[#24283b] rounded-lg shadow-sm overflow-hidden">
      {/* Top section with colored accent */}
      <div className="bg-[#1f2335] border-t-4 border-[#7aa2f7] px-6 py-4">
        <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
        <p className="text-sm text-[#a9b1d6] mt-1 leading-snug">{description}</p>
      </div>

      {/* Content area: buttons or other controls */}
      <div className="p-6 flex flex-col gap-4">
        {children}
      </div>
    </div>
  );
}
