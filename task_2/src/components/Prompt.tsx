import React from 'react';
import { Sparkles } from 'lucide-react';

export function Prompt() {
  return (
    <div className="border-b bg-white">
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex items-start gap-4">
          <textarea
            className="flex-1 p-3 h-32 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what you want to build..."
          />
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Sparkles className="w-5 h-5" />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}