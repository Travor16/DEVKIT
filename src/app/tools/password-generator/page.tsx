'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+~`|}{[]\:;?><,.-='
  };

  const generatePassword = () => {
    if (!('crypto' in window) || !('getRandomValues' in window.crypto)) {
      setError('Browser does not support crypto.getRandomValues');
      setPassword('');
      return;
    }
    let chars = charset.lowercase;
    if (useUppercase) chars += charset.uppercase;
    if (useNumbers) chars += charset.numbers;
    if (useSymbols) chars += charset.symbols;
    if (chars.length === 0) {
      setError('At least one character set must be selected');
      setPassword('');
      return;
    }
    try {
      const bytes = new Uint8Array(length);
      crypto.getRandomValues(bytes);
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
      }
      setPassword(result);
      setError(null);
    } catch (err) {
      setError(`Generation failed: ${(err as Error).message}`);
      setPassword('');
    }
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      alert('Copied to clipboard');
    });
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useNumbers, useSymbols]);

  return (
    <ToolLayout
      title="Secure Password Matrix"
      description="Generate complex passwords with precise parameter toggles (length, digits, special symbols)."
    >
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Password:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Copy
            </button>
          </div>
          <input
            type="text"
            value={password}
            readOnly
            className="w-full bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Length:
            </span>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              min="4"
              max="128"
              className="w-full max-w-xs bg-zinc-900/20 border border-zinc-800/80 rounded-xl px-3 py-1 text-zinc-400 focus:outline-none focus:ring-2 focus-ring-[#0071E3]/20"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <input
                type="checkbox"
                checked={useUppercase}
                onChange={(e) => setUseUppercase(e.target.checked)}
                className="h-4 w-4 text-[#0071E3] border-zinc-800/80"
              />
              Uppercase Letters
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <input
                type="checkbox"
                checked={useNumbers}
                onChange={(e) => setUseNumbers(e.target.checked)}
                className="h-4 w-4 text-[#0071E3] border-zinc-800/80"
              />
              Numbers
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <input
                type="checkbox"
                checked={useSymbols}
                onChange={(e) => setUseSymbols(e.target.checked)}
                className="h-4 w-4 text-[#0071E3] border-zinc-800/80"
              />
              Special Symbols
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-zinc-900/20 border border-zinc-800/50 text-zinc-400 rounded-lg p-4 mt-4">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}