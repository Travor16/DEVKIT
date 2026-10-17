'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import ToolLayout from '@/components/ToolLayout';

export default function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    setError(null);
    try {
      if (direction === 'encode') {
        // Encode to Base64
        const encoded = btoa(input);
        setOutput(encoded);
      } else {
        // Decode from Base64
        const decoded = atob(input);
        setOutput(decoded);
      }
    } catch (err) {
      setError('Invalid input for ' + (direction === 'encode' ? 'encoding' : 'decoding') + ': ' + (err as Error).message);
      setOutput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-convert as user types
    if (e.target.value.trim() === '') {
      setOutput('');
      setError(null);
    } else {
      convert();
    }
  };

  return (
    <ToolLayout
      title="Base64 Encoder & Decoder"
      description="Encode strings to Base64 format or decode them back quickly. Safe client-side data conversion tool."
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-slate-400">
            <span>Mode:</span>
            <div className="flex gap-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="encode"
                  checked={direction === 'encode'}
                  onChange={e => setDirection(e.target.value as 'encode')}
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700/50"
                />
                Encode
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="decode"
                  checked={direction === 'decode'}
                  onChange={e => setDirection(e.target.value as 'decode')}
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700/50"
                />
                Decode
              </label>
            </div>
          </label>
        </div>
        {error ? (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg p-4">
            <p className="font-medium">{error}</p>
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-2 block text-slate-400">Input</label>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Enter text to encode or Base64 to decode..."
              className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white w-full h-96 resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="mb-2 block text-slate-400">Output</label>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-400">Result:</span>
              <CopyButton text={output} size="sm" />
            </div>
            <textarea
              value={output}
              readOnly
              className="bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors text-white w-full h-96 resize-none"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}