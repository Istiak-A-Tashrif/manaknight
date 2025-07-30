import React from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full min-h-[100px] p-5 bg-white border border-[#E5E5E5] rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-[#333333] text-base leading-relaxed resize-y font-sans placeholder:text-gray-400 hover:border-[#D1D1D1] focus:border-[#D1D1D1] focus:outline-none transition-colors duration-200"
    />
  );
}