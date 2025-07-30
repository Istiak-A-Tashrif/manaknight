import React from 'react';
import { MessageSquare, Send } from 'lucide-react';

export function Chat() {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: 'Hello! I\'m Bolt, your AI programming assistant. How can I help you today?' }
  ]);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center gap-2 p-3 border-b">
        <MessageSquare className="w-5 h-5" />
        <span className="font-medium">Chat</span>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-gray-100'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}