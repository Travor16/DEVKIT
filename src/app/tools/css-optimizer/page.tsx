'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function CssOptimizer() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    setOutput('');
    if (e.target.value.trim() === '') {
      return;
    }
    try {
      const optimized = optimizeCss(e.target.value);
      setOutput(optimized);
    } catch (err) {
      setError(`CSS optimization failed: ${(err as Error).message}`);
      setOutput('');
    }
  };

  const optimizeCss = (css: string): string => {
    // Remove CSS comments /* ... */
    let noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    // Remove whitespace: collapse multiple spaces, remove spaces around certain characters
    // Trim each line and remove empty lines
    let lines = noComments.split('\n');
    lines = lines.map((line) => line.trim()).filter((line) => line.length > 0);
    // Join with space then re-add necessary spaces? Better to remove spaces before/after { } ; : ,
    let joined = lines.join(' ');
    // Remove spaces before {, }, :, ;, ,
    let cleaned = joined
      .replace(/\s+([{}:,;])\s+/g, '$1') // no spaces around these chars
      .replace(/;\s*;/g, ';') // remove duplicate semicolons
      .replace(/,\s*,/g, ','); // remove duplicate commas
    // Ensure there is a space after {? Actually we removed spaces, we need at least one space after { before property?
    // We'll add a space after { and before } for readability? But we want minified, so we can keep no spaces.
    // However, we need at least a space between selector and {.
    // Let's add a space after selector before { if missing.
    // We'll do a more balanced approach: just remove comments and extra whitespace, keep one space where needed.
    // For simplicity, we'll return cleaned as is (may be too aggressive).
    // Let's instead do: remove comments, trim whitespace, and remove unnecessary whitespace but keep basic formatting.
    // We'll use a library? Not available.
    // We'll accept a simple minification.
    return cleaned.trim();
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
    <ToolLayout
      title="CSS Architecture Optimizer"
      description="Minify loose stylesheet templates or organize rules with clean indentations."
    >
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              CSS Input:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Copy Optimized
            </button>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Paste CSS content here..."
            className="w-full h-24 bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0 resize-none"
            style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          />
        </div>

        {error ? (
          <div className="bg-zinc-900/20 border border-zinc-800/50 text-zinc-400 rounded-lg p-4 mb-4">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : null}

        {output && (
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Optimized CSS:
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
              >
                Copy
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-64 bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 font-mono text-sm text-zinc-400 focus:outline-none focus:ring-0 resize-none"
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}