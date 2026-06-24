import React, { useRef, useEffect, useState } from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export default function EditableField({ 
  value, 
  onChange, 
  className = '', 
  multiline = false,
  placeholder = 'Type here...' 
}: EditableFieldProps) {
  const contentEditableRef = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (contentEditableRef.current && !isFocused && contentEditableRef.current.innerText !== value) {
      contentEditableRef.current.innerText = value || '';
    }
  }, [value, isFocused]);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const newValue = e.currentTarget.innerText;
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      contentEditableRef.current?.blur();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  const baseStyles = "outline-none transition-colors border border-transparent hover:border-black/10 focus:border-black/30 rounded px-1 min-w-[20px] empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 print:before:content-none print:empty:hidden relative inline-block break-words max-w-full";
  
  return (
    <div className={`group relative max-w-full ${multiline ? 'block' : 'inline-block'}`}>
      {multiline ? (
        <div
          ref={contentEditableRef as React.RefObject<HTMLDivElement>}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={handleInput}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onFocus={() => setIsFocused(true)}
          onPaste={handlePaste}
          className={`${baseStyles} whitespace-pre-wrap overflow-hidden ${className}`}
        />
      ) : (
        <span
          ref={contentEditableRef as React.RefObject<HTMLSpanElement>}
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onFocus={() => setIsFocused(true)}
          onPaste={handlePaste}
          className={`${baseStyles} whitespace-normal overflow-hidden ${className}`}
        />
      )}
    </div>
  );
}
