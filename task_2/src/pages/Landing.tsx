import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = React.useState('');

  const handleGenerate = () => {
    if (prompt.trim()) {
      navigate('/editor');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="text-xl font-bold text-blue-500">Coding Challenge</div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-4 h-40 text-lg rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what you want to build..."
          />
          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Generate
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}