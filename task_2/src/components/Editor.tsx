import React from 'react';
import { FileTree } from './FileTree';
import { CodeEditor } from './CodeEditor';
import { EditorTabs } from './EditorTabs';
import { EditorNavBar } from './EditorNavBar';
import { Breadcrumb } from './Breadcrumb';

export function Editor() {
  const [currentFile, setCurrentFile] = React.useState('/src/App.tsx');
  
  // Mock file contents
  const fileContents: Record<string, string> = {
    '/src/App.tsx': `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Editor } from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,
    '/src/components/Chat.tsx': `import React from 'react';
import { Send } from 'lucide-react';

export function Chat() {
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState([
    { type: 'assistant', content: 'Hello! How can I help you today?' },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { type: 'user', content: message },
      { type: 'assistant', content: 'This is a mock response.' }
    ]);
    setMessage('');
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Chat Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={\`\${msg.type === 'user' ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100'} p-3 rounded-lg max-w-xs\`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}`,
    '/src/components/Editor.tsx': `import React from 'react';
import { FileTree } from './FileTree';
import { CodeEditor } from './CodeEditor';
import { EditorTabs } from './EditorTabs';
import { EditorNavBar } from './EditorNavBar';
import { Breadcrumb } from './Breadcrumb';

export function Editor() {
  // This is the main editor component
  // It manages the file tree, tabs, and code editor
  
  return (
    <div className="h-full flex flex-col bg-[#1E1E1E]">
      <EditorTabs />
      <EditorNavBar />
      <div className="flex-1 flex">
        <FileTree onFileSelect={() => {}} />
        <div className="flex-1">
          <CodeEditor value="" onChange={() => {}} />
        </div>
      </div>
    </div>
  );
}`,
    '/src/components/Prompt.tsx': `import React from 'react';
import { Wand2 } from 'lucide-react';

export function Prompt() {
  const [prompt, setPrompt] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    console.log('Prompt submitted:', prompt);
    setPrompt('');
  };

  return (
    <div className="bg-white border-b p-4">
      <form onSubmit={handleSubmit} className="max-w-screen-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-500"
          >
            <Wand2 className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}`
  };

  const [code, setCode] = React.useState(fileContents[currentFile]);

  const handleFileSelect = (path: string) => {
    setCurrentFile(path);
    setCode(fileContents[path] || `// File: ${path}\n// Content would be loaded here`);
  };

  return (
    <>
    <EditorTabs />
        <EditorNavBar />
    <div className="h-full flex bg-[#1E1E1E]">
      <FileTree onFileSelect={handleFileSelect} />
      <div className="flex-1 flex flex-col">
        <Breadcrumb path={currentFile} />
        <CodeEditor
          value={code}
          onChange={setCode}
        />
      </div>
    </div>
      </>
  );
}