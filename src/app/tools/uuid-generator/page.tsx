'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function UuidGenerator() {
  const [count, setCount] = useState(1);
  const [uuids, setUuids] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      setCount(val);
      setError(null);
    } else {
      setError('Please enter a positive integer');
    }
  };

  const generateUuids = () => {
    if (!('crypto' in window) || !('randomUUID' in window.crypto)) {
      setError('Browser does not support crypto.randomUUID()');
      setUuids([]);
      return;
    }
    try {
      const generated: string[] = [];
      for (let i = 0; i < count; i++) {
        generated.push(crypto.randomUUID());
      }
      setUuids(generated);
      setError(null);
    } catch (err) {
      setError(`Generation failed: ${(err as Error).message}`);
      setUuids([]);
    }
  };

  const handleCopyAll = () => {
    if (uuids.length === 0) return;
    navigator.clipboard.writeText(uuids.join('\n')).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
    <ToolLayout
      title="UUID / GUID Batch Generator"
      description="Instantly generate randomized version-4 identity keys with quick clip-copy buttons."
    >
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Number of UUIDs:
            </span>
            <button
              onClick={handleCopyAll}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Copy All
            </button>
          </div>
          <input
            type="number"
            value={count}
            onChange={handleCountChange}
            min="1"
            className="w-full max-w-xs bg-zinc-900/20 border border-zinc-800/80 rounded-xl px-3 py-1 text-zinc-400 focus:outline-none focus:ring-2 focus-ring-[#0071E3]/20"
          />
          {error && (
            <div className="mt-2 text-zinc-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {uuids.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Generated UUIDs:
              </span>
              <button
                onClick={handleCopyAll}
                className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
              >
                Copy All
              </button>
            </div>
            <div className="bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4">
              <pre className="font-mono text-sm text-zinc-400 whitespace-pre-wrap">
                {uuids.join('\n')}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}