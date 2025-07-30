import React from 'react';

export function EditorTabs() {
  return (
    <div className="flex items-center bg-[#252526] border-b border-gray-800">
      <button className="px-4 py-2 text-sm text-white bg-[#1E1E1E] border-r border-gray-800">
        Code
      </button>
      <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
        Preview
      </button>
    </div>
  );
}