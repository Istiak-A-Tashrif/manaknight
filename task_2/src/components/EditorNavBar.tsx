import React from 'react';
import { RefreshCw } from 'lucide-react';

export function EditorNavBar() {
  return (
    <div className="flex items-center gap-2 p-2 bg-[#1E1E1E] border-b border-gray-800">
      <input
        type="text"
        value="http://localhost:5173"
        readOnly
        className="flex-1 px-3 py-1 text-sm bg-[#2D2D2D] text-gray-300 rounded border border-gray-800 focus:outline-none focus:border-gray-600"
      />
      <button className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-[#2D2D2D] transition-colors">
        <RefreshCw className="w-4 h-4" />
      </button>
    </div>
  );
}