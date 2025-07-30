import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  path: string;
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  const parts = path.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center gap-1 px-3 py-1 bg-[#1E1E1E] text-gray-400 text-sm border-b border-gray-800">
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-3 h-3" />}
          <span className="hover:text-white cursor-pointer">
            {part}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}