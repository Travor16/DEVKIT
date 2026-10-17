'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import CopyButton from '@/components/CopyButton';

export default function SqlFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const keywords = [
    'SELECT',
    'FROM',
    'WHERE',
    'JOIN',
    'INNER',
    'LEFT',
    'RIGHT',
    'OUTER',
    'UPDATE',
    'DELETE',
    'INSERT',
    'INTO',
    'VALUES',
    'SET',
    'CREATE',
    'TABLE',
    'ALTER',
    'DROP',
    'INDEX',
    'VIEW',
    'PROCEDURE',
    'FUNCTION',
    'TRIGGER',
    'ORDER BY',
    'GROUP BY',
    'HAVING',
    'LIMIT',
    'OFFSET',
    'UNION',
    'ALL',
    'DISTINCT',
    'AS',
    'ON',
    'AND',
    'OR',
    'NOT',
    'NULL',
    'IS',
    'IN',
    'LIKE',
    'BETWEEN',
    'EXISTS',
    'CASE',
    'WHEN',
    'THEN',
    'ELSE',
    'END',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setError(null);
    setOutput('');
    if (e.target.value.trim() === '') {
      return;
    }
    try {
      const formatted = formatSql(e.target.value);
      setOutput(formatted);
    } catch (err) {
      setError(`SQL formatting failed: ${(err as Error).message}`);
      setOutput('');
    }
  };

  const formatSql = (sql: string): string => {
    // We'll do a simple approach: split by whitespace and punctuation, but keep original spacing.
    // Instead, we'll replace each keyword with its uppercase version using regex with word boundaries.
    let result = sql;
    for (const kw of keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      result = result.replace(regex, kw);
    }
    return result;
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      alert('Copied to clipboard');
    });
  };

  return (
    <ToolLayout
      title="SQL Script Formatter"
      description="Clean up nested database queries, capitalizing syntax flags like SELECT, JOIN, and WHERE automatically."
    >
      <div className="space-y-6">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              SQL Input:
            </span>
            <button
              onClick={handleCopy}
              className="text-xs font-medium text-zinc-400 hover:text-[#0071E3] transition-colors"
            >
              Copy Formatted
            </button>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Paste SQL script here..."
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
                Formatted SQL:
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