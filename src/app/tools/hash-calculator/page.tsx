'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function HashCalculator() {
  const [input, setInput] = useState('');
  const [algorithm, setAlgorithm] = useState<'SHA-1' | 'SHA-256'>('SHA-256');
  const [hash, setHash] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    setHash('');
    if (e.target.value.trim() === '') {
      return;
    }
    computeHash(e.target.value);
  };

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value as any);
    setError(null);
    setHash('');
    if (input.trim() !== '') {
      computeHash(input);
    }
  };

  const computeHash = async (data: string) => {
    if (!('crypto' in window) || !('subtle' in window.crypto)) {
      setError('Browser does not support Web Crypto API');
      setHash('');
      return;
    }
    try {
      const enc = new TextEncoder();
      const dataBuf = enc.encode(data);
      let hashBuf: ArrayBuffer;
      if (algorithm === 'SHA-1') {
        hashBuf = await crypto.subtle.digest('SHA-1', dataBuf);
      } else {
        hashBuf = await crypto.subtle.digest('SHA-256', dataBuf);
      }
      const hashArray = Array.from(new Uint8Array(hashBuf));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      setHash(hashHex.toLowerCase());
      setError(null);
    } catch (err) {
      setError(`Hash computation failed: ${(err as Error).message}`);
      setHash('');
    }
  };

  const handleCopy = () => {
    if (!hash) return;
    navigator.clipboard.writeText(hash).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
    <ToolLayout
      title="Hash/Checksum Calculator"
      description="Generate instant security checksum hashes (MD5, SHA-1, SHA-256) from raw input text blocks."
    >
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Input:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Copy Hash
            </button>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Enter text to hash..."
            className="w-full h-24 bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0 resize-none"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Algorithm:
          </span>
          <select
            value={algorithm}
            onChange={handleAlgorithmChange}
            className="bg-zinc-900/20 border border-zinc-800/80 rounded-xl px-3 py-1 text-zinc-400 focus:outline-none focus:ring-2 focus-ring-[#0071E3]/20"
          >
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
          </select>
        </div>

        {hash && (
          <div className="flex flex-col mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Hash:
            </span>
            <input
              type="text"
              value={hash}
              readOnly
              className="w-full bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0"
            />
          </div>
        )}

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