'use client';

import { useState, useRef, useEffect } from 'react';
import CopyButton from '@/components/CopyButton';
import ToolLayout from '@/components/ToolLayout';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentMode, setIndentMode] = useState<'2' | '4' | 'minify'>('2');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Example JSON for paste
  const exampleJSON = `{
  "name": "DevKit",
  "version": "1.0.0",
  "tools": [
    { "name": "JSON Formatter", "category": "Formatters" },
    { "name": "Base64 Encoder", "category": "Converters" }
  ],
  "features": {
    "instant": true,
    "clientSide": true,
    "zeroConfig": true
  }
}`;

  // Debounced formatting logic
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      if (input.trim() === '') {
        setOutput('');
        setError(null);
        return;
      }
      try {
        const parsed = JSON.parse(input);
        if (indentMode === 'minify') {
          setOutput(JSON.stringify(parsed));
        } else {
          const indentSize = indentMode === '2' ? 2 : 4;
          setOutput(JSON.stringify(parsed, null, indentSize));
        }
        setError(null);
      } catch (err) {
        setError(`Invalid JSON: ${(err as Error).message}`);
        setOutput('');
      }
    }, 150);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [input, indentMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleClear = () => {
    setInput('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[#0071E3]', 'bg-zinc-900/30');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-[#0071E3]', 'bg-zinc-900/30');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[#0071E3]', 'bg-zinc-900/30');
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setInput(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handlePasteExample = () => {
    setInput(exampleJSON);
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, beautify, and validate JSON data instantly in your browser. Clean, fast, safe, and entirely client-side."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Input Pane */}
        <div className="bg-zinc-950/20 border border-zinc-800/80 rounded-xl overflow-hidden focus-within:border-[#0071E3]/50 transition-all flex flex-col h-full">
          {/* Left Utility Tray */}
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/10 border-b border-zinc-800/20">
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <span>Length: {input.length}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors">
              <button
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                onClick={handlePasteExample}
              >
                Paste Example
              </button>
            </div>
          </div>

          {/* Input Textarea with DND */}
          <div className="flex-1 p-4 relative">
            {!input && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-start pl-6 pointer-events"
                onClick={handlePasteExample}
              >
                <span className="text-zinc-500 italic">
                  Paste example JSON →
                </span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder=""
              className="w-full h-full bg-zinc-950/20 border-none font-mono text-sm text-white focus:outline-none focus:ring-0 resize-none p-0"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          </div>
        </div>

        {/* Output Pane */}
        <div className="bg-zinc-950/20 border border-zinc-800/80 rounded-xl overflow-hidden focus-within:border-[#0071E3]/50 transition-all flex flex-col h-full">
          {/* Right Utility Tray */}
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/10 border-b border-zinc-800/20">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <span>Output:</span>
              <CopyButton text={output} size="sm" className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors" />
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors">
              {indentMode === 'minify' ? 'Minified' : `${indentMode === '2' ? '2' : '4'} spaces`}
            </div>
          </div>

          {/* Output Textarea */}
          <div className="flex-1 p-4">
            <textarea
              value={output}
              readOnly
              className="w-full h-full bg-zinc-950/20 border-none font-mono text-sm text-slate-400 focus:outline-none focus:ring-0 resize-none p-0"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            />
          </div>
        </div>
      </div>

      {/* Floating Error Panel */}
      {error && (
        <div className="fixed bottom-2 right-2 z-50 bg-zinc-900/20 border border-zinc-800/50 text-zinc-400 rounded-lg p-4 max-w-xs">
          <p className="font-medium mb-1">JSON Error</p>
          <p className="text-sm font-mono">{error}</p>
        </div>
      )}
    </ToolLayout>
  );
}