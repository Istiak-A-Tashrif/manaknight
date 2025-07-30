import React from 'react';
import { Chat } from '../components/Chat';
import { Editor as CodeEditor } from '../components/Editor';

export function Editor() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="text-xl font-bold text-blue-500">Coding Challenge</div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-[25%_75%] gap-4 p-4">
        <div className="h-[calc(100vh-5rem)] rounded-lg border shadow-sm overflow-hidden">
          <Chat />
        </div>
        <div className="h-[calc(100vh-5rem)] rounded-lg border shadow-sm overflow-hidden">
          <CodeEditor />
        </div>
      </main>
    </div>
  );
}