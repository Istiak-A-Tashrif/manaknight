import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const lines = value.split('\n');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const preRef = React.useRef<HTMLPreElement>(null);
  const [highlighted, setHighlighted] = React.useState('');

  React.useEffect(() => {
    const highlighted = Prism.highlight(
      value,
      Prism.languages.tsx,
      'tsx'
    );
    setHighlighted(highlighted);
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.currentTarget.scrollTop;
      preRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };
  
  return (
    <div className="relative h-full bg-[#1E1E1E] text-gray-300 font-mono text-sm overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-2 pt-4 text-gray-500 select-none bg-[#1E1E1E] border-r border-gray-800 z-10">
        {lines.map((_, i) => (
          <div key={i} className="leading-6 h-6">
            {i + 1}
          </div>
        ))}
      </div>
      <pre 
        ref={preRef}
        className="absolute left-12 right-0 top-0 bottom-0 m-0 py-4 px-2 overflow-auto pointer-events-none z-20"
        style={{ 
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: '14px',
          lineHeight: '24px',
          letterSpacing: '0',
          tabSize: 2
        }}
      >
        <code 
          className="whitespace-pre leading-6"
          dangerouslySetInnerHTML={{ __html: highlighted }} 
        />
      </pre>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className="absolute left-12 right-0 top-0 bottom-0 w-full h-full py-4 px-2 bg-transparent resize-none focus:outline-none leading-6 text-transparent caret-white z-30 overflow-auto"
        style={{ 
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: '14px',
          lineHeight: '24px',
          letterSpacing: '0',
          tabSize: 2,
          whiteSpace: 'pre',
          wordWrap: 'normal'
        }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
}